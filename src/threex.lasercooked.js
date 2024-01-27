import * as THREE from 'three'
import { useRapier, RigidBody } from '@react-three/rapier'
var THREEx = THREEx || {}

var LaserCooked	= function(laserBeam,playerObject3D){
	// for update loop
	var updateFcts	= []

	this.update	= function(){
		updateFcts.forEach(function(updateFct){
			updateFct()	
		})
	}
	

	var object3d = laserBeam.object3d
	console.log("position", object3d.position)		
	var player3d	= new THREE.Object3D()
	const icosahedronGeometry = new THREE.IcosahedronGeometry(0.3, 1);
    const icosahedronMaterial = new THREE.MeshStandardMaterial({ color: 'mediumpurple' });
    const icosahedronMesh = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);

    // Set the position using the provided object
	if(playerObject3D){
		console.log("PlayerPositon", playerObject3D.current.translation().y)
	}

   	console.log("icosa1",   icosahedronMesh)
    // Add the icosahedronMesh to the Object3D container
    player3d.add(icosahedronMesh);	

	// build THREE.Sprite for impact
	var textureUrl	= './blue_particle.jpeg';
	var texture	= new THREE.TextureLoader().load(textureUrl)	
	var material	= new THREE.SpriteMaterial({
		map		: texture,
		blending	: THREE.AdditiveBlending,
	})
	var sprite	= new THREE.Sprite(material)
	sprite.scale.x = 0.5
	sprite.scale.y = 2;

	sprite.position.x	= 1-0.01
	object3d.add(sprite)

	// add a point light
	var light	= new THREE.PointLight( 0x4444ff);
	light.intensity	= 0.5
	light.distance	= 4
	light.position.x= -0.05
	this.light	= light
	sprite.add(light)

	// to exports last intersects
	this.lastIntersects	= []

	var raycaster	= new THREE.Raycaster()
	// TODO assume object3d.position are worldPosition. works IFF attached to scene
	raycaster.ray.origin.copy(object3d.position)

	updateFcts.push(function(){
		
		// get laserBeam matrixWorld
		object3d.updateMatrixWorld();
		var matrixWorld	= object3d.matrixWorld.clone()

		// set the origin
		let direction = new THREE.Vector3(1,0,0);
		const endPoint = direction.clone().multiplyScalar(10);

		// Create the ray represented as a LineSegments
		const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,0.3,0.2), endPoint]);
		const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
		const newRay = new THREE.LineSegments(geometry, material);
		//raycaster.ray.origin.setFromMatrixPosition(matrixWorld)
		// keep only the roation
		matrixWorld.setPosition(new THREE.Vector3(-2,0.3,0.2))		
		// set the direction
		//raycaster.setRay(newRay)
		raycaster.ray.direction.set(1,0,0)
			.applyMatrix4( matrixWorld )
			.normalize()
		//console.log("ICOpOS",icosahedronMesh.position)
		if( playerObject3D){
			icosahedronMesh.position.set(playerObject3D.current.translation().x, playerObject3D.current.translation().y, playerObject3D.current.translation().z);
		}		
		//var intersects		= raycaster.intersectObjects( scene.children );
		//console.log(raycaster)
		var intersects	= raycaster.intersectObject(icosahedronMesh);
		
		if( intersects.length > 0 ){
			console.log("INTERSECT")
			var position	= intersects[0].point
			var distance	= position.distanceTo(raycaster.ray.origin)
			object3d.scale.x	= distance
		}else{
	
			object3d.scale.x	= 3			
		}
		// backup last intersects
		this.lastIntersects	= intersects
	}.bind(this));
}

LaserCooked.baseURL	= '/'

export { LaserCooked }
