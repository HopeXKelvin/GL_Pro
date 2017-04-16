// 全局变量
var scene,camera,mesh;

window.onload = init;

function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,1000);
  var webGLRenderer = new THREE.WebGLRenderer();
  var meshMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff});
  webGLRenderer.setClearColor(0xaaaaaa);
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMapEnabled = true;
  camera.position.x = 0;
  camera.position.y = 50;
  camera.position.z = 70;
  camera.lookAt(new THREE.Vector3(0,0,0));

  var ambient = new THREE.AmbientLight( 0x444444 );
  scene.add(ambient);
  var directionalLight = new THREE.DirectionalLight( 0xffeedd );
  directionalLight.position.set( 0, 0, 1 ).normalize();
  scene.add(directionalLight);

  //创建立方体
  var geometry=new THREE.BoxGeometry(10,10,10);
  var material=new THREE.MeshBasicMaterial({color:0x00ff00
  ,wireframe:true
  });
  var cube=new THREE.Mesh(geometry,material);
  cube
  scene.add(cube);

  var group = new THREE.Object3D();

  document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);
  var step = 0;

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
          mesh = object;
          mesh.children[0].geometry.center()
          mesh.scale.x = 5;
          mesh.scale.y = 5;
          mesh.scale.z = 5;
          // mesh.rotation.y =2.3;
          mesh.position.x = 0
          mesh.position.y = 0
          mesh.position.z = 0;

          scene.add(mesh);
          window.scene = scene;
          window.camera = camera;
          window.mesh = mesh;
      }, onProgress, onError);
  });
  /*************************************************************************/
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  function onMouseMove( event ) {
    console.log("mouse move");
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }
  window.addEventListener( 'mousemove', onMouseMove, false );

  render();

  function render(){
    if(mesh){
      // mesh.rotation.y += 0.01;
    }
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera( mouse, camera );
    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( scene.children );
    // if(intersects.length != 0){
    //   console.log(intersects);
    // }
    for ( var i = 0; i < intersects.length; i++ ) {

      intersects[ i ].object.material.color.set( 0xff4411 );
    }
    requestAnimationFrame(render);
    webGLRenderer.render(scene,camera);
  }

}

//控制camera,mesh等物体的dom结构生成
