(function(w,$,_K){
    var _global = {};
    var rightDom = document.getElementsByClassName('right-area')[0];
    var leftDom = document.getElementsByClassName('left-area')[0];
    var wallPoints = [];
    var wallList = [];
    var isFirstWallPoint = true;// 标识是否为点下去的第一个点(墙体)

    function init(){}

    // 左边部分的2d图像类
    function Left2DClass(){
        this.wallList = []; // 存放每一组墙体的数组
        this.wallNodeList = []; // 存放墙体节点的数组
        this.direction = {};
    }

    // Left2DClass 类的各个方法
    // node属于 object类型
    // node = {x:1,y:1}
    Left2DClass.prototype.render2DWall = function(node,w,h,isEnd){
        if(this.wallNodeList.length === 0){
            // 第一个点
            this.wallNodeList.push(node);

        }else{
            // 非第一个点
            var prevNode = this.wallNodeList[this.wallNodeList.length-1];
            var thisNode = node;
            var direction = this.getDirBy2Node(prevNode, thisNode);
            console.log(direction);
            var wallPointList = this.getPointsByDir(prevNode, thisNode,w,h,direction);
            console.log(wallPointList);
            this.render3DWall(wallPointList);
            this.wallNodeList.push(node);
            if(isEnd){
                // this.wallList.push();
                this.wallNodeList = [];
            }
        }
    };

    // 判断两个点的方向关系的方法
    Left2DClass.prototype.getDirBy2Node = function (prevNode,nextNode){
        // 八个方向
        // left,right,up,down,leftUp,leftDown,rightUp,rightDown
        var x0 = prevNode.x,
            y0 = prevNode.y,
            x1 = nextNode.x,
            y1 = nextNode.y;
        var xDis = x1 - x0;
        var yDis = y1 - y0;
        if(xDis == 0){
            if(yDis > 0){
                return 'down';
            }else{
                return 'up';
            }
        }else if(xDis > 0){
            if(yDis == 0){
                return 'right';
            }else if(yDis > 0){
                return 'rightDown';
            }else{
                return 'rightUp';
            }
        }else{
            if(yDis == 0){
                return 'left';
            }else if(yDis > 0){
                return 'leftDown';
            }else{
                return 'leftUp';
            }
        }
    }

    // 根据方向设定墙体的两个点
    Left2DClass.prototype.getPointsByDir = function (prevNode,nextNode,w,h,dir){
        var x0 = prevNode.x,
            y0 = prevNode.y,
            x1 = nextNode.x,
            y1 = nextNode.y;
        var pointsList = [];
        switch (dir)
        {
            case 'up' : 
                pointsList.push(x0,y0+h);
                pointsList.push(x0+w,y0+h);
                pointsList.push(x1+w,y1);
                pointsList.push(x1,y1);
                break;
            case 'down' : 
                pointsList.push(x0,y0);
                pointsList.push(x0+w,y0);
                pointsList.push(x1+w,y1+h);
                pointsList.push(x1,y1+h);
                break;
            case 'left' : 
                pointsList.push(x0+w,y0);
                pointsList.push(x0+w,y0+h);
                pointsList.push(x1,y1+h);
                pointsList.push(x1,y1);
                break;
            case 'right' : 
                pointsList.push(x0,y0);
                pointsList.push(x0,y0+h);
                pointsList.push(x1+w,y1+h);
                pointsList.push(x1+w,y1);
                break;
            case 'leftUp' : 
                pointsList.push(x0+w,y0);
                pointsList.push(x0,y0+h);
                pointsList.push(x1,y1+h);
                pointsList.push(x1+w,y1);
                break;
            case 'leftDown' : 
                pointsList.push(x0,y0);
                pointsList.push(x0+w,y0+h);
                pointsList.push(x1+w,y1+h);
                pointsList.push(x1,y1);
                break;
            case 'rightUp' : 
                pointsList.push(x0,y0);
                pointsList.push(x0+w,y0+h);
                pointsList.push(x1+w,y1+h);
                pointsList.push(x1,y1);
                break;
            case 'rightDown' : 
                pointsList.push(x0+w,y0);
                pointsList.push(x0,y0+h);
                pointsList.push(x1,y1+h);
                pointsList.push(x1+w,y1);
                break;
        }

        return pointsList;
    }

    // 生成三维的墙体
    Left2DClass.prototype.render3DWall = function(points){
        var wallShape = new THREE.Shape();
        for(var i=0;i<points.length;i+=2){
            var x = points[i];
            var y = points[i+1];
            if(i == 0){
                wallShape.moveTo(x,y);
            }else{
                wallShape.lineTo(x,y);
            }
        }

        var extrudeSettings = {
            steps: 2,
	        amount: 150,
	        bevelEnabled: true,
	        bevelThickness: 1,
	        bevelSize: 1,
	        bevelSegments: 1
        };
        var geo = new THREE.ExtrudeGeometry(wallShape,extrudeSettings);
        var material = new THREE.MeshLambertMaterial( { color: 0x808080, wireframe: false } );
        var mesh = new THREE.Mesh(geo,material);
        _global.scene.add(mesh);
    }

    // 画2d的线
    Left2DClass.prototype.draw2dLine = function(layer, pos){
    };



    function initRenderScene(rootDom,planeWidth,planeHeight){
        // 场景
        _global.scene = new THREE.Scene();
        // 相机
        _global.camera = new THREE.PerspectiveCamera(50, rootDom.clientWidth/rootDom.clientHeight, 1, 10000);
        // _global.camera.position.set(1000,1000,1000);

        // _global.camera.lookAt({x: 0,y: 600,z: 200});

        _global.camera.position.x = 600;//相机的位置
        _global.camera.position.y = 700;
        _global.camera.position.z = 1500;
        _global.camera.up.x = 0;//相机以哪个方向为上方
        _global.camera.up.y = 0;
        _global.camera.up.z = 1;
        _global.camera.lookAt({//相机看向哪个坐标
            x : 300,
            y : 300,
            z : 0
        });

        // 创建光源
        _global.scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
        _global.scene.fog.color.setHSL( 0.6, 0, 1 );
        // LIGHTS
        hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 500, 0 );
        _global.scene.add( hemiLight );

        var light = new THREE.DirectionalLight (0xffffff); //创建光源
        light.position.set(0,0,1).normalize(); //设置光源的位置
        _global.scene.add(light); //在场景中添加光源

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
        // var geometry = new THREE.PlaneGeometry( planeWidth, planeHeight, 1 );
        // var material2 = new THREE.MeshBasicMaterial( {color: 0xaaaaaa, side: THREE.DoubleSide} );
        // var plane = new THREE.Mesh( geometry, material2 );
        // plane.position.x = 0;
        // plane.position.y = -1;
        // plane.position.z = 0;
        // plane.rotation.x = -1.7;
        // plane.rotation.z = 0.5;
        // _global.plane = plane;
        // _global.scene.add( plane );

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
        window._global = _global;
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
            setGeo(w,h);
            // addWallToWg({x:0,y:0},{x:100,y:100});
            // test
            var points = [{x:83,y:490},{x:83,y:116},{x:160,y:116},{x:160,y:77},{x:258,y:77},{x:258,y:266}];
            var points2 = [{x:81,y:488},{x:85,y:492},{x:81,y:114},{x:85,y:118}];
            var point = [{x:0,y:0},{x:606,y:0},{x:0,y:200}]
            // shapeWall(point);
            animate();
        };
        image.error = function(e){
            console.log('图片加载失败');
            return;
        };
    }

    // 1 point to 2 points function
    function one2TwoPoints(point){
        var result = [];
        result.push({
            x: point.x -2,
            y: point.y - 2
        });
        result.push({
            x: point.x +2,
            y: point.y +2
        });
        return result;
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

        // 辅助方法
        var nodeList = [];
        var design2dObj = new Left2DClass();

        // 添加50*50的方格
        var rectWid = Math.ceil(width/40);
        var rectHei = Math.ceil(height/40);
        var rectList = [];
        var colorList = ['#ef0123','#efa123','#afa123','#efa1e3','#efaaaa'];
        for(var i=0;i<40;i++){
            var xPos = i*rectWid;
            for(var j=0;j<40;j++){
                var yPos = j*rectHei;
                var rect = new Konva.Rect({
                    x: xPos,
                    y: yPos,
                    width: rectWid,
                    height: rectHei,
                    fill: colorList[Math.floor(Math.random()*4)],
                    // stroke: 'black',
                    // strokeWidth: 1,
                    opacity: 0.35
                });

                rect.on('click', function(event){
                    console.log('cube is click');
                    console.log(this);
                    var x = this.attrs.x;
                    var y = this.attrs.y;
                    var wid = this.attrs.width;
                    var hei = this.attrs.height;
                    var node = {
                        x: x,
                        y: y
                    };
                    design2dObj.render2DWall(node,wid,hei,false);
                });

                rect.on('dblclick', function(event){
                    console.log('cube is double click');
                    console.log(this);
                    var x = this.attrs.x;
                    var y = this.attrs.y;
                    var wid = this.attrs.width;
                    var hei = this.attrs.height;
                    var node = {
                        x: x,
                        y: y
                    };
                    design2dObj.render2DWall(node,wid,hei,true);
                });
                layer.add(rect);
                rectList.push(rect);
            }
        }


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
            // var mousePos = stage.getPointerPosition();
            // console.log(mousePos);
            // var pos = [mousePos.x, mousePos.y];
            // if(isFirstWallPoint){
            //     var newWall = getLineStart(layer, mousePos);
            //     layer.add(newWall);
            //     wallList.push(newWall);
            //     isFirstWallPoint = false;
            // }else{
            //     var curWall = wallList[wallList.length-1];
            //     curWall.points(curWall.points().concat(pos));
            //     var last4Points = curWall.points().slice(-4);
            //     var fPoint = {
            //         x: last4Points[0],
            //         y: last4Points[1]
            //     };
            //     var sPoint = {
            //         x: last4Points[2],
            //         y: last4Points[3]
            //     };
            //     var dir = getDirBy2Points(fPoint,sPoint);
            //     console.log(dir);
            //     var from = {
            //         x: last4Points[0],
            //         y: last4Points[1]
            //     };
            //     var to = {
            //         x: last4Points[2],
            //         y: last4Points[3]
            //     };
            //     // addWallToWg(from, to);
            // }
            // layer.draw();
        });

        layer.on('dblclick', function(event){
            // var mousePos = stage.getPointerPosition();
            // var pos = [mousePos.x, mousePos.y];
            // var curWall = wallList[wallList.length-1];
            // curWall.points(curWall.points().concat(pos));
            // isFirstWallPoint = true;
        });

        // redLine.points([200, 100, 200, 300, 400, 300]);
        // layer.add(redLine);
        // layer.draw();// 每次更新新的图形的时候都需要 draw一下
        console.log(lines);
        console.log(stage);
    }

    // 判断两个点之间的方向关系
    function getDirBy2Points(firstPoint, secondPoints){
        // 八个方向
        // left,right,up,down,leftUp,leftDown,rightUp,rightDown
        var x0 = firstPoint.x,
            y0 = firstPoint.y,
            x1 = secondPoints.x,
            y1 = secondPoints.y;
        var xDis = x1 - x0;
        var yDis = y1 - y0;
        if(xDis == 0){
            if(yDis > 0){
                return 'down';
            }else{
                return 'up';
            }
        }else if(xDis > 0){
            if(yDis == 0){
                return 'right';
            }else if(yDis > 0){
                return 'rightDown';
            }else{
                return 'rightUp';
            }
        }else{
            if(yDis == 0){
                return 'left';
            }else if(yDis > 0){
                return 'leftDown';
            }else{
                return 'leftUp';
            }
        }
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
        // var x = Math.abs(to.x - from.x);
        // var y = Math.abs(to.y - from.y);
        // var geometry = new THREE.BoxGeometry( x, 200, y );
        // var material = new THREE.MeshBasicMaterial( {color: 0x888888} );
        // var cube = new THREE.Mesh( geometry, material );
        // cube.position.x = x/2-350;
        // cube.position.z = y/2-304;
        // cube.position.y = 100;
        // _global.wall = cube;
        // _global.scene.add( cube );
        var pointsList = [{x: from.y-4,y: from.x-4},{x: from.y+4,y: from.x+4},{x: to.y-4,y: to.x-4},{x: to.y+4,y: to.x+4}];
        shapeWall(pointsList);
    }

    // 生成墙体的方法(利用shape和 ExtrudeGeometry)
    function shapeWall(points){
        var shape = new THREE.Shape();
        for(var i=0;i<points.length;i++){
            var x = points[i].x;
            var y = points[i].y;
            if(i == 0){
                shape.moveTo(x,y);
            }else{
                shape.lineTo(x,y);
            }
        }
        var extrudeSettings = {
            steps: 2,
	        amount: 150,
	        bevelEnabled: true,
	        bevelThickness: 1,
	        bevelSize: 1,
	        bevelSegments: 1
        };
        var geo = new THREE.ExtrudeGeometry(shape,extrudeSettings);
        var mat = new THREE.MeshBasicMaterial({color: 0x00ff00});
        var matY = new THREE.MeshPhongMaterial({
            color: "yellow" //设置颜色为yellow
        });
        var material = new THREE.MeshLambertMaterial( { color: 0xb00000, wireframe: false } );
        var mesh = new THREE.Mesh(geo,material);
        _global.scene.add(mesh);
    }

    // 利用 定点和面创建几何体
    function setGeo(width,height){
        var mat = new THREE.MeshBasicMaterial({color: 0xaaaaaa,side: THREE.DoubleSide});
        var material2 = new THREE.MeshLambertMaterial( { color: 0x00ff00,side: THREE.DoubleSide} );
        // 创建一个矩形平面plane
        var planeGeo = new THREE.Geometry();
        planeGeo.vertices.push(new THREE.Vector3(0,0,0));
        planeGeo.vertices.push(new THREE.Vector3(0,height,0));
        planeGeo.vertices.push(new THREE.Vector3(width,height,0));
        planeGeo.vertices.push(new THREE.Vector3(width,0,0));

        // 创建新的面face
        var normal = new THREE.Vector3(0,0,-1);
        var color = new THREE.Color(0x12cc21);
        var materialIndex = 0;
        var face1 = new THREE.Face3(0,1,3);
        var face2 = new THREE.Face3(1,2,3);

        planeGeo.faces.push(face1);
        planeGeo.faces.push(face2);
        _global.scene.add(new THREE.Mesh(planeGeo,mat));
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
        // _global.scene.rotation.y += 0.005;
        // _global.scene.rotation.y -= 0.005;
        // _global.scene.rotation.z -= 0.005;

        // console.log(_global.scene.rotation.z);
        if(_global.camera.rotation.z <= 1.7){
            _global.camera.rotation.z += 0.015;
        }
        // console.log(_global.camera.rotation.z);
        requestAnimationFrame(animate);
        render();
    }

    function render(){
        _global.renderer.render(_global.scene, _global.camera);
    }

      window.addEventListener("mousewheel",function(event){
        console.log("scroll happend!");
        console.log(event);
        // 查看event的 deltaY属性,大于0表示滚轮向下滚动了,小于0表示滚轮向上滚动了.
        var deltaY = event.deltaY;
        if(deltaY>0){
            // zoomOut
            // eventlist.zoomOut();
            _global.camera.position.z -= 20;
        }else{
            // zoomIn
            // eventlist.zoomIn();
            _global.camera.position.z += 20;
        }
    });
})(window,jQuery,Konva);
