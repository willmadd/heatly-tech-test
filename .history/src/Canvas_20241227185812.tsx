import { useEffect, useRef } from "react";
import { DataCategoryEnum, MarkerData, RawData } from "./types";
import { mat4, vec3 } from "gl-matrix";
import { cylinder } from "./glMeshes/cylinder";
import { vertexShaderSource } from "./shaders/vertexShader";
import { fragmentShaderSource } from "./shaders/fragmentShader";

type Props = {
  dataCategory: DataCategoryEnum;
};

const markers: RawData[] = [
  {
    country: "Syria",
    lat: 34.802075,
    lon: 38.996815,
    population: 17500658,
    gdp: 40405006007,
    area: 185180,
    averageElevation: 514,
  },
  {
    country: "Taiwan",
    lat: 23.69781,
    lon: 120.960515,
    population: 23816775,
    gdp: 668161000000,
    area: 36193,
    averageElevation: 1150,
  },
  {
    country: "Tajikistan",
    lat: 38.861034,
    lon: 71.276093,
    population: 9537645,
    gdp: 8194200000,
    area: 143100,
    averageElevation: 3186,
  },
  {
    country: "Tanzania",
    lat: -6.369028,
    lon: 34.888822,
    population: 59734218,
    gdp: 62409749261,
    area: 947303,
    averageElevation: 1018,
  },
  {
    country: "Thailand",
    lat: 15.870032,
    lon: 100.992541,
    population: 69799978,
    gdp: 501888992561,
    area: 513120,
    averageElevation: 287,
  },
  {
    country: "Timor-Leste",
    lat: -8.874217,
    lon: 125.727539,
    population: 1318445,
    gdp: 1821000000,
    area: 14874,
    averageElevation: 652,
  },
  {
    country: "Togo",
    lat: 8.619543,
    lon: 0.824782,
    population: 8278724,
    gdp: 7574639173,
    area: 56785,
    averageElevation: 236,
  },
  {
    country: "Tonga",
    lat: -21.178986,
    lon: -175.198242,
    population: 105695,
    gdp: 450122625,
    area: 747,
    averageElevation: 82,
  },
  {
    country: "Trinidad and Tobago",
    lat: 10.691803,
    lon: -61.222503,
    population: 1399488,
    gdp: 21589393939,
    area: 5128,
    averageElevation: 83,
  },
  {
    country: "Tunisia",
    lat: 33.886917,
    lon: 9.537499,
    population: 11818619,
    gdp: 39236610706,
    area: 163610,
    averageElevation: 246,
  },
  {
    country: "Turkey",
    lat: 38.963745,
    lon: 35.243322,
    population: 84339067,
    gdp: 719954821683,
    area: 783562,
    averageElevation: 1132,
  },
  {
    country: "Turkmenistan",
    lat: 38.969719,
    lon: 59.556278,
    population: 6031200,
    gdp: 45231428571,
    area: 488100,
    averageElevation: 230,
  },
  {
    country: "Tuvalu",
    lat: -7.109535,
    lon: 177.64933,
    population: 11792,
    gdp: 47271511,
    area: 26,
    averageElevation: 2,
  },
  {
    country: "Uganda",
    lat: 1.373333,
    lon: 32.290275,
    population: 45741007,
    gdp: 37600364799,
    area: 241550,
    averageElevation: 1100,
  },
  {
    country: "Ukraine",
    lat: 48.379433,
    lon: 31.16558,
    population: 44134693,
    gdp: 155582000000,
    area: 603550,
    averageElevation: 175,
  },
  {
    country: "United Arab Emirates",
    lat: 23.424076,
    lon: 53.847818,
    population: 9890402,
    gdp: 421142267937,
    area: 83600,
    averageElevation: 149,
  },
  {
    country: "United Kingdom",
    lat: 55.378051,
    lon: -3.435973,
    population: 67215293,
    gdp: 2827113184696,
    area: 242495,
    averageElevation: 162,
  },
  {
    country: "United States",
    lat: 37.09024,
    lon: -95.712891,
    population: 331002651,
    gdp: 20936600000000,
    area: 9833517,
    averageElevation: 760,
  },
  {
    country: "Uruguay",
    lat: -32.522779,
    lon: -55.765835,
    population: 3473730,
    gdp: 53628827440,
    area: 176215,
    averageElevation: 109,
  },
  {
    country: "Uzbekistan",
    lat: 41.377491,
    lon: 64.585262,
    population: 34232050,
    gdp: 57921286440,
    area: 447400,
    averageElevation: 420,
  },
  {
    country: "Vanuatu",
    lat: -15.376706,
    lon: 166.959158,
    population: 307145,
    gdp: 917058824,
    area: 12189,
    averageElevation: 420,
  },
  {
    country: "Vatican City",
    lat: 41.902916,
    lon: 12.453389,
    population: 825,
    gdp: 21000000,
    area: 0.44,
    averageElevation: 75,
  },
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

    const program = gl.createProgram();
    if (!program) {
      console.error("Error creating program");
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
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

    const quadVertices: number[] = [
      // X, Y, Z, U, V
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

      render();
    };

    function render() {
      if (!gl) return;
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
      gl.vertexAttrib3f(colorAttribLocation, 1, 1, 1);
      gl.vertexAttrib1f(isTexturedAttribLocation, 1.0);
      gl.enableVertexAttribArray(positionAttribLocation);
      gl.enableVertexAttribArray(texCoordAttribLocation);
      gl.disableVertexAttribArray(colorAttribLocation); // Disable color array for background
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      gl.disableVertexAttribArray(texCoordAttribLocation);

      gl.enable(gl.DEPTH_TEST);

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
