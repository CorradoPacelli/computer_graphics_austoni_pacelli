//structural variables
var canvas;
var program;
var gl;
var shaderDir;
var baseDir;

//Shared variables between functions--------------------------------------------

//variables for camera & UI interaction
var lastUpdateTime;
var Rx;
var Ry;
var Rz;
var S;
var cx;
var cy;
var cz;
var elevation;
var angle;
var delta;
var lookRadius;
var specShine;
var RotX;
var RotY;
var game_mode=1;

//variables to extract obj model properties
var objects = []; //scene graph objects array
var cabinetNode;
var hammerNode;
var platfromNode;
//5 moles
var moleNode1;
var moleNode2;
var moleNode3;
var moleNode4;
var moleNode5;

//animation
var now;
var lastMoleTime;
var difficultInSeconds;
var intero;
var moles = [];
var inactiveMole = [];
var moleExtracted;
var keys = [];
var mole;
var count=0;
var q;
var MHvec;
var increment;
var rot = -0.4;
var rad = Math.PI / 180;
var hit = 0;
var miss = 0;
var timePending = 3;
var points=0;

//game status
var startGame;
var timeStartedGame;
var timeElapsedGame;

//buffer for each object, which contains position, indices, texture etc.
var cabinetBuffer;
var hammerBuffer;
var moleBuffer;

//light variables
var dirLightAlpha;
var dirLightBeta;
var directionalLight;
var dirLightColor;
var specularColor;
var ConeIn;
var ConeOut;					//outer cone
var lightPosition = [];       //position of the spot light
var Rho;							//distance from light to point (object)
var LPosx;
var LPosy;
var LPosz;
var LDirTheta;
var LDirPhi;
var spotDir=[];
var ambientL=[1, 1, 1];
var ambient = 0.05;

//object colors
var cabinetColor;
var hammerColor;
var moleColor;

// attributes and uniforms handles
var hasTexture; // wheter to apply texture to an object
var positionAttributeLocation;
var uvAttributeLocation;
var matrixLocation;
var textLocation;
var materialDiffColorHandle;
var lightDirectionHandle;
var normalMatrixPositionHandle;
var dirLightColorHandle;
var specColorHandle;
var worldViewMatrixLocation;
var specShineHandle;

//transformation matrices
var perspectiveMatrix;
var viewMatrix;
var worldMatrix;
var worldViewMatrix;
var worldViewProjection;
var normalMatrix;
//var lightDirMatrix
//var lightDirectionTransformed

//buffers
var vao1;
var vao2;
var vao3;
var vao4;
var vao5;
var vao6;
var vao7;
var vao8;
var positionBuffer;
var normalBuffer;
var uvBuffer;
var indexBuffer;
var texture;
var image;
// -----------------------------------------------------------------------------



//scene graphs variables----------------------------------
var Node = function() {
    this.children = [];
    this.localMatrix = utils.identityMatrix();
    this.worldMatrix = utils.identityMatrix();
};

Node.prototype.setParent = function(parent) {
    // remove us from our parent
    if (this.parent) {
        var ndx = this.parent.children.indexOf(this);
        if (ndx >= 0) {
        this.parent.children.splice(ndx, 1);
        }
    }

    // Add us to our new parent
    if (parent) {
        parent.children.push(this);
    }
    this.parent = parent;
};

Node.prototype.updateWorldMatrix = function(matrix) {
    if (matrix) {
        // a matrix was passed in so do the math
        this.worldMatrix = utils.multiplyMatrices(matrix, this.localMatrix);
    } else {
        // no matrix was passed in so just copy.
        utils.copy(this.localMatrix, this.worldMatrix);
    }

    // now process all the children
    var worldMatrix = this.worldMatrix;
    this.children.forEach(function(child) {
        child.updateWorldMatrix(worldMatrix);
    });
};
