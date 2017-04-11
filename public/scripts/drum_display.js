// 全局变量
var scene,camera,mesh;

window.onload = init;

function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
  var webGLRenderer = new THREE.WebGLRenderer();
  var meshMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff});
  webGLRenderer.setClearColor(0xaaaaaa);
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMapEnabled = true;
  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 70;
  camera.lookAt(new THREE.Vector3(0,10,0));
  var ambient = new THREE.AmbientLight( 0x444444 );
  scene.add(ambient);
  var directionalLight = new THREE.DirectionalLight( 0xffeedd );
  directionalLight.position.set( 0, 0, 1 ).normalize();
  scene.add(directionalLight);

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
  THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('static/assets/models/My_Drums/');
  mtlLoader.load('drum_example.mtl', function(materials) {
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('static/assets/models/My_Drums/');
      objLoader.load('drum_example.obj', function(object){
          mesh = object;
          mesh.scale.x = 30;
          mesh.scale.y = 30;
          mesh.scale.z = 30;
          mesh.rotation.y =2.3;
          object.position.y = -5;
          object.position.z = 10;
          scene.add(object);
      }, onProgress, onError);
  });
  /*************************************************************************/

  render();

  function render(){
    if(mesh){
      mesh.rotation.y += 0.01;
    }
    requestAnimationFrame(render);
    webGLRenderer.render(scene,camera);
  }
}
