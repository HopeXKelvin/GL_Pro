window.onload = function(){
  var width = window.innerWidth,
  height = window.innerHeight;

  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer();
  document.body.appendChild(renderer.domElement);
  var camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);

  camera.position.set(-1018 * 0.9, 729 * 0.9, 613 * 0.9);
  camera.rotation.set(-0.871653376, -0.8185568, -0.7150720);
  camera.lookAt(new THREE.Vector3(0, 160, 0));

  renderer.setSize(width, height);
  renderer.shadowMapEnabled = true;
  renderer.shadowMapType = THREE.PCFSoftShadowMap;

  var axisHelper = new THREE.AxisHelper( 100 );
  scene.add( axisHelper );

  // var controls = new THREE.OrbitControls( camera, renderer.domElement );

  var light = new THREE.SpotLight( 0xffffff, 1 );
  light.target.position.set( 0, 100, 0 );
  scene.add(light.target); // see https://github.com/mrdoob/three.js/issues/2251
  light.castShadow = true;
  light.shadowCameraVisible = true; // This makes for excellent debugging
  light.shadowDarkness = 0.8;

  var dolly = new THREE.Object3D;
  dolly.position.set(0,400,300);

  scene.add(dolly);
  dolly.add(light);

  var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(160,160),
    new THREE.MeshPhongMaterial({wireframe: false})
  );

  plane.scale.multiplyScalar(3);
  plane.position.set(0,-10,-150);
  plane.receiveShadow = true;

  camera.lookAt( plane.position );
  scene.add(plane);

  var box = new THREE.Mesh(
    new THREE.BoxGeometry(60,60,30), // mm
    new THREE.MeshPhongMaterial({color: 0xffff00})
  );

  box.castShadow = true;
  box.receiveShadow = true;

  var collider = new THREE.Mesh(new THREE.PlaneGeometry(59,59));
  collider.position.set(0, 140, 0);

  collider.add(box);
  scene.add(collider);

  Leap.loop()
    .use('boneHand', {
      targetEl: document.body,
      arm: true,
      scene: scene,
      render: function(){
        renderer.render(scene, camera)
      }
    });

  new InteractablePlane(collider, Leap.loopController);


  // var controllerOptions = {};
  //
  // Leap.loop(controllerOptions, function(frame) {
  //   // Body of callback function
  //   console.log(frame);
  //   console.log("frame.id:" + frame.id);
  //   console.log("frame.hands.length: " + frame.hands.length);
  // })
};
