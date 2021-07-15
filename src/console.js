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
      hstep1= utils.multiplyMatrices(utils.MakeTranslateMatrix(0.0,1.5,3.0),utils.MakeScaleMatrix(0.6));
      hammerNode.localMatrix = utils.multiplyMatrices(hstep1,utils.MakeRotateXMatrix(10));
      hammerNode.drawInfo = {
        buffer: hammerBuffer,
        vao: vao2,
        initialPos: [0.0,3.0,3.0],
        curPos: [0.0,3.0,3.0],
        hammerDir: [0,0,-1],
        moleHitted: null,
        status: "inactive",
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
        initialPos: [-0.63,0.65,0.21],
        moleStatus: "inactive",
        timeActivation: null,
        timeElapsed: null,
        inc: -0.003,
      };
      //status is ---> inactive, go up, pending, go down

      //mole 2 in alto al centro
      moleNode2 = new Node();
      moleNode2.localMatrix = utils.MakeTranslateMatrix(0.0,0.65,0.21);
      moleNode2.drawInfo = {
        buffer: moleBuffer,
        vao: vao5,
        initialPos: [0.0,0.65,0.21],
        moleStatus: "inactive",
        timeActivation: null,
        timeElapsed: null,
        inc: 0,
      };

      //mole 3 in alto a destra
      moleNode3 = new Node();
      moleNode3.localMatrix = utils.MakeTranslateMatrix(0.63,0.65,0.21);
      moleNode3.drawInfo = {
        buffer: moleBuffer,
        vao: vao6,
        initialPos: [0.63,0.65,0.21],
        moleStatus: "inactive",
        timeActivation: null,
        timeElapsed: null,
        inc: 0.003,
      };

      //mole 4 in basso a sinistra
      moleNode4 = new Node();
      moleNode4.localMatrix = utils.MakeTranslateMatrix(-0.31,0.6,0.65);
      moleNode4.drawInfo = {
        buffer: moleBuffer,
        vao: vao7,
        initialPos: [-0.31,0.6,0.65],
        moleStatus: "inactive",
        timeActivation: null,
        timeElapsed: null,
        inc: -0.003,
      };

      //mole 5 in basso a destra
      moleNode5 = new Node();
      moleNode5.localMatrix = utils.MakeTranslateMatrix(0.31,0.6,0.65);
      moleNode5.drawInfo = {
        buffer: moleBuffer,
        vao: vao8,
        initialPos: [0.31,0.6,0.65],
        moleStatus: "inactive",
        timeActivation: null,
        timeElapsed: null,
        inc: 0.003,
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

function updateLocalMatricesMole(){
  if(Math.floor(Math.random() * 1000) < 20){
    // una volta che sono entrato la razio è questa:
    // mi faccio una lista di mole inattive e tra le mole inattive ne scelgo una causale
    // per farla alzare, 
    // ho pensato di fare così perchè in questo modo non rischiamo di estrarre una talpa che è già su
    // 
    moles.forEach(mole => {
      //console.log(mole.drawInfo.moleStatus)
      if(mole.drawInfo.moleStatus == "inactive"){
        inactiveMole.push(mole)
      }
    })
    //questo è un foreach, il foreach in javascript funziona così
    // è una funzione delle strutture dati quindi lo chiami su una struttura dati che in questo
    //caso è moles, che ha tutti i 5 nodi delle mole
    if(inactiveMole.length > 0){
      //fai l'estrazione della mole da alzare
      intero = Math.floor(Math.random()*inactiveMole.length)
      moleExtracted = inactiveMole[intero];
      //console.log("Ho scelto la mole: " + intero)
      moleExtracted.drawInfo.moleStatus = "go up";
      moleExtracted.drawInfo.timeActivation = (new Date).getTime();
    }
  }
  // tranquillissimo, leggi questo commento qui
  //la cosa veramente importante è questo forEach qui,
  //questo foreach va a modificare la posizione delle mole a seconda del loro stato
  // infatti si chiede per ogni mole qual è lo stato e quindi quale funzione chiamare 
  // bada bene che questa lista è moles e non inactive moles, quindi ogni mole verrà modificata
  // ovviamente se la mole è inattiva non farà nulla perchè non devo modificarla
  moles.forEach(mole => {
    if(mole.drawInfo.moleStatus == "go up"){
      moleUp(mole);
    }else if(mole.drawInfo.moleStatus == "pending"){
      updatePending(mole);
    }else if(mole.drawInfo.moleStatus == "go down"){
      moleDown(mole);
    }
  })
  // si, allora questo foreach qui lo fa sempre ad ogni frame non importa cosa
  // il codice che c'è immediatamente sopra viene fatto solo quando estraggo la mole
  inactiveMole = []
  // alla fine inactiveMole viene svuotato
}

function updateLocalMatricesHammer(){
  if(hammerNode.drawInfo.status=="active"){
    hammerNode.localMatrix=utils.multiplyMatrices(utils.MakeTranslateMatrix(increment[0],0,increment[2]),hammerNode.localMatrix);
    
    deltaQ = Quaternion.fromEuler(0,rot*rad,0,order = "ZXY")
    q = deltaQ.mul(q)

    hammerNode.localMatrix=utils.multiplyMatrices(hammerNode.localMatrix,q.toMatrix4());

    if(hammerNode.localMatrix[11] <= hammerNode.drawInfo.moleHitted.drawInfo.initialPos[2]){
      hstep1= utils.multiplyMatrices(utils.MakeTranslateMatrix(0.0,1.5,3.0),utils.MakeScaleMatrix(0.6));
      hammerNode.localMatrix = utils.multiplyMatrices(hstep1,utils.MakeRotateXMatrix(10));
      hammerNode.drawInfo.status="inactive";
    }
  }
}



function moleUp(moleNode){
  //[7] == y
  if(moleNode.localMatrix[7] <= moleNode.drawInfo.initialPos[1] + 0.49){
    moleNode.localMatrix = utils.multiplyMatrices(utils.MakeTranslateMatrix(0,0.1,0), moleNode.localMatrix);
  }else{
    moleNode.drawInfo.moleStatus = "pending";
    //console.log("Faccio pending")
  }
}

function updatePending(moleNode){
  //[7] == y
  moleNode.drawInfo.timeElapsed = (new Date).getTime();
  var timeDiff = moleNode.drawInfo.timeElapsed - moleNode.drawInfo.timeActivation; //in ms
  // strip the ms
  timeDiff /= 1000;

  if(timeDiff>2){
    moleNode.drawInfo.moleStatus = "go down";
    //console.log("Faccio go down")
  }
}

function moleDown(moleNode){
  //[7] == y
  if(moleNode.localMatrix[7] >= moleNode.drawInfo.initialPos[1] + 0.1){
    moleNode.localMatrix = utils.multiplyMatrices(utils.MakeTranslateMatrix(0,-0.1,0), moleNode.localMatrix);
  }else{
    moleNode.drawInfo.moleStatus = "inactive";
    //console.log("Faccio inactive")
  }
}

function checkForMole(moleSelected){
  hammerNode.drawInfo.status = "active";
  hammerNode.drawInfo.moleHitted = moleSelected;

  MHvec= utils.minus(hammerNode.drawInfo.moleHitted.drawInfo.initialPos,hammerNode.drawInfo.initialPos);
  increment= utils.division(MHvec,10.0); 
  q = new Quaternion(1,0,0);

  if(moleSelected.drawInfo.moleStatus != "inactive"){
    console.log("oh hai fatto punto!")
    moleSelected.drawInfo.moleStatus = "go down"
  }else{
    console.log("no, hai toppato!")
  }
}