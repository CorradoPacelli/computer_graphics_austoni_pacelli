// forse devo fare un vao per ogni mole
/* Set of location addresses for the models objs */
var cabinetStr = 'Assets/cabinet.obj';
var moleStr = 'Assets/mole.obj';
var hammerStr = 'Assets/hammer.obj';
var platformStr = 'Assets/platform.obj';
/* Set of location addresses for the objects' textures */
var objsTexture = 'Assets/Mole.png';


function sceneGraph(){

      cabinetNode = new Node();
      cabinetNode.localMatrix = utils.MakeTranslateMatrix(0.0,0.0,0.0);
      cabinetNode.drawInfo = {
        buffer: cabinetBuffer,
        vao: vao1,
      };

      hammerNode = new Node();
      hammerNode.localMatrix = utils.MakeTranslateMatrix(0.0,2.0,4.0);
      hammerNode.drawInfo = {
        buffer: hammerBuffer,
        vao: vao2,
      };

      platformNode = new Node();
      platformNode.localMatrix = utils.multiplyMatrices(utils.MakeScaleNuMatrix(10,0.5,10),utils.MakeTranslateMatrix(-2,-5.1,2));
      platformNode.drawInfo = {
        buffer: platformBuffer,
        vao: vao3,
        materialColor: platformColor,
      };
      //rispetto al cabint abbiamo -->
      //1 parametro : destra(+) e sinistra(-)
      //2 parametro : sopra(+) e sotto(-)
      //3 parametro : avanti(+) e indietro(-)

      //mole 1 in alto a sinistra
      moleNode1 = new Node();
      moleNode1.localMatrix = utils.MakeTranslateMatrix(-0.63,0.65,0.21);
      moleNode1.drawInfo = {
        buffer: moleBuffer,
        vao: vao4,
        moleStatus: "inactive",
        timeActivation: null,
        timeElapsed: null,
      };
      //status are ---> inactive, go up, pending, go down

      //mole 2 in alto al centro
      moleNode2 = new Node();
      moleNode2.localMatrix = utils.MakeTranslateMatrix(0.0,0.65,0.21);
      moleNode2.drawInfo = {
        buffer: moleBuffer,
        vao: vao4,
        moleStatus: "inactive",
        timeActivation: null,
        timeElapsed: null,
      };

      //mole 3 in alto a destra
      moleNode3 = new Node();
      moleNode3.localMatrix = utils.MakeTranslateMatrix(0.63,0.65,0.21);
      moleNode3.drawInfo = {
        buffer: moleBuffer,
        vao: vao4,
        moleStatus: "inactive",
        timeActivation: null,
        timeElapsed: null,
      };

      //mole 4 in basso a sinistra
      moleNode4 = new Node();
      moleNode4.localMatrix = utils.MakeTranslateMatrix(-0.31,0.6,0.65);
      moleNode4.drawInfo = {
        buffer: moleBuffer,
        vao: vao4,
        moleStatus: "inactive",
        timeActivation: null,
        timeElapsed: null,
      };

      //mole 5 in basso a destra
      moleNode5 = new Node();
      moleNode5.localMatrix = utils.MakeTranslateMatrix(0.31,0.6,0.65);
      moleNode5.drawInfo = {
        buffer: moleBuffer,
        vao: vao4,
        moleStatus: "inactive",
        timeActivation: null,
        timeElapsed: null,
      };

      hammerNode.setParent(cabinetNode);
      platformNode.setParent(cabinetNode);
      moleNode1.setParent(cabinetNode);
      moleNode2.setParent(cabinetNode);
      moleNode3.setParent(cabinetNode);
      moleNode4.setParent(cabinetNode);
      moleNode5.setParent(cabinetNode);

      objects = [
        cabinetNode,
        hammerNode,
        platformNode,
        moleNode1,
        moleNode2,
        moleNode3,
        moleNode4,
        moleNode5,
      ];

      moles = [
        moleNode1,
        moleNode2,
        moleNode3,
        moleNode4,
        moleNode5,
      ];

}

function updateLocalMatrices(){

  //add all the inactive mole to inactiveMole array
  

  if(animationON){
    animationON = false;

    moles.forEach(mole => {
      console.log(mole.drawInfo.moleStatus)
      if(mole.drawInfo.moleStatus == "inactive"){
        inactiveMole.push(mole)
      }
    })

    if(moles.length != 0){
      //fai l'estrazione della mole da alzare
      intero = Math.floor(Math.random()*inactiveMole.length)
      moleExtracted = inactiveMole[intero];
      console.log("Ho scelto la mole: " + intero)
      moleExtracted.drawInfo.moleStatus = "go up";
      moleExtracted.drawInfo.timeActivation = (new Date).getTime();
      console.log(animationON)
    }
    
  }

  
  moles.forEach(mole => {
    if(mole.drawInfo.moleStatus == "go up"){
      moleUp(mole);
    }else if(mole.drawInfo.moleStatus == "pending"){
      updatePending(mole);
    }else if(mole.drawInfo.moleStatus == "go down"){
      moleDown(mole);
    }
  })
  

  inactiveMole = []
}

function moleUp(moleNode){
  //[7] == y
  if(moleNode.localMatrix[7] <= 1.15){
    moleNode.localMatrix = utils.multiplyMatrices(utils.MakeTranslateMatrix(0,0.1,0), moleNode.localMatrix);
  }else{
    moleNode.drawInfo.moleStatus = "pending";
    console.log("Faccio pending")
  }
}

function updatePending(moleNode){
  //[7] == y
  moleNode.drawInfo.timeElapsed = (new Date).getTime();
  var timeDiff = moleNode.drawInfo.timeElapsed - moleNode.drawInfo.timeActivation; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds 
  if(timeDiff>1){
    moleNode.drawInfo.moleStatus = "go down";
    console.log("Faccio go down")
  }
}

function moleDown(moleNode){
  //[7] == y
  if(moleNode.localMatrix[7] >= 0.65){
    moleNode.localMatrix = utils.multiplyMatrices(utils.MakeTranslateMatrix(0,-0.1,0), moleNode.localMatrix);
  }else{
    moleNode.drawInfo.moleStatus = "inactive";
    console.log("Faccio inactive")
  }
}

