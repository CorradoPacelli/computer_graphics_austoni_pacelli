/* Set of location addresses for the models objs */
var cabinetStr = 'Assets/cabinet.obj';
var moleStr = 'Assets/mole.obj';
var hammerStr = 'Assets/hammer.obj';
/* Set of location addresses for the objects' textures */
var objsTexture = 'Assets/Mole.png';


function sceneGraph(){

      cabinetNode = new Node();
      cabinetNode.localMatrix = utils.multiplyMatrices(utils.identityMatrix(), utils.MakeTranslateMatrix(0.5,-0.5,0.0));
      cabinetNode.drawInfo = {
        buffer: cabinetBuffer,
        vao: vao1,
      };

      hammerNode = new Node();
      hammerNode.localMatrix = utils.MakeTranslateMatrix(2.0,0.0,0.0);
      hammerNode.drawInfo = {
        buffer: hammerBuffer,
        vao: vao2,
      };

      moleNode1 = new Node();
      moleNode1.localMatrix = utils.MakeTranslateMatrix(2,1,0);
      moleNode1.drawInfo = {
        buffer: moleBuffer,
        vao: vao3,
      };

      moleNode2 = new Node();
      moleNode2 = Object.assign(moleNode2, moleNode1);
      moleNode2.localMatrix = utils.MakeTranslateMatrix(2,2,0);

      moleNode3 = new Node();
      moleNode3 = Object.assign(moleNode3, moleNode1);
      moleNode3.localMatrix = utils.MakeTranslateMatrix(2,3,0);

      moleNode4 = new Node();
      moleNode4 = Object.assign(moleNode4, moleNode1);
      moleNode4.localMatrix = utils.MakeTranslateMatrix(3,1,0);

      moleNode5 = new Node();
      moleNode5 = Object.assign(moleNode5, moleNode1);
      moleNode5.localMatrix = utils.MakeTranslateMatrix(3,2,0);

      moleNode6 = new Node();
      moleNode6 = Object.assign(moleNode6, moleNode1);
      moleNode6.localMatrix = utils.MakeTranslateMatrix(3,3,0);

      hammerNode.setParent(cabinetNode);
      moleNode1.setParent(cabinetNode);
      moleNode2.setParent(cabinetNode);
      moleNode3.setParent(cabinetNode);
      moleNode4.setParent(cabinetNode);
      moleNode5.setParent(cabinetNode);
      moleNode6.setParent(cabinetNode);

      objects = [
        cabinetNode,
        hammerNode,
        moleNode1,
        moleNode2,
        moleNode3,
        moleNode4,
        moleNode5,
        moleNode6,
      ];
}

function updateLocalMatrices(){
      /*
      moleNode1.localMatrix = utils.multiplyMatrices(utils.MakeRotateZMatrix(2), electronNode.localMatrix);
      moleNode2.localMatrix = utils.MakeTranslateMatrix((4) + 18*Math.sin((i/(4))*10.0/180.0*Math.PI), 0,  12*Math.cos((i/(4))*10.0/180.0*Math.PI));
      moleNode3.localMatrix = utils.multiplyMatrices(utils.MakeRotateZMatrix(2), utils.multiplyMatrices(utils.MakeRotateYMatrix(2), electronNode3.localMatrix));
      moleNode4.localMatrix = utils.multiplyMatrices(utils.MakeRotateZMatrix(-2), utils.multiplyMatrices(utils.MakeRotateYMatrix(2), electronNode4.localMatrix));
      moleNode5.localMatrix = utils.MakeTranslateMatrix((-4) + 18*Math.cos((i/4)*10.0/180.0*Math.PI), 12*Math.sin((i/4)*10.0/180.0*Math.PI),0);
      moleNode6.localMatrix = utils.MakeTranslateMatrix((-4) - 18*Math.cos((i/4)*10.0/180.0*Math.PI), 12*Math.sin(-(i/4)*10.0/180.0*Math.PI),0);
      */
}