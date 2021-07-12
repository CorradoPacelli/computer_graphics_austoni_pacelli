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
      };

      //mole 2 in alto al centro
      moleNode2 = new Node();
      moleNode2 = Object.assign(moleNode2, moleNode1);
      moleNode2.localMatrix = utils.MakeTranslateMatrix(0.0,0.65,0.21);

      //mole 3 in alto a destra
      moleNode3 = new Node();
      moleNode3 = Object.assign(moleNode3, moleNode1);
      moleNode3.localMatrix = utils.MakeTranslateMatrix(0.63,0.65,0.21);

      //mole 4 in basso a sinistra
      moleNode4 = new Node();
      moleNode4 = Object.assign(moleNode4, moleNode1);
      moleNode4.localMatrix = utils.MakeTranslateMatrix(-0.31,0.6,0.65);

      //mole 5 in basso a destra
      moleNode5 = new Node();
      moleNode5 = Object.assign(moleNode5, moleNode1);
      moleNode5.localMatrix = utils.MakeTranslateMatrix(0.31,0.6,0.65);

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
}

function updateLocalMatrices(){
      //[7] == y
      /*
      var change = 0.1
      if(moleNode1.localMatrix[7] > 1.65 || moleNode1.localMatrix[7] < 0.65){
        change = -1*change
        moleNode1.localMatrix = utils.multiplyMatrices(utils.MakeTranslateMatrix(0,change,0), moleNode1.localMatrix);
      }
      moleNode1.localMatrix = utils.multiplyMatrices(utils.MakeTranslateMatrix(0,change,0), moleNode1.localMatrix);
      console.log(moleNode1.localMatrix[7])
      */
      /*
      moleNode1.localMatrix = utils.multiplyMatrices(utils.MakeRotateZMatrix(2), electronNode.localMatrix);
      moleNode2.localMatrix = utils.MakeTranslateMatrix((4) + 18*Math.sin((i/(4))*10.0/180.0*Math.PI), 0,  12*Math.cos((i/(4))*10.0/180.0*Math.PI));
      moleNode3.localMatrix = utils.multiplyMatrices(utils.MakeRotateZMatrix(2), utils.multiplyMatrices(utils.MakeRotateYMatrix(2), electronNode3.localMatrix));
      moleNode4.localMatrix = utils.multiplyMatrices(utils.MakeRotateZMatrix(-2), utils.multiplyMatrices(utils.MakeRotateYMatrix(2), electronNode4.localMatrix));
      moleNode5.localMatrix = utils.MakeTranslateMatrix((-4) + 18*Math.cos((i/4)*10.0/180.0*Math.PI), 12*Math.sin((i/4)*10.0/180.0*Math.PI),0);
      moleNode6.localMatrix = utils.MakeTranslateMatrix((-4) - 18*Math.cos((i/4)*10.0/180.0*Math.PI), 12*Math.sin(-(i/4)*10.0/180.0*Math.PI),0);
      */
}