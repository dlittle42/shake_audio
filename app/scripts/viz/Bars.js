//GRAPHIC EQUALIZER BARS VIZ

var Bars = function() {

	//Viz Template
	var groupHolder;
	var BAR_COUNT = 16;
	var vertDistance;
	var fillFactor= 0.8;
	var planeWidth = 2000;
	var segments = 10;
	var colorArr = ['0xcddc39','0xe91e63','0xffc107','0x00bcd4','0xffeb3b','0x009688'];
	var colorNum = 0;
	var bartime = 0.1;
	var floatVal = 0;

	function init(){

		//EVENT HANDLERS
		events.on("update", update);
		events.on("onBeat", onBeat);
console.log(VizHandler.getVizHolder()+" is here");
		groupHolder = new THREE.Object3D();
		VizHandler.getVizHolder().add(groupHolder);
		groupHolder.position.z = 300;
		vertDistance = 1580 / BAR_COUNT;
	//	groupHolder.rotation.z = Math.PI/4;

		for ( var j = 0; j < BAR_COUNT; j ++ ) {

			var planeMat = new THREE.MeshBasicMaterial( {
				color: 0xEBFF33,
				//side:THREE.DoubleSide //more complex shapes
			});
			planeMat.color.setHSL(j/BAR_COUNT, 1.0, 0.5);
		
			var mesh = new THREE.Mesh( new THREE.PlaneGeometry( planeWidth, vertDistance,segments,segments), planeMat );
			mesh.position.y = vertDistance*j - (vertDistance*BAR_COUNT)/2;
			mesh.scale.y = (j+1)/BAR_COUNT*fillFactor;
			groupHolder.add( mesh );
		}
	}

	function displaceMesh(){

		//rejigger z disps
		var MAX_DISP =  Math.random() * 6000;
		var rnd = Math.random();
		for ( var j = 0; j < BAR_COUNT; j ++ ) {
			var mesh = groupHolder.children[j];
			//randomly warp mesh
			for(var i=0; i < mesh.geometry.vertices.length; i++) {
				var vertex = mesh.geometry.vertices[i];
				var disp = simplexNoise.noise(vertex.x / planeWidth*100 ,rnd) * MAX_DISP;
				vertex.z = disp;
			}
			mesh.geometry.verticesNeedUpdate = true;
		}
	}


	function update() {

		//slowly move up
		//groupHolder.position.y = AudioHandler.getBPMTime() * vertDistance;
		groupHolder.position.y += floatVal * vertDistance/3;// * bartime;

		//scale bars on levels
		for ( var j = 0; j < BAR_COUNT; j ++ ) {
		//	groupHolder.children[j].scale.y = AudioHandler.getLevelsData()[j] * AudioHandler.getLevelsData()[j] + 0.00001;
		}
	}

	function setBeat(num) {
		console.log("setBeat"+num);
		//slowly move up
		//groupHolder.position.y = AudioHandler.getBPMTime() * vertDistance;
		console.log('colorNum='+colorArr[colorNum]);
		floatVal = Math.random() - .5;
		bartime= Math.floor();
		groupHolder.position.y = 0;
		//scale bars on levels
		for ( var j = 0; j < BAR_COUNT; j ++ ) {
			groupHolder.children[j].scale.y = num* num + 0.00001;
			groupHolder.children[j].material.color.setHex(colorArr[colorNum]);
		}

		if (colorNum<4){
			colorNum++;
		}else{
			colorNum=0;
		}

		reform();
	}

	function onBeat(){
		var num = Math.floor(0 + Math.random() * (4 - 0 + 1));
	//	groupHolder.rotation.z = Math.PI/4 * num;

		//slight Y rotate
		var range = -Math.PI/4 + Math.random() * (Math.PI/4 - -Math.PI/4);
	//	groupHolder.rotation.y = range;


		//displaceMesh();

	}

	function reform(){
		var num = Math.floor(0 + Math.random() * (4 - 0 + 1));
		groupHolder.rotation.z = Math.PI/4 * num;

		//slight Y rotate
		var range = -Math.PI/4 + Math.random() * (Math.PI/4 - -Math.PI/4);
		groupHolder.rotation.y = range;



		displaceMesh();

	}

	function onBPMBeat(){
	}

	return {
		init:init,
		setBeat: setBeat
	};

}();