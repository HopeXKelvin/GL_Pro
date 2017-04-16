/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__styles_less_drum_display_less__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__styles_less_drum_display_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__styles_less_drum_display_less__);
console.log("drum display!");



//
//
// // 全局变量
// var scene,camera,mesh;
//
// window.onload = init;
//
// function init(){
//   scene = new THREE.Scene();
//   camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
//   var webGLRenderer = new THREE.WebGLRenderer();
//   var meshMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff});
//   webGLRenderer.setClearColor(0xaaaaaa);
//   webGLRenderer.setSize(window.innerWidth, window.innerHeight);
//   webGLRenderer.shadowMapEnabled = true;
//   camera.position.x = -30;
//   camera.position.y = 40;
//   camera.position.z = 70;
//   camera.lookAt(new THREE.Vector3(0,10,0));
//   var ambient = new THREE.AmbientLight( 0x444444 );
//   scene.add(ambient);
//   var directionalLight = new THREE.DirectionalLight( 0xffeedd );
//   directionalLight.position.set( 0, 0, 1 ).normalize();
//   scene.add(directionalLight);
//
//   var group = new THREE.Object3D();
//
//   document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);
//   var step = 0;
//
//   /*************************************************************************/
//   var onProgress = function(xhr) {
//       if (xhr.lengthComputable) {
//           var percentComplete = xhr.loaded / xhr.total * 100;
//           console.log(Math.round(percentComplete, 2) + '% downloaded');
//       }
//   };
//   var onError = function(xhr) {};
//   THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
//   var mtlLoader = new THREE.MTLLoader();
//   mtlLoader.setPath('static/assets/models/My_Drums/');
//   mtlLoader.load('drum_example.mtl', function(materials) {
//       materials.preload();
//       var objLoader = new THREE.OBJLoader();
//       objLoader.setMaterials(materials);
//       objLoader.setPath('static/assets/models/My_Drums/');
//       objLoader.load('drum_example.obj', function(object){
//           mesh = object;
//           mesh.scale.x = 30;
//           mesh.scale.y = 30;
//           mesh.scale.z = 30;
//           mesh.rotation.y =2.3;
//           object.position.y = -5;
//           object.position.z = 10;
//           scene.add(object);
//       }, onProgress, onError);
//   });
//   /*************************************************************************/
//
//   render();
//
//   function render(){
//     if(mesh){
//       mesh.rotation.y += 0.01;
//     }
//     requestAnimationFrame(render);
//     webGLRenderer.render(scene,camera);
//   }
// }


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);