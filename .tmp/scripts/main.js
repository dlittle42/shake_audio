//UberViz Main v0.1
//Handles HTML and wiring data
//Using Three v60

'use strict';

function Events(e) {
	var t = {},
	    n,
	    r,
	    i,
	    s = Array;e = e || this;e.on = function (e, n, r) {
		t[e] || (t[e] = []);t[e].push({ f: n, c: r });
	};e.off = function (e, i) {
		r = t[e] || [];n = r.length = i ? r.length : 0;while (~ --n < 0) i == r[n].f && r.splice(n, 1);
	};e.emit = function () {
		i = s.apply([], arguments);r = t[i.shift()] || [];i = i[0] instanceof s && i[0] || i;n = r.length;while (~ --n < 0) r[n].f.apply(r[n].c, i);
	};
}

// Ported from Stefan Gustavson's java implementation
// http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// Read Stefan's excellent paper for details on how this code works.
//
// Sean McCullough banksean@gmail.com
//
// Added 4D noise
// Joshua Koo zz85nus@gmail.com

/**
 * You can pass in a random number generator object if you like.
 * It is assumed to have a random() method.
 */
var SimplexNoise = function SimplexNoise(r) {
	if (r == undefined) r = Math;
	this.grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];

	this.grad4 = [[0, 1, 1, 1], [0, 1, 1, -1], [0, 1, -1, 1], [0, 1, -1, -1], [0, -1, 1, 1], [0, -1, 1, -1], [0, -1, -1, 1], [0, -1, -1, -1], [1, 0, 1, 1], [1, 0, 1, -1], [1, 0, -1, 1], [1, 0, -1, -1], [-1, 0, 1, 1], [-1, 0, 1, -1], [-1, 0, -1, 1], [-1, 0, -1, -1], [1, 1, 0, 1], [1, 1, 0, -1], [1, -1, 0, 1], [1, -1, 0, -1], [-1, 1, 0, 1], [-1, 1, 0, -1], [-1, -1, 0, 1], [-1, -1, 0, -1], [1, 1, 1, 0], [1, 1, -1, 0], [1, -1, 1, 0], [1, -1, -1, 0], [-1, 1, 1, 0], [-1, 1, -1, 0], [-1, -1, 1, 0], [-1, -1, -1, 0]];

	this.p = [];
	for (var i = 0; i < 256; i++) {
		this.p[i] = Math.floor(r.random() * 256);
	}
	// To remove the need for index wrapping, double the permutation table length
	this.perm = [];
	for (var i = 0; i < 512; i++) {
		this.perm[i] = this.p[i & 255];
	}

	// A lookup table to traverse the simplex around a given point in 4D.
	// Details can be found where this table is used, in the 4D noise method.
	this.simplex = [[0, 1, 2, 3], [0, 1, 3, 2], [0, 0, 0, 0], [0, 2, 3, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 3, 0], [0, 2, 1, 3], [0, 0, 0, 0], [0, 3, 1, 2], [0, 3, 2, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 3, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 0, 3], [0, 0, 0, 0], [1, 3, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 3, 0, 1], [2, 3, 1, 0], [1, 0, 2, 3], [1, 0, 3, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 3, 1], [0, 0, 0, 0], [2, 1, 3, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 1, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 0, 1, 2], [3, 0, 2, 1], [0, 0, 0, 0], [3, 1, 2, 0], [2, 1, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 1, 0, 2], [0, 0, 0, 0], [3, 2, 0, 1], [3, 2, 1, 0]];
};

SimplexNoise.prototype.dot = function (g, x, y) {
	return g[0] * x + g[1] * y;
};

SimplexNoise.prototype.dot3 = function (g, x, y, z) {
	return g[0] * x + g[1] * y + g[2] * z;
};

SimplexNoise.prototype.dot4 = function (g, x, y, z, w) {
	return g[0] * x + g[1] * y + g[2] * z + g[3] * w;
};

SimplexNoise.prototype.noise = function (xin, yin) {
	var n0, n1, n2; // Noise contributions from the three corners
	// Skew the input space to determine which simplex cell we're in
	var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
	var s = (xin + yin) * F2; // Hairy factor for 2D
	var i = Math.floor(xin + s);
	var j = Math.floor(yin + s);
	var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
	var t = (i + j) * G2;
	var X0 = i - t; // Unskew the cell origin back to (x,y) space
	var Y0 = j - t;
	var x0 = xin - X0; // The x,y distances from the cell origin
	var y0 = yin - Y0;
	// For the 2D case, the simplex shape is an equilateral triangle.
	// Determine which simplex we are in.
	var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
	if (x0 > y0) {
		i1 = 1;j1 = 0;
	} // lower triangle, XY order: (0,0)->(1,0)->(1,1)
	else {
			i1 = 0;j1 = 1;
		} // upper triangle, YX order: (0,0)->(0,1)->(1,1)
	// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
	// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
	// c = (3-sqrt(3))/6
	var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
	var y1 = y0 - j1 + G2;
	var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
	var y2 = y0 - 1.0 + 2.0 * G2;
	// Work out the hashed gradient indices of the three simplex corners
	var ii = i & 255;
	var jj = j & 255;
	var gi0 = this.perm[ii + this.perm[jj]] % 12;
	var gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
	var gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
	// Calculate the contribution from the three corners
	var t0 = 0.5 - x0 * x0 - y0 * y0;
	if (t0 < 0) n0 = 0.0;else {
		t0 *= t0;
		n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0); // (x,y) of grad3 used for 2D gradient
	}
	var t1 = 0.5 - x1 * x1 - y1 * y1;
	if (t1 < 0) n1 = 0.0;else {
		t1 *= t1;
		n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
	}
	var t2 = 0.5 - x2 * x2 - y2 * y2;
	if (t2 < 0) n2 = 0.0;else {
		t2 *= t2;
		n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
	}
	// Add contributions from each corner to get the final noise value.
	// The result is scaled to return values in the interval [-1,1].
	return 70.0 * (n0 + n1 + n2);
};

// 3D simplex noise
SimplexNoise.prototype.noise3d = function (xin, yin, zin) {
	var n0, n1, n2, n3; // Noise contributions from the four corners
	// Skew the input space to determine which simplex cell we're in
	var F3 = 1.0 / 3.0;
	var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
	var i = Math.floor(xin + s);
	var j = Math.floor(yin + s);
	var k = Math.floor(zin + s);
	var G3 = 1.0 / 6.0; // Very nice and simple unskew factor, too
	var t = (i + j + k) * G3;
	var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
	var Y0 = j - t;
	var Z0 = k - t;
	var x0 = xin - X0; // The x,y,z distances from the cell origin
	var y0 = yin - Y0;
	var z0 = zin - Z0;
	// For the 3D case, the simplex shape is a slightly irregular tetrahedron.
	// Determine which simplex we are in.
	var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
	var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
	if (x0 >= y0) {
		if (y0 >= z0) {
			i1 = 1;j1 = 0;k1 = 0;i2 = 1;j2 = 1;k2 = 0;
		} // X Y Z order
		else if (x0 >= z0) {
				i1 = 1;j1 = 0;k1 = 0;i2 = 1;j2 = 0;k2 = 1;
			} // X Z Y order
			else {
					i1 = 0;j1 = 0;k1 = 1;i2 = 1;j2 = 0;k2 = 1;
				} // Z X Y order
	} else {
			// x0<y0
			if (y0 < z0) {
				i1 = 0;j1 = 0;k1 = 1;i2 = 0;j2 = 1;k2 = 1;
			} // Z Y X order
			else if (x0 < z0) {
					i1 = 0;j1 = 1;k1 = 0;i2 = 0;j2 = 1;k2 = 1;
				} // Y Z X order
				else {
						i1 = 0;j1 = 1;k1 = 0;i2 = 1;j2 = 1;k2 = 0;
					} // Y X Z order
		}
	// A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
	// a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
	// a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
	// c = 1/6.
	var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
	var y1 = y0 - j1 + G3;
	var z1 = z0 - k1 + G3;
	var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
	var y2 = y0 - j2 + 2.0 * G3;
	var z2 = z0 - k2 + 2.0 * G3;
	var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
	var y3 = y0 - 1.0 + 3.0 * G3;
	var z3 = z0 - 1.0 + 3.0 * G3;
	// Work out the hashed gradient indices of the four simplex corners
	var ii = i & 255;
	var jj = j & 255;
	var kk = k & 255;
	var gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12;
	var gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12;
	var gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12;
	var gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12;
	// Calculate the contribution from the four corners
	var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
	if (t0 < 0) n0 = 0.0;else {
		t0 *= t0;
		n0 = t0 * t0 * this.dot3(this.grad3[gi0], x0, y0, z0);
	}
	var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
	if (t1 < 0) n1 = 0.0;else {
		t1 *= t1;
		n1 = t1 * t1 * this.dot3(this.grad3[gi1], x1, y1, z1);
	}
	var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
	if (t2 < 0) n2 = 0.0;else {
		t2 *= t2;
		n2 = t2 * t2 * this.dot3(this.grad3[gi2], x2, y2, z2);
	}
	var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
	if (t3 < 0) n3 = 0.0;else {
		t3 *= t3;
		n3 = t3 * t3 * this.dot3(this.grad3[gi3], x3, y3, z3);
	}
	// Add contributions from each corner to get the final noise value.
	// The result is scaled to stay just inside [-1,1]
	return 32.0 * (n0 + n1 + n2 + n3);
};

// 4D simplex noise
SimplexNoise.prototype.noise4d = function (x, y, z, w) {
	// For faster and easier lookups
	var grad4 = this.grad4;
	var simplex = this.simplex;
	var perm = this.perm;

	// The skewing and unskewing factors are hairy again for the 4D case
	var F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
	var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;
	var n0, n1, n2, n3, n4; // Noise contributions from the five corners
	// Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
	var s = (x + y + z + w) * F4; // Factor for 4D skewing
	var i = Math.floor(x + s);
	var j = Math.floor(y + s);
	var k = Math.floor(z + s);
	var l = Math.floor(w + s);
	var t = (i + j + k + l) * G4; // Factor for 4D unskewing
	var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
	var Y0 = j - t;
	var Z0 = k - t;
	var W0 = l - t;
	var x0 = x - X0; // The x,y,z,w distances from the cell origin
	var y0 = y - Y0;
	var z0 = z - Z0;
	var w0 = w - W0;

	// For the 4D case, the simplex is a 4D shape I won't even try to describe.
	// To find out which of the 24 possible simplices we're in, we need to
	// determine the magnitude ordering of x0, y0, z0 and w0.
	// The method below is a good way of finding the ordering of x,y,z,w and
	// then find the correct traversal order for the simplex we’re in.
	// First, six pair-wise comparisons are performed between each possible pair
	// of the four coordinates, and the results are used to add up binary bits
	// for an integer index.
	var c1 = x0 > y0 ? 32 : 0;
	var c2 = x0 > z0 ? 16 : 0;
	var c3 = y0 > z0 ? 8 : 0;
	var c4 = x0 > w0 ? 4 : 0;
	var c5 = y0 > w0 ? 2 : 0;
	var c6 = z0 > w0 ? 1 : 0;
	var c = c1 + c2 + c3 + c4 + c5 + c6;
	var i1, j1, k1, l1; // The integer offsets for the second simplex corner
	var i2, j2, k2, l2; // The integer offsets for the third simplex corner
	var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
	// simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
	// Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
	// impossible. Only the 24 indices which have non-zero entries make any sense.
	// We use a thresholding to set the coordinates in turn from the largest magnitude.
	// The number 3 in the "simplex" array is at the position of the largest coordinate.
	i1 = simplex[c][0] >= 3 ? 1 : 0;
	j1 = simplex[c][1] >= 3 ? 1 : 0;
	k1 = simplex[c][2] >= 3 ? 1 : 0;
	l1 = simplex[c][3] >= 3 ? 1 : 0;
	// The number 2 in the "simplex" array is at the second largest coordinate.
	i2 = simplex[c][0] >= 2 ? 1 : 0;
	j2 = simplex[c][1] >= 2 ? 1 : 0;k2 = simplex[c][2] >= 2 ? 1 : 0;
	l2 = simplex[c][3] >= 2 ? 1 : 0;
	// The number 1 in the "simplex" array is at the second smallest coordinate.
	i3 = simplex[c][0] >= 1 ? 1 : 0;
	j3 = simplex[c][1] >= 1 ? 1 : 0;
	k3 = simplex[c][2] >= 1 ? 1 : 0;
	l3 = simplex[c][3] >= 1 ? 1 : 0;
	// The fifth corner has all coordinate offsets = 1, so no need to look that up.
	var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
	var y1 = y0 - j1 + G4;
	var z1 = z0 - k1 + G4;
	var w1 = w0 - l1 + G4;
	var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
	var y2 = y0 - j2 + 2.0 * G4;
	var z2 = z0 - k2 + 2.0 * G4;
	var w2 = w0 - l2 + 2.0 * G4;
	var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
	var y3 = y0 - j3 + 3.0 * G4;
	var z3 = z0 - k3 + 3.0 * G4;
	var w3 = w0 - l3 + 3.0 * G4;
	var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
	var y4 = y0 - 1.0 + 4.0 * G4;
	var z4 = z0 - 1.0 + 4.0 * G4;
	var w4 = w0 - 1.0 + 4.0 * G4;
	// Work out the hashed gradient indices of the five simplex corners
	var ii = i & 255;
	var jj = j & 255;
	var kk = k & 255;
	var ll = l & 255;
	var gi0 = perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32;
	var gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32;
	var gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32;
	var gi3 = perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32;
	var gi4 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32;
	// Calculate the contribution from the five corners
	var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
	if (t0 < 0) n0 = 0.0;else {
		t0 *= t0;
		n0 = t0 * t0 * this.dot4(grad4[gi0], x0, y0, z0, w0);
	}
	var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
	if (t1 < 0) n1 = 0.0;else {
		t1 *= t1;
		n1 = t1 * t1 * this.dot4(grad4[gi1], x1, y1, z1, w1);
	}
	var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
	if (t2 < 0) n2 = 0.0;else {
		t2 *= t2;
		n2 = t2 * t2 * this.dot4(grad4[gi2], x2, y2, z2, w2);
	}var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
	if (t3 < 0) n3 = 0.0;else {
		t3 *= t3;
		n3 = t3 * t3 * this.dot4(grad4[gi3], x3, y3, z3, w3);
	}
	var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
	if (t4 < 0) n4 = 0.0;else {
		t4 *= t4;
		n4 = t4 * t4 * this.dot4(grad4[gi4], x4, y4, z4, w4);
	}
	// Sum up and scale the result to cover the range [-1,1]
	return 27.0 * (n0 + n1 + n2 + n3 + n4);
};

//GLOBAL
var events = new Events();
var simplexNoise = new SimplexNoise();

// add Fastclick
if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function () {
		FastClick.attach(document.body);
	}, false);
}

//MAIN RMP
var UberVizMain = (function () {

	//var ATUtil;

	var stats;
	var windowHalfX;
	var windowHalfY;

	function init() {

		if (!Detector.webgl) {
			Detector.addGetWebGLMessage();
		}

		//INIT DOCUMENT
		document.onselectstart = function () {
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
		switch (event.keyCode) {
			case 32:
				/* space */
				//AudioHandler.onTap();
				VizHandler.setBeat(Math.random() + .1);
				break;
			case 81:
				/* q */
				//toggleControls();
				break;
		}
	}

	function onKeyUp(event) {}

	function onDocumentMouseDown(event) {}

	function onDocumentMouseUp(event) {}

	function onDocumentMouseMove(event) {
		// mouseX = (event.clientX - windowHalfX) / (windowHalfX);
		// mouseY = (event.clientY - windowHalfY) / (windowHalfY);
	}

	function onResize() {
		//windowHalfX = window.innerWidth / 2;
		//windowHalfY = window.innerHeight / 2;
		VizHandler.onResize();
	}

	function trace(text) {
		$("#debugText").text(text);
	}

	function setBeat(num) {
		VizHandler.setBeat(Math.random() + .1);
	}

	/*
 	function toggleControls(){
 		ControlsHandler.vizParams.showControls = !ControlsHandler.vizParams.showControls;
 		$('#controls').toggle();
 		VizHandler.onResize();
 	}
 */

	function reorient(e) {
		var portrait = window.orientation % 180 == 0;
		// $("body > div").css("-webkit-transform", !portrait ? "rotate(0deg)" : "");
	}
	window.onorientationchange = reorient;
	window.setTimeout(reorient, 0);

	return {
		init: init,
		setBeat: setBeat,
		trace: trace
	};
})();

$(document).ready(function () {
	UberVizMain.init();

	// create our AudioContext and osc Nodes
	var audioContext, osc, gain, x, y;
	var ready = null;
	var myShakeEvent;
	var clap, kick, low, snare;

	console.log("loaded");
	$('#status').text('loaded');

	//	$('.trigger').bind('touchstart', function(){

	$('.trigger').hide();

	$('#playBtn').on('click', function () {
		$('#playBtn').remove();
		activateTrigger();
	});

	function activateTrigger() {

		$('.trigger').show();
		$('body').bind('touchstart', function () {
			// $(this).addClass('recording');
			$('.trigger').addClass('recording');

			if (ready != "shake") {
				activateShakeSound();
			} else {
				myShakeEvent.start();
			}
			$('#status').text('Touch Shake');
		}).bind('touchend', function () {
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

	$('#clapBtn').on('click', function () {
		//$("body").addClass('active');
		playClap();
	});
	$('#kickBtn').on('click', function () {
		playKick();
	});
	$('#lowBtn').on('click', function () {
		playLow();
	});
	$('#snareBtn').on('click', function () {
		playSnare();
	});

	$("#shakeBtn").click(function () {
		if (ready == "shake") {
			stopShakeSound();
		} else {
			activateShakeSound();
		}
	});

	function playClap() {
		drumMaster.play('clap');
		vizEffect();
	}
	function playKick() {
		drumMaster.play('kick');
		vizEffect();
	}
	function playLow() {
		drumMaster.play('low');
		vizEffect();
	}
	function playSnare() {
		drumMaster.play('snare');
		vizEffect();
	}
	function playLaser() {
		drumMaster.play('laser');
		vizEffect();
	}

	function vizEffect() {
		UberVizMain.setBeat(Math.random() + .1);
	}

	function activateShakeSound() {
		ready = 'shake';
		$('#shakeBtn').text('stop');
		initShakeSound();
	}

	function stopShakeSound() {
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

	function initShakeSound() {
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
		function shakeEventDidOccur() {

			//put your own code here etc.
			shakeSound();

			$("body").addClass('active');
			//setTimeout(stopSound, 100);
		}
	}

	function shakeSound() {
		console.log('shaking');
		//	$('#status').text('shaking');
		if (x > 0) {
			playClap();
		} else {
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

	function stopSound() {}
	//osc.stop();
	//osc.disconnect();
	//	$('#status').text('stop');

	///////////////////////////////////////////////

	var motionMultiplier = 30;

	var center = {
		x: $(window).width() / 2,
		y: $(window).height() / 2
	};

	var compassRotate = function compassRotate(_a, _b, _g) {
		$('.ball').css({
			transform: 'rotateZ(' + _a + 'deg)'
		});
	};

	var moveBall = function moveBall(x, y, z) {
		$('.ball').css({
			top: Math.ceil(center.y + y * motionMultiplier),
			left: Math.ceil(center.x + -1 * x * motionMultiplier)
		});
	};

	compassRotate(90, 45, 45);
	moveBall(0, 0, 0);

	var initOrientation = function initOrientation() {

		//Find our div containers in the DOM
		var dataContainerOrientation = document.getElementById('dataContainerOrientation');
		var dataContainerMotion = document.getElementById('dataContainerMotion');

		//Check for support for DeviceOrientation event
		if (window.DeviceOrientationEvent) {
			window.addEventListener('deviceorientation', function (event) {
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
			window.addEventListener('devicemotion', function (event) {
				x = Math.floor(event.accelerationIncludingGravity.x);
				y = event.accelerationIncludingGravity.y;
				var z = event.accelerationIncludingGravity.z;
				var r = event.rotationRate;
				var html = 'Acceleration:<br />';
				html += 'x: ' + x + '<br />y: ' + y + '<br/>z: ' + z + '<br />';
				html += 'Rotation rate:<br />';
				if (r != null) html += 'alpha: ' + r.alpha + '<br />beta: ' + r.beta + '<br/>gamma: ' + r.gamma + '<br />';
				dataContainerMotion.innerHTML = html;

				moveBall(x, y, z);
				if (ready == 'tilt') {
					var rand = x * 1000 / 5;
					osc.detune.value = rand;
					$('#status').html(rand);
					console.log('ready');
				}
			});
		}
	};

	initOrientation();
});
//# sourceMappingURL=main.js.map
