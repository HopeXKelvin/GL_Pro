// 全局变量
var scene,camera,drumObj,renderer;
var geometry, material,mesh,leftStickMesh,rightStickMesh,raycaster,mouse,isMove,drum,cylinder,drum_group,leapController;
var drumAudioList = ["static/assets/audio/drum_01.mp3"];
// window.controls = new THREE.TrackballControls(camera);

var INTERSECTED;

var KEYCODE = {
  up_arrow : 38,
  down_arrow : 40,
  left_arrow : 37,
  right_arrow : 39
};

// 存放每一个单独的鼓的部分的颜色信息
var DRUM_MTL_COLOR = {
};

// 生成音频dom元素
var audioDomList = (function(){
  var domList = [];
  for(var i=0;i<drumAudioList.length;i++){
    var audioDom = document.createElement("audio");
    audioDom.src = drumAudioList[i];
    domList.push(audioDom);
  }
  return domList;
})();

// (window.controller = new Leap.Controller)
//     .use('transform', {
//       position: new THREE.Vector3(1, 0, 0)
//     })
//     .use('handHold',{})
//     .use('screenPosition')
//     .use('handEntry',{})
//     .use('riggedHand', {
//       parent : scene,
//       renderFn : function(){
//         // renderer.render(scene,camera);
//         // return controls.update();
//       },
//       materialOptions : {
//         wireframe: getParam('wireframe'),
//         color : new THREE.Color(0xff0000)
//       },
//       offset : new THREE.Vector3(0,0,0),
//       scale : 0.2,
//       boneLabels: function(boneMesh, leapHand) {
//         return boneMesh.name
//       }
//   }).connect();

// 应该是一个工具函数
function getParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

function init(){
  // 场景
  scene = new THREE.Scene();
  // 相机
  camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,10000);
  camera.position.z = 1000;
  camera.position.set(0,500,1500);
  camera.lookAt(new THREE.Vector3(0,0,0));
  // 物体
  geometry = new THREE.BoxGeometry(200,200,200);
  material = new THREE.MeshBasicMaterial({color:0xfad123,wireframe:false});
  mesh = new THREE.Mesh(geometry,material);// mesh = geometry + material;
  mesh.position.x = 1000;
  mesh.position.y = 0;
  mesh.position.z = 0;
  mesh.scale.x = 2;
  mesh.scale.y = 2;
  mesh.scale.z = 2;
  mesh.name = "cube";
  // scene.add(mesh);
  // stick
  var stickRadius = 10;
  var geometry = new THREE.CylinderGeometry(stickRadius,stickRadius,200,20);
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  var rgeometry = new THREE.CylinderGeometry(stickRadius,stickRadius,200,20);
  var rmaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
  leftStickMesh = new THREE.Mesh(geometry,material);
  rightStickMesh = new THREE.Mesh(rgeometry,rmaterial);
  leftStickMesh.name = "stick";
  scene.add(leftStickMesh);
  scene.add(rightStickMesh);

  // 加入场景
  var regionR = 700;
  var cylinderGeo = new THREE.CylinderGeometry(regionR,regionR,5,1024);
  var material = new THREE.MeshNormalMaterial();
  cylinder = new THREE.Mesh(cylinderGeo,material);
  // cylinder.scale.x = 100;
  // cylinder.scale.y = 100;
  // cylinder.scale.z = 100;
  cylinder.position.set(0,0,0);
  // scene.add(cylinder);

  // 加入group
  drum_group = new THREE.Group();
  drum_group.add(cylinder);

  var light = new THREE.DirectionalLight(0xffffff,1);
	light.position.set(1,1,1).normalize();
	scene.add(light);

  renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setClearColor(0xaaaaaa,0.5);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  mouse.x = -1;
  mouse.y = -1;

  document.getElementById("WebGL-output").appendChild(renderer.domElement);

  /*************************************************************************/
  var onProgress = function(xhr) {
      if (xhr.lengthComputable) {
          var percentComplete = xhr.loaded / xhr.total * 100;
          console.log(Math.round(percentComplete, 2) + '% downloaded');
      }
  };
  var onError = function(xhr) {};
  //THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('static/assets/models/');
  mtlLoader.load('drum_save_1.mtl', function(materials) {
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('static/assets/models/');
      objLoader.load('drum_save_1.obj', function(object){
          // while(object.children[0] != null){
          // 	group.add(object.children[0]);
          // }
          // mesh = group;
          drum = object;
          drum.name = "drum";
          // drum.children[0].geometry.center()
          drum.scale.x = 150;
          drum.scale.y = 150;
          drum.scale.z = 150;
          // drum.rotation.y =2.3;
          // position.x = 1000;
          // drum.position.x = 0;
          // drum.position.y = 0;
          // drum.position.z = 0;

          // drum.rotation.y = -10;
          // drum.rotation.x = 0.6;
          // 设置原始的素有mesh的颜色值
          for(var i=0;i<drum.children.length;i++){
            // 设置
            drum.children[i].material.color.set(0xAAAAAA);
          }
          drum_group.add(drum);
          scene.add(drum_group);
          animate();
          // scene.add(drum);
          window.scene = scene;
          window.camera = camera;
          window.drum = drum;

          var box = new THREE.Mesh(
            new THREE.BoxGeometry(60,60,30), // mm
            new THREE.MeshPhongMaterial({color: 0xffff00})
          );

          box.castShadow = true;
          box.receiveShadow = true;

          var collider = new THREE.Mesh(new THREE.PlaneGeometry(59,59));
          collider.position.set(0, 140, 0);

          collider.add(box);
          // scene.add(collider);

          leapController = Leap.loop()
            .use('proximity')
            .use('handHold')
            .use('transform',{
              position : new THREE.Vector3(0,15,0),
              scale : getParam('scale')
            })
            .use('handEntry')
            .use('screenPosition')
            .use('riggedHand', {
              parent : scene,
              renderer : renderer,
              camera : camera,
              renderFn : function(){
                renderer.render(scene,camera);
                // return leapController.update();
              }
            }).on('frame',function(frame){
              var hands = frame.hands;
              if(hands != null && hands.length > 0){
                for(var i=0;i<hands.length;i++){
                  console.log(hands[i]);
                  var type = hands[i].type;
                  var posArr = hands[i].palmPosition;
                  var vec3 = new THREE.Vector3(posArr[0],posArr[1],posArr[2]);
                  // vec3.unproject(camera);
                  var grabStrength = hands[i].grabStrength;
                  console.log(hands[i].grabStrength);
                  if(grabStrength >= 0.95){
                    console.log(type);
                    if(type == "left"){
                      leftStickMesh.position.copy(vec3);
                      leftStickMesh.rotation.x = -Math.PI/3;
                      console.log(hands[i].palmVelocity.toString());
                      document.getElementById("leftVelocityValue").innerHTML = hands[i].palmVelocity.toString();
                    }else if(type == "right"){
                      rightStickMesh.position.copy(vec3);
                      rightStickMesh.rotation.x = -Math.PI/3;
                      document.getElementById("rightVelocityValue").innerHTML = hands[i].palmVelocity.toString();
                    }
                    // var temp=new THREE.Object3D();
                    // temp.add(leftStickMesh);
                    // temp.rotation.y=Math.PI/4;
                  }
                }
              }
            });

          new InteractablePlane(collider, Leap.loopController);
          console.log(leapController);
      }, onProgress, onError);
  });
  /*************************************************************************/
}

function animate(){
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;
  // cylinder.rotation.x += 0.01;
  var once = false;
  if(drum){
    if(leapController && !once){
      // console.log(leapController);
      // console.log(leapController.plugins);
      once = true;
    }

    //console.log(leapController.plugins.boneHand);
  }

  // console.log(mouse);
  raycaster.setFromCamera(mouse,camera);

  /**
   * 检测leftStickMesh 与场景中的其他物体是否发生了碰撞
   *
   */
   var originPoint = leftStickMesh.position.clone();

   for(var vertextIndex = 0;vertextIndex<leftStickMesh.geometry.vertices.length;vertextIndex++){
     // 顶点的原始坐标
     var localVertext = leftStickMesh.geometry.vertices[vertextIndex].clone();
     // 顶点经过变换后的坐标
     var globalVertext = localVertext.applyMatrix4(leftStickMesh.matrix);
     // 获取由leftStickMesh指向定点的向量
     var directionVector = globalVertext.sub(leftStickMesh.position);

     // 将方向向量初始化
     var ray = new THREE.Raycaster(originPoint,directionVector.clone().normalize());
     // 检测射线与多个物体的相交情况
     if(scene.children[3] != undefined){
       var collisionResults = ray.intersectObjects(scene.children[3].children);
       if(collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() && collisionResults[0].object.name != "stick"){
         console.log(collisionResults);
        //  console.log(collisionResults[0].object);
        //  collisionResults[0].object.material.materials[2].color.set(0xff0000);
        //  console.log("crash");
       }
     }
   }

  var intersects = raycaster.intersectObjects(drum.children);
  // console.log(intersects.length);
  if(intersects.length > 0){
    for (var i=0;i < intersects.length;i++){
      // console.log(intersects[i]);
      intersects[0].object.material.color.set(0xff0000);
      audioDomList[i].play();
      // mesh.rotation.x = 0;
      // mesh.rotation.y = 0;
    }
  }else{
    // 还原颜色
    for(let i=0;i<drum.children.length;i++){
      drum.children[i].material.color.set(0xAAAAAA);
    }
  }
  renderer.render(scene,camera);
}

function startRotate(mesh){

}

// 将屏幕2D坐标装换成three.js中的三维坐标
function convertTo3DCoordinate(clientX,clientY){
  var mouseVec = new THREE.Vector3(
    (clientX / window.innerWidth) * 2 - 1,
    -(clientY / window.innerHeight) * 2 +1,
    1
  );
  // console.log("mx: " + mouseVec.x + ", my: " + mouseVec.y+", mz:"+mouseVec.z);
  mouseVec.unproject(camera);
  // console.log("x: " + mouseVec.x + ", y: " + mouseVec.y+", z:"+mouseVec.z);
  return mouseVec;
}

//-----事件列表-----
function EventList(){
}
// 鼠标移动事件控制
EventList.prototype.mouseMove = function(event){
  console.log("mouse move");
  event.preventDefault;
  var mouse = convertTo3DCoordinate(event.clientX,event.clientY);
  leftStickMesh.position.copy(mouse);
};
// 设置二维鼠标坐标轴的值
EventList.prototype.setMouse2D = function(event){
  event.preventDefault;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 +1;
  isMove = true;
}
// 设置左右,上下箭头控制视角的事件
EventList.prototype.arrowLeft = function(){
  drum_group.rotation.y += 0.05;
};
EventList.prototype.arrowRight = function(){
  drum_group.rotation.y -= 0.05;
};
EventList.prototype.arrowUp = function(){
  drum_group.rotation.x += 0.05;
};
EventList.prototype.arrowDown = function(){
  drum_group.rotation.x -= 0.05;
};
EventList.prototype.zoomIn = function(){
  camera.position.z -= 20;
};
EventList.prototype.zoomOut = function(){
  camera.position.z += 20;
};
//-----事件列表-----

// 绑定事件
function bindEvent(){
  var eventlist = new EventList();
  window.addEventListener("mousemove",eventlist.setMouse2D);
  // window.addEventListener("mousemove",eventlist.mouseMove);
  window.addEventListener("keydown",function(event){
    var keycode = event.keyCode;
    console.log(keycode);
    // 根据不同的按钮出发不同的事件
    switch (keycode) {
      case 37:
        // 左方向键
        eventlist.arrowLeft();
        break;
      case 38:
        // 上方向键
        eventlist.arrowUp();
        break;
      case 39:
        // 右方向键
        eventlist.arrowRight();
        break;
      case 40:
        // 下方向键
        eventlist.arrowDown();
        break;
      default:
        break;
    }
  });
  window.addEventListener("mousewheel",function(event){
    console.log("scroll happend!");
    console.log(event);
    // 查看event的 deltaY属性,大于0表示滚轮向下滚动了,小于0表示滚轮向上滚动了.
    var deltaY = event.deltaY;
    if(deltaY>0){
      // zoomOut
      eventlist.zoomOut();
    }else{
      // zoomIn
      eventlist.zoomIn();
    }
  });
}

// 为保证执行下面的方法的时候所有的内容都成功执行
// 把下面触发方法执行的代码放在最后
init();

bindEvent();
