// 全局变量
var scene,camera,drumObj,renderer;
var geometry, material,mesh,stickMesh,raycaster,mouse,isMove,drum;

var INTERSECTED;

function init(){
  // 场景
  scene = new THREE.Scene();
  // 相机
  camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,10000);
  camera.position.z = 1000;
  camera.position.set(3,500,1000);
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
  scene.add(mesh);
  // stick
  var geometry = new THREE.CylinderGeometry(2,2,20,20);
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  stickMesh = new THREE.Mesh(geometry,material);
  stickMesh.name = "stick";
  stickMesh.scale.x = 10;
  stickMesh.scale.y = 10;
  stickMesh.scale.z = 10;
  scene.add(stickMesh);

  // 加入场景
  var regionR = 3;
  var cylinderGeo = new THREE.CylinderGeometry(regionR,regionR,0.05,1024);
  var material = new THREE.MeshNormalMaterial();
  var cylinder = new THREE.Mesh(cylinderGeo,material);
  cylinder.scale.x = 100;
  cylinder.scale.y = 100;
  cylinder.scale.z = 100;
  cylinder.position.set(0,0,0);
  scene.add(cylinder);

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
  mtlLoader.load('Drum_Split.mtl', function(materials) {
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('static/assets/models/');
      objLoader.load('Drum_Split.obj', function(object){
          // while(object.children[0] != null){
          // 	group.add(object.children[0]);
          // }
          // mesh = group;
          drum = object;
          drum.name = "drum";
          drum.children[0].geometry.center()
          drum.scale.x = 100;
          drum.scale.y = 100;
          drum.scale.z = 100;
          // drum.rotation.y =2.3;
          // position.x = 1000;
          drum.position.x = 100;
          drum.position.y = 0;
          drum.position.z = 200;

          drum.rotation.y = -10;
          drum.rotation.x = 0.6;

          scene.add(drum);
          window.scene = scene;
          window.camera = camera;
          window.drum = drum;
      }, onProgress, onError);
  });
  /*************************************************************************/
}

function animate(){
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;
  if(drum){
    // drum.rotation.x += 0.02;
    // drum.rotation.y += 0.02;
  }

  // console.log(mouse);
  raycaster.setFromCamera(mouse,camera);

  /**
   * 检测stickMesh 与场景中的其他物体是否发生了碰撞
   *
   */
   var originPoint = stickMesh.position.clone();

   for(var vertextIndex = 0;vertextIndex<stickMesh.geometry.vertices.length;vertextIndex++){
     // 顶点的原始坐标
     var localVertext = stickMesh.geometry.vertices[vertextIndex].clone();
     // 顶点经过变换后的坐标
     var globalVertext = localVertext.applyMatrix4(stickMesh.matrix);
     // 获取由stickMesh指向定点的向量
     var directionVector = globalVertext.sub(stickMesh.position);

     // 将方向向量初始化
     var ray = new THREE.Raycaster(originPoint,directionVector.clone().normalize());
     // 检测射线与多个物体的相交情况
     if(scene.children[3] != undefined){
       var collisionResults = ray.intersectObjects(scene.children[3].children);
       if(collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() && collisionResults[0].object.name != "stick"){
        //  console.log(collisionResults);
         console.log(collisionResults[0].object);
         collisionResults[0].object.material.materials[2].color.set(0xff0000);
         console.log("crash");
       }
     }
   }

  var intersects = raycaster.intersectObjects(scene.children);
  // console.log(intersects.length);
  // if(intersects.length > 0){
  //   for (var i=0;i < intersects.length;i++){
  //     // console.log(intersects[i]);
  //     intersects[i].object.material.color.set(0xff0000);
  //     mesh.rotation.x = 0;
  //     mesh.rotation.y = 0;
  //   }
  // }else{
  //   mesh.material.color.set(0xfad123);
  //   mesh.rotation.x += 0.01;
  //   mesh.rotation.y += 0.02;
  // }
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
  stickMesh.position.copy(mouse);
};
// 设置二维鼠标坐标轴的值
EventList.prototype.setMouse2D = function(event){
  event.preventDefault;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 +1;
  isMove = true;
}
//-----事件列表-----

// 绑定事件
function bindEvent(){
  var eventlist = new EventList();
  window.addEventListener("mousemove",eventlist.setMouse2D);
  window.addEventListener("mousemove",eventlist.mouseMove);
}

// 为保证执行下面的方法的时候所有的内容都成功执行
// 把下面触发方法执行的代码放在最后
init();
animate();
bindEvent();
