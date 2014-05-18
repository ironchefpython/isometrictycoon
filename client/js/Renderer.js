(function (context, factory) {
    if (typeof define === 'function' && define.amd) { define(['THREE'], factory); }
    else if (typeof exports === 'object') { module.exports = factory(require('THREE')); } 
    else { context.Renderer = factory(context['THREE']); }
}(this, function (THREE) { /* BEGIN MODULE */

// var animater = function(renderer, stage) {
//     var animate = function() {
//         context.requestAnimFrame(animate);
//         renderer.render(stage);
//     };
//     return animate;
// };

var TILE_HALF_HEIGHT = 25;
var TILE_HALF_WIDTH = 50;
var TILE_DEPTH = 20;
var TILE_Z = 0.8;

var getOffset = function(loc) {
    return {
        x: (loc.s * TILE_HALF_WIDTH) - (loc.w * TILE_HALF_WIDTH),
        y: (loc.s * TILE_HALF_HEIGHT) + (loc.w * TILE_HALF_HEIGHT),
    };
};


var getLocation = function(x, y) {
    return {
        s: (y / TILE_HALF_HEIGHT / 2) + (x / TILE_HALF_WIDTH / 2),
        w: (y / TILE_HALF_HEIGHT / 2) - (x / TILE_HALF_WIDTH / 2),
    };
};

var getClosestPoint = function(x, y) {
    return {
        s: (y / TILE_HALF_HEIGHT / 2) + (x / TILE_HALF_WIDTH / 2),
        w: (y / TILE_HALF_HEIGHT / 2) - (x / TILE_HALF_WIDTH / 2),
    };
};


var makeTile = function(tile) {
    // var h = [0,0,0,0];
    var h = tile.heights;

    var points = [
        new THREE.Vector3( 0,  0, h[0] * TILE_Z),
        new THREE.Vector3( 1,  0, h[1] * TILE_Z),
        new THREE.Vector3( 1,  1, h[2] * TILE_Z),
        new THREE.Vector3( 0,  1, h[3] * TILE_Z),
    ];
        

    var tileMesh = new THREE.Object3D();

    var ground = new THREE.Geometry();
    
ground.dynamic = true;

    Array.prototype.push.apply(ground.vertices, points);

    if (h[0] === h[2]) {
        ground.faces.push(new THREE.Face3( 0, 1, 2 ));
        ground.faces.push(new THREE.Face3( 2, 3, 0 ));
    } else {
        ground.faces.push(new THREE.Face3( 1, 2, 3 ));
        ground.faces.push(new THREE.Face3( 3, 0, 1 ));
    }
    ground.computeBoundingBox();
    ground.dynamic = true;
    ground.faces[0].color = new THREE.Color( 0x228b22 );
    ground.faces[1].color = new THREE.Color( 0x228b22 );
    var tileMaterial = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors } );
    tileMaterial.vertexColors = THREE.FaceColors;
    var groundMesh = new THREE.Mesh(ground, tileMaterial);
    groundMesh.position = new THREE.Vector3(tile.x, tile.y, 0);
    groundMesh.userData.tile = tile;
    return groundMesh;


//     tileMesh.add(new THREE.Mesh(ground, tileMaterial));

    
//  tile.position.y = 0.00;
// tileMesh.rotation.x = - Math.PI/2 ;


};

var WorldRenderer = function(world) {
    this.world = world;
    this.scene = new THREE.Scene();
    this.viewports = [];
    
    this.surface = new THREE.Object3D();
    this.scene.add(this.surface);
    
    this.grid = new THREE.Object3D();
    this.scene.add(this.grid);
    
    var $this = this;
    world.setRenderCallback(function(tile) {
        var tileMesh = makeTile(tile);
        $this.surface.add(tileMesh);
        
        var border = new THREE.Geometry();
        Array.prototype.push.apply(border.vertices, tileMesh.geometry.vertices);
        var lineMaterial = new THREE.LineBasicMaterial({color: 0xFFFFFF});
        var borderMesh = new THREE.Line(border, lineMaterial);
        borderMesh.renderDepth = 1;
        borderMesh.position = new THREE.Vector3(tile.x, tile.y, 0);
        $this.grid.add(borderMesh);
        
    });
    
    
    var pointGeometry = new THREE.CircleGeometry( 0.16, 32 );
    pointGeometry.faces.forEach(function(face) {
            face.color = new THREE.Color( 0xff00000 );
    });
    var pointMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );
    this.pointHighlight = new THREE.Mesh(pointGeometry, pointMaterial);
    this.pointHighlight.visible = false;
    this.pointHighlight.renderDepth = 2;
    this.scene.add(this.pointHighlight);

};

WorldRenderer.prototype.startRender = function() {
    var viewports = this.viewports;
    var scene = this.scene;

    var renderLoop = function() {
        for (var i = viewports.length; i--; ) {
            viewports[i].renderer.render(scene, viewports[i].camera);
            viewports[i].update();
        }
        window.requestAnimationFrame(renderLoop);
    };
    
    renderLoop();
};
    

	
WorldRenderer.prototype.addViewport = function(element) {
    var view = new Viewport(this, element);
    this.viewports.push(view);
    return view;
};
	
	


//render();

// {
//         activate: function() {
//             renderer.addPointHighlight();
//             return this;
//         },
//         deactivate:  function() {
//             renderer.clearPointHighlight();
//         }, 
//         mousedown:  function(event) {
//             this.dragging = true;
//             this.startY = event.pageY;
//         },
//         mouseup:  function(event) {
//             this.dragging = false;
//         },
//         mousemove:  function(event) {
//             if (this.dragging) {
//                 renderer.previewTerraform(this.point, event.pageY - this.startY);
//             } else {
//                 this.point = renderer.getNearestPoint(event.pageX, event.pageY);
//                 renderer.highlightPoint(this.point);
//             }
//         }




function mousewheelEvent(camera) {
    var zoom = 0.02;
    return function(event) {
        event.preventDefault();
        event.stopPropagation();
    
        var delta = event.wheelDelta / 40;
    
        var width = camera.right / zoom;
        var height = camera.top / zoom;
    
        zoom -= delta * 0.0001;
    
        camera.left = -zoom*width;
        camera.right = zoom*width;
        camera.top = zoom*height;
        camera.bottom = -zoom*height;
        camera.updateProjectionMatrix();
    };
}

function mousemoveEvent(pointer) {

    return function(event) {
        var target = $(event.target);
        pointer.x = ( event.offsetX / target.width() ) * 2 - 1;
        pointer.y = - ( event.offsetY / target.height() ) * 2 + 1;
    };
}



var Viewport = function(worldRenderer, element) {
    this.worldRenderer = worldRenderer;
    this.element = element;
    
    this.pointer = {};

	var SCREEN_WIDTH = window.innerWidth-1, SCREEN_HEIGHT = window.innerHeight-1;	
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = -20000, FAR = 20000;

    // var camera = this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	this.camera = new THREE.OrthographicCamera(
        SCREEN_HEIGHT * ASPECT / -100, SCREEN_HEIGHT * ASPECT / 100,
        SCREEN_HEIGHT / 100, SCREEN_HEIGHT / -100, 
        NEAR, FAR );


	worldRenderer.scene.add(this.camera);
	this.camera.up.set( 0, 0, 1 );
	this.camera.position.set(15,15,10);
	this.camera.lookAt(worldRenderer.scene.position);	


	this.renderer = new THREE.WebGLRenderer( {antialias:true} );
	this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	element.appendChild(this.renderer.domElement);
	THREEx.WindowResize(this.renderer, this.camera);
    var controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    controls.noZoom = true;
    controls.noRotate = true;
    
    var $this = this;
    element.addEventListener( 'mousewheel', mousewheelEvent(this.camera), false );
    element.addEventListener( 'mousemove', mousemoveEvent(this.pointer), false );
    element.addEventListener( 'click', function() {$this.test();}, false );
    
    this.projector = new THREE.Projector();
    
    
};

Viewport.prototype.test = function() {
        var vector = new THREE.Vector3(
        this.pointer.x,
        this.pointer.y,
        1 );
    var ray = this.projector.pickingRay( vector, this.camera );
    var intersects = ray.intersectObject( this.worldRenderer.surface, true );
    console.log(intersects[0]);
        // console.log(pointer.tile);
};

var setGroundColor = function(ground, color) {
    ground.faces[0].color = color;
    ground.faces[1].color = color;
    ground.colorsNeedUpdate = true;
};

WorldRenderer.prototype.highlightTile = function(tile) {
    setGroundColor(tile.geometry, new THREE.Color(0x32cd32));
};

WorldRenderer.prototype.subdueTile = function(tile) {
    setGroundColor(tile.geometry, new THREE.Color(0x228b22));
};



WorldRenderer.prototype.highlightPoint = function(point) {
    this.pointHighlight.position = point;
    this.pointHighlight.visible = true;
};

WorldRenderer.prototype.subduePoint = function(point) {
    this.pointHighlight.visible = false;
};




// var highlighter = (function() {
//     var last;
//     var setGroundColor = function(ground, color) {
//         ground.faces[0].color = color;
//         ground.faces[1].color = color;
//         ground.colorsNeedUpdate = true;
//     };
//     return function(geometry) {
//         if (last) {
            
//         }
//         if (geometry) {
//             setGroundColor(geometry, new THREE.Color(0x32cd32));
//         }
//         last = geometry;
//     };
// })();




Viewport.prototype.update = (function() {
    var NULL_POINT = new THREE.Vector3(NaN, NaN, NaN);
    var lasttile = null;
    var lastpoint = NULL_POINT;
    
    return function() {
        var vector = new THREE.Vector3(
            this.pointer.x,
            this.pointer.y,
            1 );
        var ray = this.projector.pickingRay( vector, this.camera );
        var intersects = ray.intersectObject( this.worldRenderer.surface, true );
        var tile = intersects.length > 0 ? intersects[0].object : undefined;
        if (lasttile != tile) {
            if (lasttile) {
                $(this.element).trigger("tileout", lasttile);
            }
            if (tile) {
                $(this.element).trigger("tileover", tile);
            }
            lasttile = tile;
    
        }
        var point = intersects.length > 0 ? intersects[0].point : NULL_POINT;
        point.round();
        if (!lastpoint.equals(point)) {
            if (lastpoint !== NULL_POINT) {
                $(this.element).trigger("pointout", this.pointer.point);
            }
            if (point !== NULL_POINT) {
                $(this.element).trigger("pointover", point);
            }
            lastpoint = point;
        }
    };
//    highlighter(this.pointer.tile && this.pointer.tile.geometry);
})();



    
    // city.setRenderCallback(function(tile) {
    //     if (tile.mesh) {
    //         grid.removeChild(tile.mesh);
    //     }

    //     var u = tile.loc.u;
    //     var su = tile.adj.s ? tile.adj.s.loc.u : 0;
    //     var bu = tile.adj.b ? tile.adj.b.loc.u : 0;
    //     var wu = tile.adj.w ? tile.adj.w.loc.u : 0;

    //     var tri1 = new THREE.SHAPE();
        
        
    //     var off = getOffset(tile.loc);

    //     var u = tile.loc.u;
    //     var su = tile.adj.s ? tile.adj.s.loc.u : 0;
    //     var bu = tile.adj.b ? tile.adj.b.loc.u : 0;
    //     var wu = tile.adj.w ? tile.adj.w.loc.u : 0;
    //     graphics.moveTo(off.x + 0, off.y - TILE_HALF_HEIGHT - (u * TILE_DEPTH));
    //     graphics.lineTo(off.x + TILE_HALF_WIDTH, off.y + 0  - (su * TILE_DEPTH));
    //     graphics.lineTo(off.x + 0, off.y + TILE_HALF_HEIGHT  - (bu * TILE_DEPTH));
    //     graphics.lineTo(off.x - TILE_HALF_WIDTH, off.y + 0  - (wu * TILE_DEPTH));
    //     graphics.lineTo(off.x + 0, off.y - TILE_HALF_HEIGHT - (u * TILE_DEPTH));
    //     graphics.endFill();
        
    //     if (u !== su || u !== bu || u !== wu) {
    //         console.log(u, su, bu, wu);
    //         if (u === bu && Math.abs(su - wu) !== 2) {
    //             graphics.lineStyle(0.3, 0x000000);
    //             graphics.moveTo(off.x + 0, off.y - TILE_HALF_HEIGHT - (u * TILE_DEPTH));
    //             graphics.lineTo(off.x + 0, off.y + TILE_HALF_HEIGHT  - (bu * TILE_DEPTH));
    //         } else if (su === wu && Math.abs(u - bu) !== 2) {
    //             graphics.lineStyle(0.3, 0x000000);
    //             graphics.moveTo(off.x + TILE_HALF_WIDTH, off.y + 0  - (su * TILE_DEPTH));
    //             graphics.lineTo(off.x - TILE_HALF_WIDTH, off.y + 0  - (wu * TILE_DEPTH));
    //         } 
    //     }
        
    //     grid.addChild(graphics);
    // });
    
    // this.pointHighlight = new PIXI.Graphics();
    // this.pointHighlight.beginFill(0x000000);
    // this.pointHighlight.lineStyle(2, 0xFFFFFF);
    // this.pointHighlight.drawCircle(0,0,3);

// Renderer.prototype.pan = function(x, y) {
//     this.world.x += x;     
//     this.world.y += y;     
// };

// Renderer.prototype.clearPointHighlight = function() {
//     this.world.removeChild(this.pointHighlight);
// };

// Renderer.prototype.addPointHighlight = function() {
//     this.world.addChild(this.pointHighlight);
// };


// Renderer.prototype.getNearestPoint = function(x, y) {
//     x -= this.world.x;
//     y -= this.world.y;
//     var s = Math.floor((y / TILE_HALF_HEIGHT / 2) + (x / TILE_HALF_WIDTH / 2)) + 1;
//     var w = Math.floor((y / TILE_HALF_HEIGHT / 2) - (x / TILE_HALF_WIDTH / 2)) + 1;
//     if (s < 0) s = 0;
//     if (s > 10) s = 10;
//     if (w < 0) w = 0;
//     if (w > 10) w = 10;
//     return {s:s,w:w};
// };

// Renderer.prototype.highlightPoint = function(point) {
//     var u = this.city(point.s, point.w)[0].loc.u;
//     var x = (point.s - point.w) * TILE_HALF_WIDTH;
//     var y = ((point.s + point.w - 1) * TILE_HALF_HEIGHT) - (u * TILE_DEPTH) ;
//     this.pointHighlight.x = x;
//     this.pointHighlight.y = y;
//     // console.log(getLocation(x-this.world.x,y-this.world.y));
// }; 

// Renderer.prototype.previewTerraform = function(point, delta) {
//     var x = (point.s - point.w) * TILE_HALF_WIDTH;
//     var y = (point.s + point.w - 1) * TILE_HALF_HEIGHT;
//     delta = Math.floor(delta/TILE_DEPTH);
//     this.pointHighlight.x = x;
//     this.pointHighlight.y = y + (delta * TILE_DEPTH);
//     return delta;
// };


return WorldRenderer;

/* END MODULE */ }));

