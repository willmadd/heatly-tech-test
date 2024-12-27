import { useEffect, useRef } from "react";
import { DataCategoryEnum, MarkerData, RawData } from "./types";
import { mat4, vec3 } from "gl-matrix";
import { cylinder } from "./GlMeshes/cylinder";

type Props = {
  dataCategory: DataCategoryEnum;
};

const markers: RawData[] = [
  {
    country: "Venezuela",
    lat: 6.42375,
    lon: -66.58973,
    population: 28435943,
    gdp: 482359316138,
    area: 916445,
    averageElevation: 450,
  },
  {
    country: "Vietnam",
    lat: 14.058324,
    lon: 108.277199,
    population: 97338579,
    gdp: 261921244843,
    area: 331210,
    averageElevation: 398,
  },
  {
    country: "Yemen",
    lat: 15.552727,
    lon: 48.516388,
    population: 29825964,
    gdp: 23486361504,
    area: 527968,
    averageElevation: 999,
  },
  {
    country: "Zambia",
    lat: -13.133897,
    lon: 27.849332,
    population: 18383955,
    gdp: 19320053844,
    area: 752618,
    averageElevation: 1138,
  },
  {
    country: "Zimbabwe",
    lat: -19.015438,
    lon: 29.154857,
    population: 14862924,
    gdp: 16768513924,
    area: 390757,
    averageElevation: 961,
  },
];

const Canvas = ({ dataCategory }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log("xyz");
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * pixelRatio;
    canvas.height = canvas.clientHeight * pixelRatio;

    const gl = canvas.getContext("webgl");

    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Enable depth testing but clear depth buffer before drawing background
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.0, 0.2, 0.3, 1.0);

    const vertexShaderSource = `
      attribute vec3 vertPosition;
      attribute vec2 vertTexCoord;
      attribute vec3 vertColor;
      attribute float isTextured;
      
      uniform mat4 uProjectionMatrix;
      uniform mat4 uViewMatrix;
      uniform mat4 uModelMatrix;
      
      varying vec2 fragTexCoord;
      varying vec3 fragColor;
      varying float fragIsTextured;
      
      void main() {
        fragTexCoord = vertTexCoord;
        fragColor = vertColor;
        fragIsTextured = isTextured;
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(vertPosition, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      
      varying vec2 fragTexCoord;
      varying vec3 fragColor;
      varying float fragIsTextured;
      
      uniform sampler2D sampler;
      
      void main() {
        if (fragIsTextured > 0.5) {
          gl_FragColor = texture2D(sampler, fragTexCoord);
        } else {
          gl_FragColor = vec4(fragColor, 1.0);
        }
      }
    `;

    // Create and compile shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      console.error("Error creating shaders");
      return;
    }

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // Create and link program
    const program = gl.createProgram();
    if (!program) {
      console.error("Error creating program");
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Get uniform locations
    const projectionMatrixLocation = gl.getUniformLocation(
      program,
      "uProjectionMatrix"
    );
    const viewMatrixLocation = gl.getUniformLocation(program, "uViewMatrix");
    const modelMatrixLocation = gl.getUniformLocation(program, "uModelMatrix");

    // Create matrices using gl-matrix
    const projectionMatrix = mat4.create();
    const viewMatrix = mat4.create();
    const modelMatrix = mat4.create();

    // Setup projection matrix with adjusted field of view
    mat4.perspective(
      projectionMatrix,
      (60 * Math.PI) / 180, // Increased FOV for better visibility
      canvas.width / canvas.height,
      0.1,
      100.0
    );

    // Adjust camera position for better visibility
    const eye = vec3.fromValues(0.0, -1.0, 1.0); // Moved further up for better visibility
    const center = vec3.fromValues(0, 0, 0);
    const up = vec3.fromValues(0, 1, 0);
    mat4.lookAt(viewMatrix, eye, center, up);

    // Initialize model matrix
    mat4.identity(modelMatrix);

    // Set uniform matrices
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

    // Set up background quad with adjusted Z position
    const quadVertices: number[] = [
      // X, Y, Z, U, V
      -0.75, -0.75, -0.0, 0.0, 0.0, -0.75, 0.75, -0.0, 0.0, 1.0, 0.75, -0.75,
      -0.0, 1.0, 0.0, -0.75, 0.75, -0.0, 0.0, 1.0, 0.75, 0.75, -0.0, 1.0, 1.0,
      0.75, -0.75, -0.0, 1.0, 0.0,
    ];

    // Create buffers for the quad
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(quadVertices),
      gl.STATIC_DRAW
    );

    let allCylinderVertices: number[] = [];
    let allCylinderColors: number[] = [];

    const processedMarkers: MarkerData[] = markers.map((marker) => ({
      ...marker,
      x: ((marker.lon + 180) / 360) * 1.5 - 0.75,
      y: (-(marker.lat + 90) / 180) * 1.5 + 0.75,
      h: 0,
      [DataCategoryEnum.Population]: marker.population,
      [DataCategoryEnum.Gdp]: marker.gdp,
      [DataCategoryEnum.Area]: marker.area,
      [DataCategoryEnum.Elevation]: marker.averageElevation,
    }));

    processedMarkers.forEach((marker: MarkerData) => {
      const { vertices, colors } = cylinder(
        marker.x,
        marker.y,
        Number(marker[dataCategory]),
        0.005,
        20,
        marker.country
      );
      allCylinderVertices.push(...vertices);
      allCylinderColors.push(...colors);
    });

    // Create buffers for cylinders
    const cylinderBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(allCylinderVertices),
      gl.STATIC_DRAW
    );

    const cylinderColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderColorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(allCylinderColors),
      gl.STATIC_DRAW
    );

    // Set up attribute locations
    const positionAttribLocation = gl.getAttribLocation(
      program,
      "vertPosition"
    );
    const texCoordAttribLocation = gl.getAttribLocation(
      program,
      "vertTexCoord"
    );
    const colorAttribLocation = gl.getAttribLocation(program, "vertColor");
    const isTexturedAttribLocation = gl.getAttribLocation(
      program,
      "isTextured"
    );

    // Load and set up texture
    const image = new Image();
    image.src = "/map.jpg";

    image.onload = () => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      // Render scene
      render();
    };

    function render() {
      if (!gl) return;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Draw textured quad (background)
      gl.disable(gl.DEPTH_TEST); // Disable depth test for background
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 20, 0);
      gl.vertexAttribPointer(
        texCoordAttribLocation,
        2,
        gl.FLOAT,
        false,
        20,
        12
      );
      gl.vertexAttrib3f(colorAttribLocation, 1, 1, 1);
      gl.vertexAttrib1f(isTexturedAttribLocation, 1.0);
      gl.enableVertexAttribArray(positionAttribLocation);
      gl.enableVertexAttribArray(texCoordAttribLocation);
      gl.disableVertexAttribArray(colorAttribLocation); // Disable color array for background
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Clean up background attributes
      gl.disableVertexAttribArray(texCoordAttribLocation);

      // Setup for cylinders
      gl.enable(gl.DEPTH_TEST);

      // Draw cylinders with fresh attribute state
      gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffer);
      gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionAttribLocation);

      gl.bindBuffer(gl.ARRAY_BUFFER, cylinderColorBuffer);
      gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(colorAttribLocation);

      gl.vertexAttrib1f(isTexturedAttribLocation, 0.0);
      gl.vertexAttrib2f(texCoordAttribLocation, 0.0, 0.0); // Reset texture coords

      gl.drawArrays(gl.TRIANGLES, 0, allCylinderVertices.length / 3);
    }
  }, [dataCategory]);

  return (
    <canvas
      className="w-screen max-w-[1080px] aspect-[2/1] bg-red-500 "
      ref={canvasRef}
    >
      Canvas Not supported
    </canvas>
  );
};

export default Canvas;
