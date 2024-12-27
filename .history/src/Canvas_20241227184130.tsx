import { useEffect, useRef } from "react";
import { DataCategoryEnum, RawData } from "./types";
import { mat4, vec3 } from "gl-matrix";
import { cylinder } from "./GlMeshes/cylinder";

type Props = {
  dataCategory: DataCategoryEnum;
};

const markers: RawData[] = [
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

    const createShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Shader compile failed: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) {
      console.error("Error creating program");
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Program link failed: ${gl.getProgramInfoLog(program)}`);
      return;
    }

    gl.useProgram(program);

    const projectionMatrixLocation = gl.getUniformLocation(
      program,
      "uProjectionMatrix"
    );
    const viewMatrixLocation = gl.getUniformLocation(program, "uViewMatrix");
    const modelMatrixLocation = gl.getUniformLocation(program, "uModelMatrix");

    const projectionMatrix = mat4.create();
    const viewMatrix = mat4.create();
    const modelMatrix = mat4.create();

    mat4.perspective(
      projectionMatrix,
      (60 * Math.PI) / 180,
      canvas.width / canvas.height,
      0.1,
      100.0
    );

    const eye = vec3.fromValues(0.0, -1.0, 1.0);
    const center = vec3.fromValues(0, 0, 0);
    const up = vec3.fromValues(0, 1, 0);
    mat4.lookAt(viewMatrix, eye, center, up);

    mat4.identity(modelMatrix);

    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

    const quadVertices = [
      -0.75, -0.75, -0.0, 0.0, 0.0, -0.75, 0.75, -0.0, 0.0, 1.0, 0.75, -0.75,
      -0.0, 1.0, 0.0, -0.75, 0.75, -0.0, 0.0, 1.0, 0.75, 0.75, -0.0, 1.0, 1.0,
      0.75, -0.75, -0.0, 1.0, 0.0,
    ];

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(quadVertices),
      gl.STATIC_DRAW
    );

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

    const render = () => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.disable(gl.DEPTH_TEST);
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
      gl.enableVertexAttribArray(positionAttribLocation);
      gl.enableVertexAttribArray(texCoordAttribLocation);

      gl.vertexAttrib3f(colorAttribLocation, 1.0, 1.0, 1.0);
      gl.vertexAttrib1f(isTexturedAttribLocation, 1.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    render();
  }, [dataCategory]);

  return (
    <canvas
      className="w-screen max-w-[1080px] aspect-[2/1] bg-red-500"
      ref={canvasRef}
    >
      Canvas Not Supported
    </canvas>
  );
};

export default Canvas;
