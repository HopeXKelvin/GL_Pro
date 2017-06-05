(function(w,$,_K){
    var _global = {}; 
    var rightDom = document.getElementsByClassName('right-area')[0];
    var leftDom = document.getElementsByClassName('left-area')[0];
    var wallPoints = [];
    var wallList = [];
    var isFirstWallPoint = true;// 标识是否为点下去的第一个点(墙体)

    function init(){}

    function initRenderScene(rootDom,planeWidth,planeHeight){
        // 场景
        _global.scene = new THREE.Scene();
        // 相机
        _global.camera = new THREE.PerspectiveCamera(50, rootDom.clientWidth/rootDom.clientHeight, 1, 10000);
        _global.camera.position.set(0,500,1000);
        // _global.camera.lookAt(new THREE.Vector3(0, 0, 0));
        // 用于展示demo的cube
        var geo = new THREE.BoxGeometry(200,200,200);
        for (var i = 0; i < geo.faces.length; i += 2){
            var hex = Math.random() * 0xffffff;
            geo.faces[ i ].color.setHex( hex );
            geo.faces[ i + 1 ].color.setHex( hex );
        }
        var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
        var cube = new THREE.Mesh(geo, material);
        cube.position.y = 150;
        // _global.scene.add(cube);

        // 添加平面
        var geometry = new THREE.PlaneGeometry( planeWidth, planeHeight, 1 );
        var material2 = new THREE.MeshBasicMaterial( {color: 0xaaaaaa, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometry, material2 );
        plane.position.x = 0;
        plane.position.y = -1;
        plane.position.z = 0;
        plane.rotation.x = -1.7;
        plane.rotation.z = 0.5;        
        _global.plane = plane;
        _global.scene.add( plane );

        // 添加辅助坐标轴
        // 新建坐标轴
        var axis = new THREE.AxisHelper(1200);
        // 在场景中添加坐标轴
        _global.scene.add(axis);
        _global.axis = axis;
        _global.camera.lookAt(_global.scene.position);

        // renderer
        _global.renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
        _global.renderer.setClearColor(0x0f0f0f);
        // _global.renderer.setPixelRatio(window.devicePixelRatio);
        _global.renderer.setSize(rootDom.clientWidth, rootDom.clientHeight);
        rootDom.appendChild(_global.renderer.domElement);
    }

    // 左边部分，加载图片，生成对用的canvas
    function loadDesignImg(url,holder){
        var image = new Image();
        image.src = url;
        image.onload = function(event){
            console.log('图片加载成功');
            console.log(event);
            var h = image.height;
            var w = image.width;
            var src = image.src;
            console.log(w + ":" + h);
            renderLeftCanvas(w,h,src,holder);
            initRenderScene(rightDom,w,h);
            renderKonva(w,h);
            // addWallToWg({x:0,y:0},{x:100,y:100});
            animate();
        };
        image.error = function(e){
            console.log('图片加载失败');
            return;
        };
    }

    // 生成左边的canvas
    function renderLeftCanvas(width,height,bgImg,root){
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.className = 'design-2d-area';
        canvas.style.backgroundImage = bgImg;
        root.appendChild(canvas);
    }

    // 利用Konva库，创建一个用来做平面设计的部分
    function renderKonva(width,height){
        var stage = new _K.Stage({
            container: 'leftArea',   // id of container <div>
            width: width,
            height: height
        });

        var layer = new Konva.Layer();
        var circle = new Konva.Circle({
            x: 0,
            y: 0,
            radius: 70,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 4
        });

        // 底层rect
        var baseRect = new Konva.Rect({
            x: 0,
            y: 0,
            width: width,
            height: height,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4 
        });

        var imageObj = new Image();
        imageObj.onload = function() {
            var yoda = new Konva.Image({
                x: 0,
                y: 0,
                image: imageObj,
                width: width,
                height: height
            });
            
            // add the shape to the layer
            layer.add(yoda);
            // add the layer to the stage
            stage.add(layer);
            yoda.setZIndex(0);
            layer.draw();
        };
        imageObj.src = 'static/images/design_2.jpg';

        var rect = new Konva.Rect({
            x: 50,
            y: 50,
            width: 100,
            height: 50,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4
        });

        // 直线
        var redLine = new Konva.Line({
            points: [0, 0],
            stroke: 'green',
            strokeWidth: 10,
            lineCap: 'round',
            lineJoin: 'round'
        });

        var line = null;

        // layer.add(baseRect);
        // layer.add(rect);
        // layer.add(circle);
        layer.add(redLine);
        stage.add(layer);

        redLine.setZIndex(1);
        layer.draw();
        
        var lines = redLine.points();

        // 添加事件
        layer.on('click', function(event){
            var mousePos = stage.getPointerPosition();
            console.log(mousePos);
            var pos = [mousePos.x, mousePos.y];
            if(isFirstWallPoint){
                var newWall = getLineStart(layer, mousePos);
                layer.add(newWall);
                wallList.push(newWall);
                isFirstWallPoint = false;
            }else{
                var curWall = wallList[wallList.length-1];
                curWall.points(curWall.points().concat(pos));
                var last4Points = curWall.points().slice(-4);
                var from = {
                    x: last4Points[0],
                    y: last4Points[1]
                };
                var to = {
                    x: last4Points[2],
                    y: last4Points[3]
                };
                addWallToWg(from, to);
            }
            layer.draw();
        });

        layer.on('dblclick', function(event){
            var mousePos = stage.getPointerPosition();
            var pos = [mousePos.x, mousePos.y];
            var curWall = wallList[wallList.length-1];
            curWall.points(curWall.points().concat(pos));
            isFirstWallPoint = true;
        });

        // redLine.points([200, 100, 200, 300, 400, 300]);
        // layer.add(redLine);
        // layer.draw();// 每次更新新的图形的时候都需要 draw一下
        console.log(lines);
        console.log(stage);
    }

    // 开启一个新线段的起点
    function getLineStart(layer, pos){
        var lineStart = new Konva.Line({
            points: [pos.x, pos.y],
            stroke: 'green',
            strokeWidth: 10,
            lineCap: 'round',
            lineJoin: 'round'
        });
        
        return lineStart;
    }

    // 生成墙体的方法
    function addWallToWg(from,to){
        var x = Math.abs(to.x - from.x);
        var y = Math.abs(to.y - from.y);
        var geometry = new THREE.BoxGeometry( x, 200, y );
        var material = new THREE.MeshBasicMaterial( {color: 0x888888} );
        var cube = new THREE.Mesh( geometry, material );
        cube.position.x = x/2-350;
        cube.position.z = y/2-304;
        cube.position.y = 100;
        _global.wall = cube;
        _global.scene.add( cube );
    }

    


    var imgSrc = 'static/images/design_2.jpg';
    loadDesignImg(imgSrc,leftDom);
    // initRenderScene(rightDom);
    // animate();

    function animate(){
        // _global.plane.rotation.y += 0.01;
        // _global.plane.rotation.x += 0.01;
        // console.log(_global.plane.rotation.x);
        // _global.axis.rotation.y += 0.005;
        // _global.wall.rotation.y += 0.005;
        requestAnimationFrame(animate);
        render();
    }

    function render(){
        _global.renderer.render(_global.scene, _global.camera);
    }
})(window,jQuery,Konva);