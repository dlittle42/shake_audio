//UberViz Main v0.1
//Handles HTML and wiring data
//Using Three v60


//GLOBAL
var events = new Events();
var simplexNoise = new SimplexNoise();

// add Fastclick
if ('addEventListener' in document) {
	    document.addEventListener('DOMContentLoaded', function() {
	        FastClick.attach(document.body);
	    }, false);
	}







//MAIN RMP
var UberVizMain = function() {

	//var ATUtil;

	var stats;
	var windowHalfX;
	var windowHalfY;

	function init() {


		if(!Detector.webgl){
			Detector.addGetWebGLMessage();
		}

		//INIT DOCUMENT
		document.onselectstart = function() {
			return false;
		};

		document.addEventListener('mousemove', onDocumentMouseMove, false);
		document.addEventListener('mousedown', onDocumentMouseDown, false);
		document.addEventListener('mouseup', onDocumentMouseUp, false);
	//	document.addEventListener('drop', onDocumentDrop, false);
		document.addEventListener('dragover', onDocumentDragOver, false);
		window.addEventListener('resize', onResize, false);
		window.addEventListener('keydown', onKeyDown, false);
		window.addEventListener('keyup', onKeyUp, false);

		//STATS
		stats = new Stats();
		$('#controls').append(stats.domElement);
		stats.domElement.id = "stats";

		//INIT HANDLERS
		AudioHandler.init();
		//ControlsHandler.init();
		VizHandler.init();
		FXHandler.init();

		onResize();

/*
		if (ControlsHandler.vizParams.showControls){
			$('#controls').show();
		}
*/
		update();

		//on android setup first touch to request fullscreen
		// var isMobile = !!('ontouchstart' in window);
		// if (isMobile){
		// 	$('body').click(function(){
		// 		$('body')[0].webkitRequestFullscreen();
		// 	});
		// }

	}

	function update() {
		requestAnimationFrame(update);
		stats.update();
		events.emit("update");
	}


	function onDocumentDragOver(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		return false;
	}

	//load dropped MP3
	function onDocumentDrop(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		//AudioHandler.onMP3Drop(evt);
	}

	function onKeyDown(event) {
		switch ( event.keyCode ) {
			case 32: /* space */
				//AudioHandler.onTap();
				VizHandler.setBeat(Math.random()+.1);
				break;
			case 81: /* q */
				//toggleControls();
				break;
		}
	}

	function onKeyUp(event) {
	}

	function onDocumentMouseDown(event) {
	}

	function onDocumentMouseUp(event) {
	}

	function onDocumentMouseMove(event) {
		// mouseX = (event.clientX - windowHalfX) / (windowHalfX);
		// mouseY = (event.clientY - windowHalfY) / (windowHalfY);
	}

	function onResize() {
		//windowHalfX = window.innerWidth / 2;
		//windowHalfY = window.innerHeight / 2;
		VizHandler.onResize();
	}

	function trace(text){
		$("#debugText").text(text);
	}

	function setBeat(num){
		VizHandler.setBeat(Math.random()+.1);
	}

/*
	function toggleControls(){
		ControlsHandler.vizParams.showControls = !ControlsHandler.vizParams.showControls;
		$('#controls').toggle();
		VizHandler.onResize();
	}
*/

	function reorient(e) {
	    var portrait = (window.orientation % 180 == 0);
	   // $("body > div").css("-webkit-transform", !portrait ? "rotate(0deg)" : "");
	}
	window.onorientationchange = reorient;
	window.setTimeout(reorient, 0);


	return {
		init:init,
		setBeat: setBeat,
		trace: trace
	};

}();

$(document).ready(function() {
	UberVizMain.init();

	// create our AudioContext and osc Nodes
	var audioContext, osc, gain, x, y;
	var ready=null;
	var myShakeEvent;
	var clap, kick, low, snare;

	console.log("loaded");
	$('#status').text('loaded');

//	$('.trigger').bind('touchstart', function(){

	$('.trigger').hide();

	$('#playBtn').on('click', function(){
		$('#playBtn').remove();
		activateTrigger();

	});

	function activateTrigger(){

		$('.trigger').show();
		$('body').bind('touchstart', function(){
		   // $(this).addClass('recording');
		     $('.trigger').addClass('recording');

		    if (ready != "shake" ){
		  		activateShakeSound();
			}else{
				 myShakeEvent.start();
			}
			$('#status').text('Touch Shake');
		


		}).bind('touchend', function(){
		    //$(this).removeClass('recording');
		    $('.trigger').removeClass('recording');
		  //  stopShakeSound();
		    myShakeEvent.stop();
		    $('#status').text('Touch Shake Stop');
		});
	}

/*

	$('body').bind('touchstart', function(){
	   // $(this).addClass('recording');
	     $('.trigger').addClass('recording');

	    if (ready != "shake" ){
	  		activateShakeSound();
		}else{
			 myShakeEvent.start();
		}
		$('#status').text('Touch Shake');
	


	}).bind('touchend', function(){
	    //$(this).removeClass('recording');
	    $('.trigger').removeClass('recording');
	  //  stopShakeSound();
	    myShakeEvent.stop();
	    $('#status').text('Touch Shake Stop');
	});
	*/
/*
	var drumMaster = new Howl({
	  urls: ['audio/drums01.mp3'],
	  sprite: {
	    clap: [0, 50],
	    kick: [50, 125],
	    low: [125, 160],
	    snare: [170, 190]
	  }
	});
*/

	var drumMaster = new Howl({
	  urls: ['audio/soundmix01.mp3'],
	  sprite: {
	    clap: [0, 300],
	    kick: [400, 300],
	    low: [1000, 300],
	    snare: [2600, 300]
	  }
	});


/*
	var drumMaster = new Howl({
	  urls: ['audio/tones-long.mp3'],
	  sprite: {
	    clap: [0, 300],
	    kick: [1000, 300],
	    low: [2000, 300],
	    snare: [3000, 300]
	  }
	});
	*/

	// shoot the laser!
	drumMaster.play('kick');

	$('#clapBtn').on('click', function(){
		//$("body").addClass('active');
		playClap();
	});
	$('#kickBtn').on('click', function(){
		playKick();

	});
	$('#lowBtn').on('click', function(){
		playLow();
	});
	$('#snareBtn').on('click', function(){
		playSnare();
	});

	$( "#shakeBtn" ).click(function() {
		if (ready == "shake" ){
	  		stopShakeSound();
		}else{
			activateShakeSound();
		}
	});

	function playClap(){
		drumMaster.play('clap');
		vizEffect();

	}
	function playKick(){
		drumMaster.play('kick');
		vizEffect();

	}
	function playLow(){
		drumMaster.play('low');
		vizEffect();

	}
	function playSnare(){
		drumMaster.play('snare');
		vizEffect();

	}
	function playLaser(){
		drumMaster.play('laser');
		vizEffect();

	}

	function vizEffect(){
		UberVizMain.setBeat(Math.random()+.1);
	}

	function activateShakeSound(){
		ready = 'shake';
		$('#shakeBtn').text('stop');
		initShakeSound();

	}

	function stopShakeSound(){
		ready = null;
		$('#shakeBtn').text('shake');
		myShakeEvent.stop();

	}


	if (window.matchMedia("(min-width: 500px)").matches) {
	/* the view port is at least 900 pixels wide */
	} else {
		//hide controls
		$('.container').hide();
	}

	function initShakeSound(){
		//create a new instance of shake.js.
	    myShakeEvent = new Shake({
	        threshold: 2,
	        timeout: 400
	    });

	    // start listening to device motion
	    myShakeEvent.start();
	    
	    

	    // register a shake event
	    window.addEventListener('shake', shakeEventDidOccur, false);

	    //shake event callback
	    function shakeEventDidOccur () {

	        //put your own code here etc.
	        shakeSound();

	        $("body").addClass('active');
	        //setTimeout(stopSound, 100);
	        
	    }
	}

	 function shakeSound(){
    	console.log('shaking');
    //	$('#status').text('shaking');
    	if (x>0){
    		playClap();
    	}else {
    		playKick();

    	}
    /*
    
    	if (x>0 && y>0){
    		playClap();
    	}else if (x>0 && y<0){
    		playKick();

    	}else if (x<0 && y>0){
    		playLow();
    	}else (x<0 && y<0)
    		playSnare();
    	}
   */
    	/*
    	osc = context.createOscillator();
		osc.connect(context.destination);
		osc.start(context.currentTime);
		*/

		vizEffect();
	//	$('#status').text('start');
		
    }

    function stopSound(){
    	//osc.stop();
  		//osc.disconnect();
  	//	$('#status').text('stop');
    }


	///////////////////////////////////////////////




	var motionMultiplier = 30;

	var center = {
	    x: $(window).width()/2,
	    y: $(window).height()/2
	}

	var compassRotate = function(_a, _b, _g) {
	    $('.ball').css({
	        transform: 'rotateZ(' + _a + 'deg)'
	    });
	}

	var moveBall = function(x, y, z) {
	    $('.ball').css({
	        top: Math.ceil(center.y + y * motionMultiplier),
	        left: Math.ceil(center.x + -1 * x * motionMultiplier)
	    });
	}

	compassRotate(90, 45, 45);
	moveBall(0, 0, 0);

	var initOrientation = function() {

	    //Find our div containers in the DOM
	    var dataContainerOrientation = document.getElementById('dataContainerOrientation');
	    var dataContainerMotion = document.getElementById('dataContainerMotion');

	    //Check for support for DeviceOrientation event
	    if (window.DeviceOrientationEvent) {
	        window.addEventListener('deviceorientation', function(event) {
	            var alpha = event.alpha;
	            var beta = event.beta;
	            var gamma = event.gamma;

	            if (alpha != null || beta != null || gamma != null) {
	                dataContainerOrientation.innerHTML = 'alpha: ' + alpha + '<br/>beta: ' + beta + '<br />gamma: ' + gamma;

	                compassRotate(alpha, beta, gamma);
	            }
	        }, false);
	    }

	    // Check for support for DeviceMotion events
	    if (window.DeviceMotionEvent) {
	        window.addEventListener('devicemotion', function(event) {
	            x= Math.floor(event.accelerationIncludingGravity.x);
	            y = event.accelerationIncludingGravity.y;
	            var z = event.accelerationIncludingGravity.z;
	            var r = event.rotationRate;
	            var html = 'Acceleration:<br />';
	            html += 'x: ' + x + '<br />y: ' + y + '<br/>z: ' + z + '<br />';
	            html += 'Rotation rate:<br />';
	            if (r != null) html += 'alpha: ' + r.alpha + '<br />beta: ' + r.beta + '<br/>gamma: ' + r.gamma + '<br />';
	            dataContainerMotion.innerHTML = html;

	            moveBall(x, y, z);
	            if (ready=='tilt') {
	            	var rand = (x*1000)/5;
	            	osc.detune.value = rand;
	            	 $('#status').html(rand);
	            	console.log('ready');
	            }
		   		


	            
	        });
	    }

	}

	initOrientation();



});




