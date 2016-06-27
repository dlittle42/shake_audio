if ('addEventListener' in document) {
	    document.addEventListener('DOMContentLoaded', function() {
	        FastClick.attach(document.body);
	    }, false);
	}







$(document).ready(function(){


	

	// create our AudioContext and osc Nodes
	var audioContext, osc, gain, x;
	var ready=null;
	var myShakeEvent;
	var clap, kick, low, snare;

	console.log("loaded");

	initSound();
/*
	if('webkitAudioContext' in window) {
	    var context = new webkitAudioContext();
	}else{
		var context = new AudioContext();
	}

	
	var osc = context.createosc();

	osc.connect(context.destination);
	osc.start(context.currentTime);
	osc.stop(context.currentTime + 1);
*/

	$( "#tiltBtn" ).click(function() {
		if (ready == "tilt" ){
	  		stopTiltSound();
		}else{
			activateTiltSound();
		}
	});

	$( "#shakeBtn" ).click(function() {
		if (ready == "shake" ){
	  		stopShakeSound();
		}else{
			activateShakeSound();
		}
	});

	$( "#clapBtn" ).click(function() {
		clap.currentTime = 0;
		clap.play();
	});
	$( "#kickBtn" ).click(function() {
		kick.currentTime = 0;
		kick.play();
	});
	$( "#lowBtn" ).click(function() {
		low.currentTime = 0;
		low.play();
	});
	$( "#snareBtn" ).click(function() {
		snare.currentTime = 0;
		snare.play();
	});


	function activateTiltSound(){

		ready = 'tilt';
		$('#tiltBtn').text('stop');
		window.addEventListener('mousedown', startSound);
		window.addEventListener('mouseup', stopSound);
		startSound();

	}

	function stopTiltSound(){
		ready = null;
		$('#tiltBtn').text('tilt');
		stopSound();
		window.removeEventListener('mousedown', startSound);
		window.removeEventListener('mouseup', stopSound);

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

	function initShakeSound(){
		//create a new instance of shake.js.
	    myShakeEvent = new Shake({
	        threshold: 15
	    });

	    // start listening to device motion
	    myShakeEvent.start();
	    

	    // register a shake event
	    window.addEventListener('shake', shakeEventDidOccur, false);

	    //shake event callback
	    function shakeEventDidOccur () {

	        //put your own code here etc.
	        shakeSound();
	        setTimeout(stopSound, 100);
	        
	    }
	}

/////


	function initSound() {
	    audioContext = new(window.AudioContext || window.webkitAudioContext)();
	    gain = audioContext.createGain();
	    gain.gain.value = 1;
	    osc = audioContext.createOscillator();
	    osc.type = 'sine';
	    osc.frequency.value = 440;
	    osc.detune.value = 0;
	    osc.connect(gain);
	    
	    $('#status').html('init');


	   clap = new Audio('audio/clap.wav');
	   kick = new Audio('audio/kick.wav');
	   low = new Audio('audio/low.wav');
	   snare = new Audio('audio/snare.wav');
	
	}

	//initSound();


//////


/*

    //create a new instance of shake.js.
    myShakeEvent = new Shake({
        threshold: 15
    });

    // start listening to device motion
    myShakeEvent.start();

    // register a shake event
    window.addEventListener('shake', shakeEventDidOccur, false);

    //shake event callback
    function shakeEventDidOccur () {

        //put your own code here etc.
        startSound();
        setTimeout(stopSound, 100);
        
    }
*/

    function startSound(){
    	console.log('test');
    	osc.start(0);
	   // gain.connect(audioContext.destination);
    
    	/*osc = context.createOscillator();
		osc.connect(context.destination);
		osc.start(context.currentTime);
		*/
		$('#status').html('start');
		
    }

    function shakeSound(){
    	console.log('test');
    	osc = context.createOscillator();
		osc.connect(context.destination);
		osc.start(context.currentTime);
		
		$('#status').html('start');
		
    }

    function stopSound(){
    	osc.stop();
  		//osc.disconnect();
  		$('#status').html('stop');
    }


   /* window.addEventListener('mousedown', function () {
	  startSound();
	});
	*/
	/*
	 window.addEventListener('touchstart', function () {
	 	initSound();
	 	ready=true;
	  startSound();
	  // start everything by connecting to destination

   

	});
	*/
	 /*
	window.addEventListener('mouseup', function () {
	  stopSound();
	});
	*/

	/*
	window.addEventListener('touchend', function () {
	 // stopSound();
	});

*/




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
	            var y = Math.floor(event.accelerationIncludingGravity.y);
	            var z = Math.floor(event.accelerationIncludingGravity.z);
	            var r = Math.floor(event.rotationRate);
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
/*
	    function draw() {
		    osc.detune.value = x;
		    $('#status').html(x);
		     
		    // call the draw function again!
		    requestAnimationFrame(draw);
		}

	draw();
	*/
	}

	initOrientation();





});




