import { useEffect, useRef } from "react";
import { DataCategoryEnum, MarkerData } from "./types";
import { mat4, vec3 } from "gl-matrix";
import { cylinder } from "./glMeshes/cylinder";
import { vertexShaderSource } from "./shaders/vertexShader";
import { fragmentShaderSource } from "./shaders/fragmentShader";
import { normaliseLatLng } from "./helpers/normaliseLatLng";
import { normaliseValues } from "./helpers/normaliseValues";
import data from "./data/countryData.json";

type Props = {
  dataCategory: DataCategoryEnum;
};

const markers = data.map((val) => {
  const { x, y } = normaliseLatLng(val.lat, val.lon);

  const maxPopulation = Math.max(...data.map((o) => o.population));
  const minPopulation = Math.min(...data.map((o) => o.population));

  const minGdp = Math.min(...data.map((o) => o.gdp));
  const maxGdp = Math.max(...data.map((o) => o.gdp));

  const minArea = Math.min(...data.map((o) => o.area));
  const maxArea = Math.max(...data.map((o) => o.area));

  const minElevation = Math.min(...data.map((o) => o.averageElevation));
  const maxElevation = Math.max(...data.map((o) => o.averageElevation));

  return {
    [DataCategoryEnum.Population]: normaliseValues(
      val.population,
      minPopulation,
      maxPopulation
    ),
    [DataCategoryEnum.Gdp]: normaliseValues(val.gdp, minGdp, maxGdp),
    [DataCategoryEnum.Area]: normaliseValues(val.area, minArea, maxArea),
    [DataCategoryEnum.Elevation]: normaliseValues(
      val.averageElevation,
      minElevation,
      maxElevation
    ),
    x,
    y,
    lat: val.lat,
    lon: val.lon,
    h: 0.3,
    country: val.country,
  };
});

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

    markers.forEach((marker: MarkerData) => {
      const { vertices, colors } = cylinder(
        marker.x,
        marker.y,
        Number(marker[dataCategory]) / 2,
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

    const render = () => {
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
      gl.disableVertexAttribArray(colorAttribLocation);
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
      gl.vertexAttrib2f(texCoordAttribLocation, 0.0, 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, allCylinderVertices.length / 3);
    };
  }, [dataCategory]);

  return (
    <canvas className="w-screen max-w-[1080px] aspect-[2/1]  " ref={canvasRef}>
      Canvas Not supported
    </canvas>
  );
};

export default Canvas;
