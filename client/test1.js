window.addEventListener("load", function(){
	var renderer;
	var geometry;
	var material;
	var width = window.innerWidth;
	var height = window.innerHeight;
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( width, height );
	document.body.appendChild( renderer.domElement );

	var scene = new THREE.Scene();

var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(
    -10 * aspectRatio, 
   10 * aspectRatio,   
    10,    
    -10,   
    -2000,            // Near clipping plane
    1000 );           // Far clipping plane
    
// 	var camera = new THREE.PerspectiveCamera( 40, width / height, 1, 1000 );
	camera.position.x = 1;
	camera.position.y = 1;
	camera.position.z = 20;
	 camera.lookAt( new THREE.Vector3(0,0,0));
	
    // controls = new THREE.OrbitControls( camera );
    // controls.target.z = 200;
    
    // scene.add( camera );
	
	scene.add( new THREE.AmbientLight( 0x333333 ) );
	
	var light = new THREE.PointLight( 0xffffff, 1, 100 );
	light.position.x = 0;
	light.position.y = 10;
	scene.add( light );
	
	function createCube(index){
		var materials = [];
		var color = Math.random() * 0xffffff;
		for(var i = 0; i < 6; i++){
			//right, left, top, bottom, back, front
			materials.push(new THREE.MeshBasicMaterial( { color: color } ) );
		}
		
		var geometry = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1, materials);
		var material = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, wireframe: false, opacity: 0.5, vertexColors: THREE.FaceColors } );
		meshArray[index] = new THREE.Mesh( geometry, material);
		meshArray[index].position.x = 2 * (index % 10);
		meshArray[index].position.y = 2 * Math.floor(index * 0.1);
		scene.add( meshArray[index] );
	}
	
	var meshArray = [];
	for(var i = 0; i < 40; i++){
		createCube(i);
	}
	
	render = function() {
		renderer.render( scene, camera );
    };
    // controls.addEventListener( 'change', render );
    render();

	var projector = new THREE.Projector();

// 	renderer.domElement.addEventListener('mousemove', function(e){
// 		var vector = new THREE.Vector3( 
// 		    ( event.clientX / window.innerWidth ) * 2 - 1,
// 		    - ( event.clientY / window.innerHeight ) * 2 + 1,
// 		    0.5 );
// 		projector.unprojectVector( vector, camera );

        
// 		var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
// 		var intersects = raycaster.intersectObjects(meshArray);
// 		if(intersects.length > 0){
// 		    console.log(intersects);
// 		}
// 	});


	renderer.domElement.addEventListener('asdf', function(e){
		event.preventDefault();

		var vector = new THREE.Vector3( 
		    ( event.clientX / window.innerWidth ) * 2 - 1,
		    - ( event.clientY / window.innerHeight ) * 2 + 1,
		    0.5 );
		projector.unprojectVector( vector, camera );

        
		var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        // camera.lookAt( new THREE.Vector3(0,1,1));

	    
	    
		var intersects = raycaster.intersectObjects(meshArray);
	
		if(intersects.length > 0){
		    console.log(intersects);
		    intersects[0].face.color = 0;
// 			var easeOutBounce = function (t, b, c, d) {
// 				if ((t/=d) < (1/2.75)) {
// 					return c*(7.5625*t*t) + b;
// 				} else if (t < (2/2.75)) {
// 					return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
// 				} else if (t < (2.5/2.75)) {
// 					return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
// 				} else {
// 					return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
// 				}
// 			}
// 			var currentTime = 0;
// 			var startValue = intersects[ 0 ].object.position.z;
// 			var endValue = startValue - 4;
// 			var fps = 32;
// 			(function(){
// 				intersects[ 0 ].object.position.z = easeOutBounce(currentTime, startValue, endValue, fps);
// 				renderer.render( scene, camera );
// 				currentTime ++;
// 				if(currentTime <= fps){
// 					requestAnimationFrame( arguments.callee );
// 				}
// 			})();
		}
	}, false);
	
}, false);
