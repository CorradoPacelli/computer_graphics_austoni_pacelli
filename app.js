//VAR DEFINITION
var program0;
//var program1;
var gl;
var shaderDir;
var baseDir;
var lastUpdateTime;

//we have the models here
var cabinetModel;
var moleModel;
var hammerModel;
var lost = false; // This variable actually accounts what is the game status 

/* Here we setup the parameters for the cube which is basically the environment of the game */ 
var cubeMaterialColor = [0.0, 0.0, 1.0];
var cubeWorldMatrix = utils.MakeWorld(0.0, -0.15, 0.0, 90.0, 0.0, 0.0, 50.0);
var cubeNormalMatrix = utils.invertMatrix(utils.transposeMatrix(cubeWorldMatrix));

var object = []; // This array contains all the objects drawn in the scene, it will contain the moles, hammer and cabinet

//attributes and uniforms
var positionAttributeLocation = Array();
var uvAttributeLocation = Array();
var matrixLocation = Array();
var textLocation = Array();
var normalAttributeLocation = Array();
var normalMatrixPositionHandle = Array();
var worldMatrixLocation = Array();

var materialDiffColorHandle = Array();
var lightDirectionHandle = Array();
var lightColorHandle = Array();
var ambientLightcolorHandle = Array();
var specularColorHandle = Array();
var specShineHandle = Array();
var eyePositionHandle = Array();

var vaos = new Array();     // this is the array of vertex array object, each element refers to a specific object
var textures = new Array();
var modelStr = Array();     // this is the array containing the location address of the model.obj of the corresponding object
var modelTexture = Array(); // this one, instead, contains the location address of the texture associated to the object

//matrices
var viewMatrix;
var perspectiveMatrix;

//lights
//define directional light //TODO in camera space
var dirLightAlpha = -utils.degToRad(322);
var dirLightBeta = -utils.degToRad(91);
var directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
Math.sin(dirLightAlpha),
Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
];
var directionalLightColor = [1.0, 1.0, 1.0];

var ambientLight = [0.807843137254902, 0.792156862745098, 0.792156862745098]; // Ambient light color

var specularColor = [0.5, 0.5, 0.5]; // specular color for the Phong specular light
var specShine = 100; // this is the constant specular shine associated to the specular light

//camera
var cx;
var cy;
var cz;
var camAngle;
var camElev;

//variables for moving mole and hammer
//TODO


/* Set of location addresses for the models objs */
var cabinetStr = 'Assets/cabinet.obj';
var moleStr = 'Assets/mole.obj';
var hammerStr = 'Assets/hammer.obj';


/* Set of location addresses for the objects' textures */
var objsTexture = 'Assets/Mole.png';

var firstTimeMusic = true;
var nFrame = 0;
var pageReady = false; // This variable accounts for the page status 


/***********************************************************************************************/
/* We define a class 'Item' which has all the possible attributes referred to an object and some functions in order to 
  properly set them.                                                                                                  */
class Item {
  x; y; z;
  Rx; Ry; Rz;
  S;

  vertices;
  normals;
  indices;
  texCoords;

  worldMatrix;

  materialColor;

  modelStr;
  modelTexture;


  constructor(x, y, z, Rx, Ry, Rz, S, modelStr, modelTexture) {

    this.x = x;
    this.y = y;
    this.z = z;
    this.Rx = Rx;
    this.Ry = Ry;
    this.Rz = Rz;
    this.S = S;
    this.modelStr = modelStr;
    this.modelTexture = modelTexture;
    this.radius = 0.20;

    this.worldMatrix = utils.MakeWorld(this.x, this.y, this.z, this.Rx, this.Ry, this.Rz, this.S);
  }

  buildWorldMatrix() {
    return utils.MakeWorld(this.x, this.y, this.z, this.Rx, this.Ry, this.Rz, this.S);
  }


  setAttr(objectVertices, objectNormals, objectIndices, objectTexCoords) {
    this.vertices = objectVertices;
    this.normals = objectNormals;
    this.indices = objectIndices;
    this.texCoords = objectTexCoords;
  }

  setMaterialColor(materialColorArray) {
    this.materialColor = materialColorArray;
  }

}

// Creation of the item instances 
//
var cabinet = new Item(0.0, 3.0, 0.0, 0.0, 0.0, 0.0, 1.0, cabinetStr, objsTexture);

var moles = [];// we create an array of moles

// we have 5 equal moles
moles[0] = new Item(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, moleStr, objsTexture);
moles[1] = new Item(0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, moleStr, objsTexture);
moles[2] = new Item(0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 1.0, moleStr, objsTexture);
moles[3] = new Item(0.0, 0.0, 3.0, 0.0, 0.0, 0.0, 1.0, moleStr, objsTexture);
moles[4] = new Item(0.0, 0.0, 4.0, 0.0, 0.0, 0.0, 1.0, moleStr, objsTexture);

var hammer = new Item(0.0, 0.0, 6.0, 0.0, 0.0, 0.0, 1.0, hammerStr, objsTexture);

function main() {
  
  utils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.85, 0.85, 0.85, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  /* We set the attributes of the items by the elements loaded from their models.obj */
  cabinet.setAttr(cabinetModel.vertices, cabinetModel.vertexNormals, cabinetModel.indices, cabinetModel.textures);
  cabinet.setMaterialColor([1.0, 1.0, 1.0]);

  function setMoles(mole) {
    mole.setAttr(moleModel.vertices, moleModel.vertexNormals, moleModel.indices, moleModel.textures);
    mole.setMaterialColor([1.0, 1.0, 1.0]);
  }

  moles.forEach(setMoles);

  hammer.setAttr(hammerModel.vertices, hammerModel.vertexNormals, hammerModel.indices, hammerModel.textures);
  hammer.setMaterialColor([1.0, 1.0, 1.0]);

  /* Load corresponding information from the models */
  object[0] = cabinet;
  for(i=1;i<6;i++){
    object[i] = moles[i-1];
  }
  object[6] = hammer;

  // Retrieve the position of the attributes and uniforms from the shaders
  getShadersPos()

  // We set the perspective matrix and the view matrix
  perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);

  cx = 0.0;
  cy = 0.0;
  cz = 5.5;
  camElev = 15.0;
  camAngle = 0.0;

  viewMatrix = utils.MakeView(cx, cy, cz, camElev, camAngle);
  // Here we prepare the buffers, set them, enable them
  setBuffers();
  // We are ready to draw the scene
  drawScene();

}

async function init() {

  var path = window.location.pathname;
  var page = path.split("/").pop();
  baseDir = window.location.href.replace(page, '');
  shaderDir = baseDir + "shaders/";

  var canvas = document.getElementById("c");

  lastUpdateTime = (new Date).getTime();

  gl = canvas.getContext("webgl2");
  if (!gl) {
    document.write("GL context not opened");
    return;
  }

  await utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs.glsl'], function (shaderText) {
    var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
    var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
    // This is the program used for all the objects in the scene except the "environment" cube
    program0 = utils.createProgram(gl, vertexShader, fragmentShader);

  });

  /*
  await utils.loadFiles([shaderDir + 'vs_cube.glsl', shaderDir + 'fs_cube.glsl'], function (shaderText) {
    var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
    var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
    // The program used for drawing the "environment" cube
    program1 = utils.createProgram(gl, vertexShader, fragmentShader);
  });
  */



  //###################################################################################
  //This loads the obj model in the cabinetModel variable
  var cabinetObjStr = await utils.get_objstr(baseDir + cabinetStr);
  cabinetModel = new OBJ.Mesh(cabinetObjStr);
  //###################################################################################

  //###################################################################################
  //This loads the obj model in the moleModel variable
  var moleObjStr = await utils.get_objstr(baseDir + moleStr);
  moleModel = new OBJ.Mesh(moleObjStr);
  //###################################################################################

  //###################################################################################
  //This loads the obj model in the hammerModel variable
  var hammerObjStr = await utils.get_objstr(baseDir + hammerStr);
  hammerModel = new OBJ.Mesh(hammerObjStr);
  //###################################################################################

  //TODO CANCELLA QUESTA FUNZIONE QUANDO INTRODUCI I COMANDI
  initControls();

  main();
}

/* With this function we retrieve the attributes and uniforms from the shaders in order to se them */

function getShadersPos() {
  // the one with the element number array 0 referring to the program0 that's used for almost all the elements
  positionAttributeLocation[0] = gl.getAttribLocation(program0, "a_position");
  uvAttributeLocation[0] = gl.getAttribLocation(program0, "a_uv");
  matrixLocation[0] = gl.getUniformLocation(program0, "matrix");
  worldMatrixLocation[0] = gl.getUniformLocation(program0, "worldmatrix");

  textLocation[0] = gl.getUniformLocation(program0, "u_texture");

  normalAttributeLocation[0] = gl.getAttribLocation(program0, "inNormal");
  normalMatrixPositionHandle[0] = gl.getUniformLocation(program0, 'nMatrix');

  eyePositionHandle[0] = gl.getUniformLocation(program0, "eyePos");

  materialDiffColorHandle[0] = gl.getUniformLocation(program0, 'mDiffColor');
  lightDirectionHandle[0] = gl.getUniformLocation(program0, 'lightDirection');
  lightColorHandle[0] = gl.getUniformLocation(program0, 'lightColor');
  ambientLightcolorHandle[0] = gl.getUniformLocation(program0, 'ambientLightcolor');
  specularColorHandle[0] = gl.getUniformLocation(program0, 'specularColor');
  specShineHandle[0] = gl.getUniformLocation(program0, 'SpecShine');

  /*
  // Here instead, we get attribute and uniform needed for the environmental cube in which we use program1
  positionAttributeLocation[1] = gl.getAttribLocation(program1, "a_position");
  matrixLocation[1] = gl.getUniformLocation(program1, "matrix");
  */

}

/* In this function we create the buffers, bind them, and enable them */
function setBuffers() {
  //These are the buffers for the "environmental" cube (Note that we use here program1)
  /*
  gl.useProgram(program1);
  vaos[7] = gl.createVertexArray();   
  gl.bindVertexArray(vaos[7]);
  */
  /*
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation[1]);
  gl.vertexAttribPointer(positionAttributeLocation[1], 3, gl.FLOAT, false, 0, 0);

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  */

  // Here we do the same but for the other elements in the scene, we can loop over since they use the same program (program0)
  for (let i = 0; i < object.length; i++) {
    gl.useProgram(program0);
    vaos[i] = gl.createVertexArray();
    gl.bindVertexArray(vaos[i])

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object[i].vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation[0]);
    gl.vertexAttribPointer(positionAttributeLocation[0], 3, gl.FLOAT, false, 0, 0);

    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object[i].texCoords), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(uvAttributeLocation[0]);
    gl.vertexAttribPointer(uvAttributeLocation[0], 2, gl.FLOAT, false, 0, 0);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object[i].indices), gl.STATIC_DRAW);

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object[i].normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalAttributeLocation[0]);
    gl.vertexAttribPointer(normalAttributeLocation[0], 3, gl.FLOAT, false, 0, 0);

    // here we set the texture for the model
    textures[i] = gl.createTexture();

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[i]);

    image = new Image();
    image.src = baseDir + object[i].modelTexture;

    image.onload = function (texture, image) {
      return function () {
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);

      };
    }(textures[i], image);

  }

}


function drawObjects() {

  gl.clearColor(0.85, 0.85, 0.85, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  /*
  //draw the cube environment by passing the uniform
  gl.useProgram(program1);

  var viewWorldCubeMatrix = utils.multiplyMatrices(viewMatrix, cubeWorldMatrix);
  var projectionCubeMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldCubeMatrix);
  gl.uniformMatrix4fv(matrixLocation[1], gl.FALSE, utils.transposeMatrix(projectionCubeMatrix));

  gl.bindVertexArray(vaos[7]);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  */


  // we draw the objects by passing the uniforms to shaders

  for (let i = 0; i < object.length; ++i) {
    console.log(object[i].modelStr)
    gl.useProgram(program0);
    var worldViewMatrix = utils.multiplyMatrices(viewMatrix, object[i].worldMatrix);
    var worldViewProjection = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix);
    gl.uniformMatrix4fv(matrixLocation[0], gl.FALSE, utils.transposeMatrix(worldViewProjection));
    gl.uniformMatrix4fv(worldMatrixLocation[0], gl.FALSE, utils.transposeMatrix(object[i].worldMatrix));

    var objNormalMatrix = utils.invertMatrix(utils.transposeMatrix(object[i].worldMatrix));
    gl.uniformMatrix4fv(normalMatrixPositionHandle[0], gl.FALSE, utils.transposeMatrix(objNormalMatrix));

    gl.uniform3fv(materialDiffColorHandle[0], object[i].materialColor);
    gl.uniform3fv(lightColorHandle[0], directionalLightColor);
    gl.uniform3fv(lightDirectionHandle[0], directionalLight);
    gl.uniform3fv(ambientLightcolorHandle[0], ambientLight);
    gl.uniform3fv(specularColorHandle[0], specularColor);
    gl.uniform1f(specShineHandle[0], specShine);
    gl.uniform3f(eyePositionHandle[0], cx, cy, cz);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[i]);
    gl.uniform1i(textLocation[0], textures[i]);

    gl.bindVertexArray(vaos[i]);
    gl.drawElements(gl.TRIANGLES, object[i].indices.length, gl.UNSIGNED_SHORT, 0);

  }

  // After all the objects are drawn, we can show the scene!
  pageReady = true;
  // This function simply set the visibility stile attribute of the index elements to visible
  pageLoader();

}



/* This function animates the scene */

function animate(item) {

  nFrame++;
  var currentTime = (new Date).getTime();
  if (lastUpdateTime != null) {
    /*
    // First of all we check for the collision between the boat and any of the rocks in the scene
    rocks.forEach(rock => circleCollision(boat, rock));
    // This function is in charge to place the rock in the scene
    rockPlacement();
    // In the same way, this function draw the 'ocean' object where the boat is supposed to move
    oceanPlacement();
    // The following function implements the boat dynamic
    boatDynamic(currentTime);
    */
  }
  
  // By changing the viewMatrix we are moving the camera along with the boat translation
  viewMatrix = utils.MakeView(cx , cy , cz, camElev, camAngle);


  // We update the worldMatrix of objects since some parameter has changed
  for (let i = 0; i < object.length; i++) {
    object[i].worldMatrix = object[i].buildWorldMatrix();
  }


  lastUpdateTime = currentTime;
  
}

/* This is the function in charge of drawing the scene */
function drawScene() {

  // We check that actually the player has not lost the game
  if (!lost) {
    // We draw the objects
    drawObjects();
    // Since we are playing we need to animate the scene
    //animate(cabine); //for now animation are disabled
    viewMatrix = utils.MakeView(cx , cy , cz, camElev, camAngle);

    window.requestAnimationFrame(drawScene); // we perform a callback 
  }

}



/* This is a simple function for detecting collision. The objects are approximated as circles */
function circleCollision(obj1, obj2) {
  /*
  let dx = obj1.x - obj2.x;
  let dz = obj1.z - obj2.z;

  let distance = Math.sqrt(dx * dx + dz * dz);
  //collision happened
  if (distance < obj1.radius + obj2.radius || Math.abs(boat.x) > 4.95) {
    lost = true;  // the game is lost!
    window.removeEventListener("keyup", keyFunctionUp, false);
    window.removeEventListener("keydown", keyFunctionDown, false);
    document.getElementById("Lost").style.visibility = "visible";
    //disabling music
    const element = document.getElementById("chbx");
    if (element.checked) {
      element.checked = false;
      const e = new Event("change");
      element.dispatchEvent(e);
    }
    
  }
  */
}
//Start region:
//TMP FUNCTIONS FOR MOVING CAMERA

function keyFunction(e){
  // q e e ti fanno girare la telecamera a destra e a sinistra
  // a e d ti fanno spostare a destra e a sinistra
  // w e s ti fanno spostare avanti e distro
  // p e l ti fanno spostare l'elevazione della telecamera
  if (e.keyCode == 81) { //q
    camAngle-=5.0;
    console.log("cx: "+cx)
  }
  if (e.keyCode == 69) { //e
    camAngle+=5.0;
    console.log("cx: "+cx)
  } 
  if(e.keyCode == 65) { //a
    cx-=1.0;
    console.log("cy: "+cy)
  }
  if (e.keyCode == 68) { //d
    cx+=1.0;
    console.log("cy: "+cy)
  } 
  if (e.keyCode == 87) { //w
    cz-=1.0;
    console.log("cz: "+cz)
  } 
  if(e.keyCode == 83) { //s
    cz+=1.0;
    console.log("cz: "+cz)
  }
  if (e.keyCode == 80) { //p
    camElev+=5.0;
    console.log("camElev: "+camElev)
  } 
  if(e.keyCode == 76) { //l
    camElev-=5.0;
    console.log("camElev: "+camElev)
  }
  if (e.keyCode == 79) { //o
    cy+=1.0;
    console.log("camAngle: "+camAngle)
  } 
  if(e.keyCode == 75) { //k
    cy-=1.0;
    console.log("camAngle: "+camAngle)
  }
    
  window.requestAnimationFrame(drawScene);
}
/* Adding some event listeners for the page */
function initControls() {
  window.addEventListener("keyup", keyFunction, false);
}
//End region
window.onload = init;


