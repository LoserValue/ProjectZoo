//cambiare versione della libreria three.min.js


window.addEventListener('load', init, false);
var Colors = {
    green:0x458248,
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    brownDark:0x23190f,
    pink:0xF5986E,
    yellow:0xf4ce93,
    blue:0x68c3c0,

};
var scene,
		camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
		renderer, container;
var mousePos={x:0, y:0};
var HEIGHT, WIDTH;

var Game = {speedGame: 0.002};

const manager = new THREE.LoadingManager();
manager.onStart = function()
{
	console.log("avvio");
}
manager.onLoad = function()
{
	console.log("Loading complete!");
}
manager.onProgress = function () {

	console.log("+1");

};


function createScene()
{
	HEIGHT = document.getElementById("scene").clientHeight;
	WIDTH = document.getElementById("scene").clientWidth;

    scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);
    // Set the position of the camera
	camera.position.x = 0;
	camera.position.z = 200;
	camera.position.y = 100;

	// Create the renderer
	renderer = new THREE.WebGLRenderer({ 
		// Allow transparency to show the gradient background
		alpha: true, 
		// Activate the anti-aliasing;
		antialias: true 
	});
    renderer.setSize(WIDTH, HEIGHT);
	
	// Enable shadow rendering
	renderer.shadowMap.enabled = true;
	renderer.domElement.id = 'canvas';
	// Add the DOM element of the renderer
	container = document.getElementById('scene');
	container.appendChild(renderer.domElement);
	
	// Listen to the screen: if the user resizes it
	// we have to update the camera and the renderer size
	window.addEventListener('resize', handleWindowResize, false);
}
function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = document.getElementById("scene").clientHeight;
	WIDTH = document.getElementById("scene").clientWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}
var hemisphereLight, shadowLight;


// now handle the mousemove event
function handleMouseMove(event) {

	// here we are converting the mouse position value received 
	// to a normalized value varying between -1 and 1;
	// this is the formula for the horizontal axis:
	
	var tx = -1 + (event.clientX / WIDTH)*2;

	// for the vertical axis, we need to inverse the formula 
	// because the 2D y-axis goes the opposite direction of the 3D y-axis
	
	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};

}
function createLights() {
	// A hemisphere light is a gradient colored light; 
	// the first parameter is the sky color, the second parameter is the ground color, 
	// the third parameter is the intensity of the light
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
	
	// A directional light shines from a specific direction. 
	// It acts like the sun, that means that all the rays produced are parallel. 
	shadowLight = new THREE.DirectionalLight(0xffffff, .9);

	// Set the direction of the light  
	shadowLight.position.set(150, 350, 350);
	
	// Allow shadow casting 
	shadowLight.castShadow = true;

	// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// define the resolution of the shadow; the higher the better, 
	// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;
	
	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);  
	scene.add(shadowLight);
}
// Instantiate the sea and add it to the scene:

var Ground = function(){
    var geom = new THREE.CylinderGeometry(600,600,800,40,10);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    geom.mergeVertices();
    var l = geom.vertices.length;
    this.ground = [];
    for (var i=0;i<l;i++){
        //v.y = Math.random()*30;
        var v = geom.vertices[i];
        this.ground.push({y:v.y,
                        x:v.x,
                        z:v.z,
                        ang:Math.random()*Math.PI*2,
                        amp:5 + Math.random()*15,
                        speed:0.016 + Math.random()*0.032
        });
    }
	//geom = mergeVertices(geom);
	// create the material 
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.green,
        transparent:true,
        opacity:1,
        shading:THREE.FlatShading,
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;

}
var Forest = function(){

	this.mesh = new THREE.Object3D();

	// Number of Trees
	this.nTrees = 150;

	// Space the consistenly
	var stepAngle = Math.PI*2 / this.nTrees;

	// Create the Trees

	for(var i=0; i<this.nTrees; i++){
	
		var t = new Tree();

		//set rotation and position using trigonometry
		var a = stepAngle*i;
		// this is the distance between the center of the axis and the tree itself
		var h = 605;
		t.mesh.position.y = Math.sin(a)*h;
		t.mesh.position.x = Math.cos(a)*h;		

		// rotate the tree according to its position
		t.mesh.rotation.z = a + (Math.PI/2)*3;

		//Andreas Trigo funtime
		//t.mesh.rotation.z = Math.atan2(t.mesh.position.y, t.mesh.position.x)-Math.PI/2;

		// random depth for the tree on the z-axis
		t.mesh.position.z = 0-Math.random()*340;

		// random scale for each tree
		var s = .5+Math.random()*.75;
		t.mesh.scale.set(s,s,s);

		this.mesh.add(t.mesh);
	}

	// Number of Trees
	this.nFlowers = 350;

	var stepAngle = Math.PI*2 / this.nFlowers;


	for(var i=0; i<this.nFlowers; i++){	

		var f = new Flower();
		var a = stepAngle*i;

		var h = 605;
		f.mesh.position.y = Math.sin(a)*h;
		f.mesh.position.x = Math.cos(a)*h;		

		f.mesh.rotation.z = a + (Math.PI/2)*3;

		f.mesh.position.z = 0-Math.random()*340;

		var s = .1+Math.random()*.3;
		f.mesh.scale.set(s,s,s);

		this.mesh.add(f.mesh);
	}

}
var Tree = function () {

	this.mesh = new THREE.Object3D();

	var matTreeLeaves = new THREE.MeshPhongMaterial( { color:Colors.green, shading:THREE.FlatShading});

	var geonTreeBase = new THREE.BoxGeometry( 10,20,10 );
	var matTreeBase = new THREE.MeshBasicMaterial( { color:Colors.brown});
	var treeBase = new THREE.Mesh(geonTreeBase,matTreeBase);
	treeBase.castShadow = true;
	treeBase.receiveShadow = true;
	this.mesh.add(treeBase);

	var geomTreeLeaves1 = new THREE.CylinderGeometry(1, 12*3, 12*3, 4 );
	var treeLeaves1 = new THREE.Mesh(geomTreeLeaves1,matTreeLeaves);
	treeLeaves1.castShadow = true;
	treeLeaves1.receiveShadow = true;
	treeLeaves1.position.y = 20
	this.mesh.add(treeLeaves1);

	var geomTreeLeaves2 = new THREE.CylinderGeometry( 1, 9*3, 9*3, 4 );
	var treeLeaves2 = new THREE.Mesh(geomTreeLeaves2,matTreeLeaves);
	treeLeaves2.castShadow = true;
	treeLeaves2.position.y = 40;
	treeLeaves2.receiveShadow = true;
	this.mesh.add(treeLeaves2);

	var geomTreeLeaves3 = new THREE.CylinderGeometry( 1, 6*3, 6*3, 4);
	var treeLeaves3 = new THREE.Mesh(geomTreeLeaves3,matTreeLeaves);
	treeLeaves3.castShadow = true;
	treeLeaves3.position.y = 55;
	treeLeaves3.receiveShadow = true;
	this.mesh.add(treeLeaves3);

}
var petalColors = [Colors.red, Colors.yellow, Colors.blue];

var Flower = function () {

	this.mesh = new THREE.Object3D();

	var geomStem = new THREE.BoxGeometry( 5,50,5,1,1,1 );
	var matStem = new THREE.MeshPhongMaterial( { color:Colors.green, shading:THREE.FlatShading});
	var stem = new THREE.Mesh(geomStem,matStem);
	stem.castShadow = false;
	stem.receiveShadow = true;
	this.mesh.add(stem);


	var geomPetalCore = new THREE.BoxGeometry(10,10,10,1,1,1);
	var matPetalCore = new THREE.MeshPhongMaterial({color:Colors.yellow, shading:THREE.FlatShading});
	var petalCore = new THREE.Mesh(geomPetalCore, matPetalCore);
	petalCore.castShadow = false;
	petalCore.receiveShadow = true;

	var petalColor = petalColors [Math.floor(Math.random()*3)];

	var geomPetal = new THREE.BoxGeometry( 15,20,5,1,1,1 );
	var matPetal = new THREE.MeshBasicMaterial( { color:petalColor});
	geomPetal.vertices[5].y-=4;
	geomPetal.vertices[4].y-=4;
	geomPetal.vertices[7].y+=4;
	geomPetal.vertices[6].y+=4;
	geomPetal.translate(12.5,0,3);
		var petals = [];
		for(var i=0; i<4; i++){	

			petals[i]=new THREE.Mesh(geomPetal,matPetal);
			petals[i].rotation.z = i*Math.PI/2;
			petals[i].castShadow = true;
			petals[i].receiveShadow = true;
		}
	petalCore.add(petals[0],petals[1],petals[2],petals[3]);
	petalCore.position.y = 25;
	petalCore.position.z = 3;
	this.mesh.add(petalCore);

}
var Cloud = function(){
	// Create an empty container that will hold the different parts of the cloud
	this.mesh = new THREE.Object3D();
	
	// create a cube geometry;
	// this shape will be duplicated to create the cloud
	var geom = new THREE.BoxGeometry(20,20,20);
	
	// create a material; a simple white material will do the trick
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.white,  
	});
	
	// duplicate the geometry a random number of times
	var nBlocs = 3+Math.floor(Math.random()*3);
	for (var i=0; i<nBlocs; i++ ){
		
		// create the mesh by cloning the geometry
		var m = new THREE.Mesh(geom, mat); 
		
		// set the position and the rotation of each cube randomly
		m.position.x = i*15;
		m.position.y = Math.random()*10;
		m.position.z = Math.random()*10;
		m.rotation.z = Math.random()*Math.PI*2;
		m.rotation.y = Math.random()*Math.PI*2;
		
		// set the size of the cube randomly
		var s = .1 + Math.random()*.9;
		m.scale.set(s,s,s);
		
		// allow each cube to cast and to receive shadows
		m.castShadow = true;
		m.receiveShadow = true;
		
		// add the cube to the container we first created
		this.mesh.add(m);
	} 
}
// Define a Sky Object
var Sky = function(){
	// Create an empty container
	this.mesh = new THREE.Object3D();
	
	// choose a number of clouds to be scattered in the sky
	this.nClouds = 20;
	
	// To distribute the clouds consistently,
	// we need to place them according to a uniform angle
	var stepAngle = Math.PI*2 / this.nClouds;
	
	// create the clouds
	for(var i=0; i<this.nClouds; i++){
		var c = new Cloud();
	 
		// set the rotation and the position of each cloud;
		// for that we use a bit of trigonometry
		var a = stepAngle*i; // this is the final angle of the cloud
		var h = 750 + Math.random()*200; // this is the distance between the center of the axis and the cloud itself

		// Trigonometry!!! I hope you remember what you've learned in Math :)
		// in case you don't: 
		// we are simply converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
		c.mesh.position.y = Math.sin(a)*h;
		c.mesh.position.x = Math.cos(a)*h;

		// rotate the cloud according to its position
		c.mesh.rotation.z = a + Math.PI/2;

		// for a better result, we position the clouds 
		// at random depths inside of the scene
		c.mesh.position.z = -400-Math.random()*400;
		
		// we also set a random scale for each cloud
		var s = 1+Math.random()*2;
		c.mesh.scale.set(s,s,s);

		// do not forget to add the mesh of each cloud in the scene
		this.mesh.add(c.mesh);  
	}  
}

// Now we instantiate the sky and push its center a bit
// towards the bottom of the screen
var ground;
var sky;
var forest;

function createGround(){
	ground = new Ground();
	// push it a little bit at the bottom of the scene
	ground.mesh.position.y = -600;

	// add the mesh of the sea to the scene
	scene.add(ground.mesh);
}
function createForest(){
    forest = new Forest();
    forest.mesh.position.y = -600;
    scene.add(forest.mesh);
  }
function createSky(){
	sky = new Sky();
	sky.mesh.position.y = -600;
	scene.add(sky.mesh);
}
Ground.prototype.moveGround = function (){
    var verts = this.mesh.geometry.vertices;
    var l = verts.length;
    for (var i=0; i<l; i++){
      var v = verts[i];
      var vprops = this.ground[i];
      v.x =  vprops.x + Math.cos(vprops.ang)*vprops.amp;
      v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;
      vprops.ang += vprops.speed;
    }
    //this.mesh.geometry.verticesNeedUpdate=true;
    ground.mesh.rotation.z += Game.speedGame;
    forest.mesh.rotation.z += Game.speedGame;
}

function init(){
    createScene();
    createLights();
    createGround();
    createForest();
    createSky();
    document.addEventListener('mousemove', handleMouseMove, false);

    loop();
}

function loop(){
	// Rotate the propeller, the sea and the sky
	//airplane.propeller.rotation.x += 0.3;
    sky.mesh.rotation.z += Game.speedGame * 2;
	//sky.mesh.rotation.z += .01;
    ground.moveGround();
	// render the scene
	renderer.render(scene, camera);
//console.log("Number of Triangles :", renderer.info.render.vertices);

	// call the loop function again
	requestAnimationFrame(loop);
}