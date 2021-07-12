function initializeVariables(){

  cx = 2.0;
  cy = 2.0;
  cz = 6.5;
  elevation = 0.01;
  angle = 0.01;
  delta = 1.0;
  lookRadius = 5;
  ConeIn=0.3;
  ConeOut=100;        
  Rho=1;                    
  
  utils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  //Extracting the position of the vertices, the normals, the indices, and the uv coordinates
  cabinetBuffer = {
    positions: cabinetModel.vertices,
    normals: cabinetModel.vertexNormals,
    indices: cabinetModel.indices,
    texcoord: cabinetModel.textures,
  }

  moleBuffer = {
    positions: moleModel.vertices,
    normals: moleModel.vertexNormals,
    indices: moleModel.indices,
    texcoord: moleModel.textures,
  }

  hammerBuffer = {
    positions: hammerModel.vertices,
    normals: hammerModel.vertexNormals,
    indices: hammerModel.indices,
    texcoord: hammerModel.textures,
  }
  platformBuffer = {
    positions: platformModel.vertices,
    normals: platformModel.vertexNormals,
    indices: platformModel.indices,
    texcoord: null,
  }
  //---------------------------------------------------------------------------------------

  //directional light definition and cone definition
  dirLightAlpha = -utils.degToRad(60);
  dirLightBeta  = -utils.degToRad(100);



  directionalLight = [-Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
        -Math.sin(dirLightAlpha),
        -Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
  ];
  
  //set light position to pass to the shader for the spot light (that uses the light position like in the point light)
  lightPosition[0] = Rho*Math.sin(dirLightBeta)*Math.cos(dirLightAlpha);
  lightPosition[1] = Rho*Math.sin(dirLightBeta)*Math.sin(dirLightAlpha);
  lightPosition[2] = Rho*Math.cos(dirLightBeta);

  dirLightColor = [1.0, 1.0, 1.0]; //initially white Color
  specularColor = [1.0, 1.0, 1.0];
  specShine = 24;

  platformColor = [0.5, 0.5, 0.5];
  //initializing non-textured object diffuse color (used instead of this)
  cabinetColor = [1.0, 1.0, 1.0];
  moleColor = [0.8, 0.8, 0.8];
  hammerColor = [0.5, 0.5, 0.5];
              
  positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
  uvAttributeLocation = gl.getAttribLocation(program, "a_uv");
  matrixLocation = gl.getUniformLocation(program, "matrix");
  textLocation = gl.getUniformLocation(program, "u_texture");
  materialDiffColorHandle = gl.getUniformLocation(program, 'mDiffColor');
  lightDirectionHandle = gl.getUniformLocation(program, 'lightDirection');
  normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');
  hasTexture = gl.getUniformLocation(program, 'hasTexture');
  dirLightColorHandle = gl.getUniformLocation(program, 'OlightColor');
  specColorHandle = gl.getUniformLocation(program, 'specularColor');
  worldViewMatrixLocation = gl.getUniformLocation(program, 'worldViewMatrix');
  specShineHandle = gl.getUniformLocation(program, 'specShine');
  ConeInHandle = gl.getUniformLocation(program, 'ConeSpotIn');
  ConeOutHandle = gl.getUniformLocation(program, 'ConeSpotOut');
  LightPosHandle = gl.getUniformLocation(program, 'LightPos');
  
  viewMatrix = utils.MakeView(cx, cy, cz, elevation, -angle);
  
  //LOAD TEXTURE
  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  image = new Image();
  image.src = baseDir+objsTexture;
  image.onload= function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);
  };
  //-------------------
}

function bindingBuffers(vao,objBuffer){

  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objBuffer.positions), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objBuffer.normals), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(normalAttributeLocation);
  gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  if(objBuffer.texcoord != null){
    uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objBuffer.texcoord), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(uvAttributeLocation);
    gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  }

  indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(objBuffer.indices), gl.STATIC_DRAW);

}

// event handler
var mouseState = false;
var lastMouseX = -100, lastMouseY = -100;

function doMouseDown(event) {
  lastMouseX = event.pageX;
  lastMouseY = event.pageY;
  mouseState = true;
}
function doMouseUp(event) {
  lastMouseX = -100;
  lastMouseY = -100;
  mouseState = false;
}

function doMouseMove(event) {
  if(mouseState) {
    var dx = event.pageX - lastMouseX;
    var dy = lastMouseY - event.pageY;
    lastMouseX = event.pageX;
    lastMouseY = event.pageY;

    if((dx != 0) || (dy != 0)) {
      angle = angle - 0.2 * dx;
      elevation = elevation + 0.2 * dy;

    }
  }
}

function doMouseWheel(event) {
  var nLookRadius = lookRadius + event.wheelDelta/300.0;
  if((nLookRadius > 2.0) && (nLookRadius < 40.0)) {
    lookRadius = nLookRadius;
  }
}

function resetCamera(event){
  cx = 2.0;
  cy = 2.0;
  cz = 6.5;
  elevation = 0.01;
  angle = 0.01;
  delta = 1.0;
  lookRadius = 5;
}

function updateLight(){
//to properly render new values when slider changes
  dirLightAlpha = -utils.degToRad(document.getElementById("dirAlpha").value);
  dirLightBeta  = -utils.degToRad(document.getElementById("dirBeta").value);
  ConeIn =  document.getElementById("ConeLightIn").value;
  ConeOut = document.getElementById("ConeLightOut").value;
  console.log(ConeIn);
  console.log(ConeOut);
  
  directionalLight = [-Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
        -Math.sin(dirLightAlpha),
        -Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
  ];
  lightPosition[0] = Rho*Math.sin(dirLightBeta)*Math.cos(dirLightAlpha);
  lightPosition[1] = Rho*Math.sin(dirLightBeta)*Math.sin(dirLightAlpha);
  lightPosition[2] = Rho*Math.cos(dirLightBeta);
}

var internalCam = false;

function drawScene() {

  updateLight(); //update directional light param value due to slider interaction
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  //UPDATE VIEW MATRIX AS USER MOVES CAMERA WITH MOUSE
  cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
  cx = lookRadius * Math.sin(utils.degToRad(angle)) * Math.cos(utils.degToRad(-elevation));
  cy = lookRadius * Math.sin(utils.degToRad(-elevation));
  viewMatrix = utils.MakeView(cx,cy,cz,elevation,-angle);

  //Light direction in camera space
  var lightDirMatrix = utils.invertMatrix(utils.transposeMatrix(viewMatrix)); //transformation matrix 
  var lightDirectionTransformed = utils.multiplyMatrix3Vector3(utils.sub3x3from4x4(lightDirMatrix), directionalLight); //transformed in camera space

  perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width/gl.canvas.height, 0.1, 100.0);

  // update the local matrices for each object
  updateLocalMatrices();

  // Update world matrices for each object
  cabinetNode.updateWorldMatrix();

  // Compute all the matrices for rendering
  objects.forEach(function(object) {

    gl.useProgram(program);
    gl.bindVertexArray(object.drawInfo.vao);
    bindingBuffers(object.drawInfo.vao, object.drawInfo.buffer);

    /*CAMERA SHADING SPACE: positions and normals must be transformed using both the View and 
      the World transforms. Lights (i.e. direction and position) must be transformed together 
      with objects and normals*/
    worldViewMatrix = utils.multiplyMatrices(viewMatrix, object.worldMatrix); 
    worldViewProjection = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix); 

    gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(worldViewProjection));
    gl.uniformMatrix4fv(worldViewMatrixLocation, gl.FALSE, utils.transposeMatrix(worldViewMatrix));
    gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(utils.invertMatrix(utils.transposeMatrix(worldViewMatrix))));

    gl.uniform3fv(dirLightColorHandle, dirLightColor);
    gl.uniform3fv(lightDirectionHandle,  lightDirectionTransformed);
    gl.uniform1f(specShineHandle, specShine);
    gl.uniform3fv(specColorHandle, specularColor);
    gl.uniform1f(ConeInHandle, ConeIn);
    gl.uniform1f(ConeOutHandle, ConeOut);
    gl.uniform3fv(LightPosHandle,lightPosition);
    //------------------------------------------------------------------

    if(object.drawInfo.buffer.texcoord != null){
      gl.uniform1i(hasTexture, 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(textLocation, texture);
    }else{
      gl.uniform1i(hasTexture, 0);
      gl.uniform3fv(materialDiffColorHandle, object.drawInfo.materialColor);
    }

    gl.drawElements(gl.TRIANGLES, object.drawInfo.buffer.indices.length, gl.UNSIGNED_SHORT, 0);

  });

  window.requestAnimationFrame(drawScene);
}

function main() {

  initializeVariables(); //initializes variables and handles to attribs and uniforms

  //events listeners
  canvas.addEventListener("mousedown", doMouseDown, false);
  canvas.addEventListener("mouseup", doMouseUp, false);
  canvas.addEventListener("mousemove", doMouseMove, false);
  canvas.addEventListener("mousewheel", doMouseWheel, false);
  canvas.addEventListener("dblclick", resetCamera);

  sceneGraph();

  drawScene(); //renders the object

}

async function init(){

var path = window.location.pathname;
var page = path.split("/").pop();
baseDir = window.location.href.replace(page, '');
shaderDir = baseDir+"shaders/";

canvas = document.getElementById("c");
gl = canvas.getContext("webgl2");
if (!gl) {
    document.write("GL context not opened");
    return;
}

await utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs.glsl'], function (shaderText) {
  var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
  var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
  program = utils.createProgram(gl, vertexShader, fragmentShader);

});
gl.useProgram(program);

//###################################################################################
//This loads the objs model in the Models variable
var cabinetObjStr = await utils.get_objstr(baseDir + cabinetStr);
cabinetModel = new OBJ.Mesh(cabinetObjStr);

var moleObjStr = await utils.get_objstr(baseDir + moleStr);
moleModel = new OBJ.Mesh(moleObjStr);

var hammerObjStr = await utils.get_objstr(baseDir + hammerStr);
hammerModel = new OBJ.Mesh(hammerObjStr);

var platformObjStr = await utils.get_objstr(baseDir + platformStr);
platformModel = new OBJ.Mesh(platformObjStr);
//###################################################################################

main();
}

window.onload = init;