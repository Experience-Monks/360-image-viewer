webpackJsonp([0],{

/***/ 120:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 120;

/***/ }),

/***/ 161:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 161;

/***/ }),

/***/ 204:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_360_image_viewer__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_360_image_viewer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_360_image_viewer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_drag_drop__ = __webpack_require__(330);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_drag_drop___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_drag_drop__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_nosleep_js__ = __webpack_require__(333);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_nosleep_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_nosleep_js__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var decimalDigits = 3; // number of decimal places to round values
var imagePath = "../../assets/imgs/";
var defaultPicture = "pano.jpg";
var awake = new __WEBPACK_IMPORTED_MODULE_4_nosleep_js__();
var mobile = false; // if being run on a phone
var autoSpin = false; // whether to rotate the view
var panUp = true; // initial vertical spin direction
var shift = false; // if the shift key is held
var tilt = false; // if mobile is in tilt mode
var portrait = 0; // orientation of phone (0-vertical, 1-cw, 2-upside down, 3-ccw)
var initMouse = [0, 0]; // initial cursor position
var currMouse = [0, 0]; // current cursor position
var currAcc = [0, 0, 0]; // current acceleration
var initRot = [0, 0, 0]; // current rotation
var currRot = [0, 0, 0]; // current rotation
var rotSpeed = [0, 0, 0]; // movement in each axis (To be deleted)
var currPos = [0, 0]; // current position
var canvasSize = [0, 0]; // current canvas size
var scalingFactors; // holds scaling factors
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, platform) {
        this.navCtrl = navCtrl;
        this.platform = platform;
        mobile = this.platform.is('mobileweb');
        scalingFactors = mobile ? [0.00003, 0.00003]
            : [0.000065, 0.000050];
    }
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/Users/william/Documents/GitHub/my360-image-viewer/src/pages/home/home.html"*/'<!DOCTYPE html>\n<html lang="en">\n\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, shrink-to-fit=0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">\n  <title>My 360-image-viewer</title>\n  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet">\n</head>\n\n<body>\n  <canvas id="canvas"></canvas>\n  <div class="left display">\n    <p id="position"></p>\n  </div>\n  <div class="right display">\n    <p id="position2"></p>\n  </div>\n  <img class="left arrow" id="left" src="../../assets/imgs/left.png">\n  <img class="right arrow" id="right" src="../../assets/imgs/right.png">\n  <div class="info">\n    <!-- <div class="hr"></div> -->\n    <!-- <p>Drop an equirectangular JPG or PNG here to view it in 360º</p> -->\n    <label for="upload">\n      <img class="icon" src="../../assets/imgs/upload.png"> </label>\n    <input id="upload" type="file" style="display: none">\n    \n    <img class="icon" id="spin" src="../../assets/imgs/rotate.png" style="display: none">\n    <img class="icon" id="tilt" src="../../assets/imgs/tilt.png" style="display: none">\n    <!-- <button id="tilt" style="display: none">Tilt</button> -->\n    <!-- <div class="hr"></div> -->\n    <p class="controls">Automatic scrolling\n      <input type="checkbox" id="toggle">\n    </p>\n    <p class="controls">Invert Drag Controls\n      <input type="checkbox" id="invert">\n    </p>\n  </div>\n  <div class="info2" style="display: none">\n    <div class="hr"></div>\n    <p>Press SPACE to toggle auto spin</p>\n    <p>Use the ARROW KEYS to move around</p>\n    <p>Hold SHIFT and move the cursor to pan around</p>\n  </div>\n  <div id="drop-region" style="display: none"></div>\n  <script src="bundle.js"></script>\n</body>\n\n</html>'/*ion-inline-end:"/Users/william/Documents/GitHub/my360-image-viewer/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* Platform */]])
    ], HomePage);
    return HomePage;
}());

window.onload = function () {
    // Desktop setup
    if (!mobile) {
        document.getElementById("spin").style.display = "";
        mouseSetup();
        // To be deleted
        document.getElementsByClassName("info2")[0].style.display = "";
        // scalingFactors = [0.000065, 0.000050];
    }
    else {
        // Set up tilt controls if supported
        if ("ondeviceorientation" in window) {
            document.getElementById("tilt").style.display = "";
            document.getElementById("tilt").addEventListener("click", enableNoSleep);
            rotSetup();
            accSetup();
            // scalingFactors = [0.00003, 0.00003];
        }
        // To be deleted
        document.getElementsByClassName("display")[0].addEventListener("click", function () {
            alert(initRot.join("\n"));
        });
    }
    // General setup
    // document.querySelector("#upload").addEventListener("change", uploadPhoto);
    document.querySelector("#upload").onchange = uploadPhoto;
    // Get a canvas of some sort, e.g. fullscreen or embedded in a site
    var canvas = createCanvas({
        canvas: document.querySelector('#canvas'),
    });
    // Create and set up image
    var image = new Image();
    image.src = imagePath + defaultPicture;
    image.onload = function () {
        // Setup the 360 viewer
        var viewer = __WEBPACK_IMPORTED_MODULE_2_360_image_viewer__({
            image: image,
            canvas: canvas,
            damping: 0.25,
            zoom: true,
            pinching: true,
            distanceBounds: [0, 1.05],
        });
        if (!mobile)
            setupDragDrop(canvas, viewer);
        // Start canvas render loop
        viewerSetup(viewer);
        viewer.start();
        viewer.on('tick', function (dt) {
            // To be deleted
            if (!mobile) {
                var theta = roundDecimal(viewer.controls.theta, decimalDigits);
                var phi = roundDecimal(viewer.controls.phi, decimalDigits);
                currPos = [theta, phi];
                document.getElementById("position").innerHTML = "<p>" + currPos.join("</p><p>") + "</p>";
            }
            if (shift && !mobile) {
                cursorScrolling();
            }
            else if (tilt && mobile && !viewer.controls.dragging) {
                tiltScrolling();
            }
            else if (autoSpin && !viewer.controls.dragging) {
                autoSpinning(dt);
            }
        });
        // Handle automatic scrolling
        function autoSpinning(dt) {
            dt = dt < 20 ? dt : 16.8; // Makes sure dt doesn't become too high
            viewer.controls.theta -= dt * 0.00005; // Horizontal movement
            // Determine when to switch vertical direction
            panUp = viewer.controls.phi >= 0.6 * Math.PI ? false : panUp;
            panUp = viewer.controls.phi <= 0.48 * Math.PI ? true : panUp;
            viewer.controls.phi += dt * 0.00005 * (panUp ? 1 : -1); // Vertical movement
        }
        // Handle cursor-guided scrolling
        function cursorScrolling() {
            var xdiff = initMouse[0] - currMouse[0];
            var ydiff = initMouse[1] - currMouse[1];
            viewer.controls.theta += Math.sign(xdiff) * Math.pow(xdiff, 2) * scalingFactors[0] / (canvasSize[0] / 2);
            viewer.controls.phi += Math.sign(ydiff) * Math.pow(ydiff, 2) * scalingFactors[1] / (canvasSize[1] / 2);
        }
        // Handle gyroscope-guided scrolling
        function tiltScrolling() {
            var xdiff = roundDecimal(smallestDiff(initRot[2], currRot[2], 90), decimalDigits); // z axis
            var ydiff = roundDecimal(smallestDiff(initRot[1], currRot[1], 90), decimalDigits); // y axis
            // swap if landscape orientation
            if (portrait % 2 != 0) {
                var temp = xdiff;
                xdiff = ydiff;
                ydiff = temp;
            }
            // Negate values as necessary
            // 0: x=x, y=y, 1: x=-y, y=x, 2: x=-x, y=-y, 3: x=y, y=-x
            if (portrait != 0) {
                if (portrait > 1)
                    ydiff = -ydiff;
                if (portrait < 3)
                    xdiff = -xdiff;
            }
            viewer.controls.theta += Math.sign(xdiff) * Math.pow(xdiff, 2) * scalingFactors[0]; // (canvasSize[0] / 4);
            viewer.controls.phi += Math.sign(ydiff) * Math.pow(ydiff, 2) * scalingFactors[1]; // (canvasSize[1] / 4);
            // To be deleted
            rotSpeed = [0, ydiff, xdiff];
            document.getElementById("position2").innerHTML = "<p>" + rotSpeed.join("</p><p>") + "</p>";
        }
        // returns the smallest angle difference between init and curr within the range [-deg, deg]
        function smallestDiff(init, curr, deg) {
            var deg2 = 2 * deg;
            var diff = (init % deg - curr % deg + deg2) % deg2;
            return diff > deg ? diff - deg2 : diff;
        }
        // Setup drag and drop for uploading new photos on desktop
        function setupDragDrop(canvas, viewer) {
            var dropRegion = document.querySelector('#drop-region');
            __WEBPACK_IMPORTED_MODULE_3_drag_drop__(canvas, {
                onDragEnter: function () {
                    dropRegion.style.display = '';
                },
                onDragLeave: function () {
                    dropRegion.style.display = 'none';
                },
                onDrop: function (files) {
                    var img = new Image();
                    img.onload = function () {
                        viewer.texture(img);
                    };
                    img.onerror = function () {
                        alert('Could not load image!');
                    };
                    img.crossOrigin = 'Anonymous';
                    img.src = URL.createObjectURL(files[0]);
                }
            });
        }
    };
    function uploadPhoto() {
        if (this.files && this.files[0]) {
            image.src = URL.createObjectURL(this.files[0]); // set src to file url
            // To be deleted
            alert(this.files[0]);
            alert(URL.createObjectURL(this.files[0]));
            this.files = null;
        }
    }
};
// Utility to create a device pixel scaled canvas
function createCanvas(opt) {
    if (opt === void 0) { opt = {}; }
    // default to full screen (no width/height specified)
    var viewport = opt.viewport || [0, 0];
    var canvas = opt.canvas || document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = viewport[0] + "px";
    canvas.style.left = viewport[1] + "px";
    // Resize the canvas with the proper device pixel ratio
    var resizeCanvas = function () {
        // default to fullscreen if viewport width/height is unspecified
        var width = typeof viewport[2] === 'number' ? viewport[2] : window.innerWidth;
        var height = typeof viewport[3] === 'number' ? viewport[3] : window.innerHeight;
        var dpr = window.devicePixelRatio;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvasSize = [width, height];
        if (mobile)
            recalculateOrientation();
    };
    // Ensure the grab cursor appears even when the mouse is outside the window
    var setupGrabCursor = function () {
        canvas.addEventListener('mousedown', function () {
            document.documentElement.classList.remove('grabbing');
            document.documentElement.classList.add('grabbing');
        });
        window.addEventListener('mouseup', function () {
            document.documentElement.classList.remove('grabbing');
        });
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    if (!mobile)
        setupGrabCursor();
    return canvas;
}
// Prevents the screen from going to sleep on mobile
function enableNoSleep() {
    awake.enable();
    // alert("no more sleeping")
    document.getElementById("tilt").removeEventListener('click', enableNoSleep);
}
// Calculates the orientation of the mobile device
function recalculateOrientation() {
    // If taller than wide, vertical (0-vertical, 1-cw, 2-upside down, 3-ccw)
    portrait = canvasSize[1] > canvasSize[0] ? (currAcc[1] >= 0 ? 0 : 2)
        : (currAcc[0] >= 0 ? 3 : 1);
    if (tilt)
        toggleTilt();
}
// Set up movement controls for the viewer
function viewerSetup(viewer) {
    // Personal Preference
    invertDrag();
    // Set up key handlers
    if (!mobile) {
        document.body.onkeydown = checkKeyDown;
        document.body.onkeyup = checkKeyUp;
    }
    // Set up checkbox handlers
    document.getElementById("invert").onclick = invertDrag;
    document.getElementById("toggle").onclick = toggleSpin;
    // Set up button handlers
    mobile ? document.getElementById("tilt").onclick = toggleTilt
        : document.getElementById("spin").onclick = toggleSpinKeyDown;
    document.getElementById("left").onclick = moveLeft;
    document.getElementById("right").onclick = moveRight;
    // Calls helper methods based on which keys pressed
    function checkKeyDown(e) {
        e = e || window.event;
        switch (e.keyCode) {
            // shift
            case 16:
                shiftOn();
                break;
            // space
            case 32:
                toggleSpinKeyDown();
                break;
            // left arrow
            case 37:
                moveLeft();
                break;
            // up arrow
            case 38:
                moveUp();
                break;
            // right arrow
            case 39:
                moveRight();
                break;
            // down arrow
            case 40:
                moveDown();
                break;
        }
    }
    // Calls helper methods based on which keys released
    function checkKeyUp(e) {
        e = e || window.event;
        switch (e.keyCode) {
            // shift
            case 16:
                shiftOff();
                break;
        }
    }
    ///////////////////////////////////////
    // Helper Functions
    ///////////////////////////////////////
    var PI2 = 2 * Math.PI; // Stores the twice the value of pi (1 full rotation)
    // Makes a full rotation left in 12 steps
    function moveLeft() {
        viewer.controls.theta += PI2 / 12;
    }
    // Makes a full rotation right in 12 steps
    function moveRight() {
        viewer.controls.theta -= PI2 / 12;
    }
    // Makes a half rotation up in 15 steps
    function moveUp() {
        viewer.controls.phi += Math.PI / 15;
    }
    // Makes a half rotation down in 15 steps
    function moveDown() {
        viewer.controls.phi -= Math.PI / 15;
    }
    // Inverts the controls for dragging
    function invertDrag() {
        viewer.controls.rotateSpeed = -viewer.controls.rotateSpeed;
    }
}
// Activates shift controls
function shiftOn() {
    shift = true;
    initMouse = currMouse;
}
// Deactivates shift controls
function shiftOff() {
    shift = false;
}
// Toggles auto spin triggered by a keypress
function toggleSpinKeyDown() {
    document.getElementById("toggle").checked =
        !document.getElementById("toggle").checked;
    toggleSpin();
}
// Toggles auto spin
function toggleSpin() {
    autoSpin = !autoSpin;
}
// Toggles the tilt controls, sets the HTML button text
function toggleTilt() {
    tilt = !tilt;
    // let tiltButton = document.querySelector("#tilt")
    var tiltButton = document.querySelector("#tilt");
    if (tilt) {
        tiltButton.src = imagePath + "iphone.png";
        initRot = currRot;
    }
    else {
        tiltButton.src = imagePath + "tilt.png";
        awake.disable();
        tiltButton.addEventListener('click', enableNoSleep);
    }
}
// Read and cache mouse position
// Used for shift controls on desktop
function mouseSetup() {
    document.addEventListener("mousemove", function (e) {
        var x = e.clientX;
        var y = e.clientY;
        currMouse = [x, y];
    });
}
// Read and cache the rotation values
// Used for tilt controls on mobile
function rotSetup() {
    window.addEventListener("deviceorientation", function (e) {
        var alpha = roundDecimal(e.alpha, decimalDigits);
        var beta = roundDecimal(e.beta, decimalDigits);
        var gamma = roundDecimal(e.gamma, decimalDigits);
        currRot = [alpha, beta, gamma];
        // To be deleted
        document.getElementById("position").innerHTML = "<p>" + currRot.join("</p><p>") + "</p>";
    });
}
// Read and cache the acceleration values
// Used for detecting orientation on mobile
function accSetup() {
    window.addEventListener("devicemotion", function (e) {
        var xAcc = roundDecimal(e.accelerationIncludingGravity.x, decimalDigits);
        var yAcc = roundDecimal(e.accelerationIncludingGravity.y, decimalDigits);
        var zAcc = roundDecimal(e.accelerationIncludingGravity.z, decimalDigits);
        currAcc = [xAcc, yAcc, zAcc];
        // To be deleted
        // document.getElementById("position").innerHTML = "<p>" + [xAcc, yAcc, zAcc].join("</p><p>") + "</p>";
    });
}
// Rounds num to at most dig decimal places
function roundDecimal(num, dig) {
    return Math.trunc(num * Math.pow(10, dig)) / Math.pow(10, dig);
}
//# sourceMappingURL=home.js.map

/***/ }),

/***/ 209:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(232);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 232:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_gyroscope__ = __webpack_require__(282);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_home_home__ = __webpack_require__(204);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */], {}, {
                    links: []
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_gyroscope__["a" /* Gyroscope */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 283:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(204);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/william/Documents/GitHub/my360-image-viewer/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/Users/william/Documents/GitHub/my360-image-viewer/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ })

},[209]);
//# sourceMappingURL=main.js.map