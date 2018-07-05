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

/***/ 205:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_gyroscope__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_360_image_viewer__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_360_image_viewer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_360_image_viewer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_drag_drop__ = __webpack_require__(330);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_drag_drop___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_drag_drop__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var mobile = false;
var autoSpin = false; // whether to rotate the view
var panUp = true; // initial vertical scroll direction
var shift = false; // if the shift key is pressed
var initMouse = [0, 0]; // initial cursor position
var currMouse = [0, 0]; // current cursor position
var currGyro = [0, 0, 0, 0]; // current gyro position
var canvasSize = [0, 0]; // current canvas size
var focus = true; // if the document has focus
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, platform, gyroscope) {
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.gyroscope = gyroscope;
        mobile = this.platform.is('mobileweb') ? true : false;
        if (mobile)
            gyroSetup(this.gyroscope);
    }
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/Users/william/Documents/GitHub/my360-image-viewer/src/pages/home/home.html"*/'<!-- <ion-header>\n  <ion-navbar>\n    <ion-title>\n      My 360 Viewer\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <button ion-button id="#drop-region" (click)="check()">Check if mobile!</button>\n</ion-content> -->\n\n\n\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, shrink-to-fit=0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">\n  <title>My 360-image-viewer</title>\n  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet">\n  <style>\n  body {\n    margin: 0;\n    font-family: \'Source Sans Pro\', Helvetica, sans-serif;\n    overflow: hidden;\n  }\n  * {\n    -webkit-touch-callout:none;\n    -webkit-text-size-adjust:none;\n    -webkit-tap-highlight-color:rgba(0,0,0,0);\n    -webkit-user-select:none;\n  }\n  .display {\n    width: 100px;\n    height: 30px;\n    position: absolute;\n    top: 0;\n    left: 0;\n    margin: 20px;\n    display: block;\n    background: black;\n  }\n  .info {\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    margin: 20px;\n    pointer-events: auto; /* Previously set to none */\n  }\n  .info2 {\n    position: absolute;\n    bottom: 0;\n    right: 0;\n    margin: 20px;\n    text-align: right;\n  }\n  .hr {\n    width: 20px;\n    height: 1px;\n    margin: 0;\n    padding: 0;\n    margin-bottom: 10px;\n    /* float: right; */\n    display: block;\n    background: white;\n    /* vertical-align: middle; */\n  }\n  p {\n    display: block;\n    margin: 0;\n    padding: 0;\n    /* vertical-align: middle; */\n    color: white;\n    font-size: 10px;\n  }\n  canvas, .grab {\n    cursor: -webkit-grab;\n    cursor: -moz-grab;\n  }\n  canvas:active, .grabbing {\n    cursor: -webkit-grabbing;\n    cursor: -moz-grabbing; \n  }\n  .button{\n    width: 30px;\n    height: 30px;\n  }\n  .left {\n    position: absolute;\n    bottom: 50%;\n    left: 0;\n    margin: 20px;\n    pointer-events: auto; /* Previously set to none */\n  }\n  .right {\n    position: absolute;\n    bottom: 50%;\n    right: 0;\n    margin: 20px;\n    pointer-events: auto; /* Previously set to none */\n  }\n  #drop-region {\n    position: absolute;\n    top: 5px;\n    left: 5px;\n    width: calc(100% - 10px);\n    height: calc(100% - 10px);\n    pointer-events: none;\n    border: 2px dashed white;\n    box-sizing: border-box;\n    border-radius: 10px;\n    padding: 10px;\n    mix-blend-mode: overlay;\n    box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.5);\n  }\n  </style>\n</head>\n\n\n<body>\n  <canvas id="canvas"></canvas>\n  <div class="display">\n    <p id="position"></p>\n  </div>\n  <img class="left button" id="left" src="../../assets/imgs/left.png">\n  <img class="right button" id="right" src="../../assets/imgs/right.png">\n  <!-- <button class="right" id="right">Move right</button>\n  <button class="left" id="left">Move left</button> -->\n    \n    <div class="info">\n      <div class="hr"></div>\n      <p>Drop an equirectangular JPG or PNG here to view it in 360º</p>\n      <button id="spin">Spin!</button>\n      <p>Automatic scrolling <input type="checkbox" id="toggle"></p>\n      <p>Invert Drag Controls <input type="checkbox" id="invert"></p>\n    </div>\n    <div class="info2" style="display: none">\n    <div class="hr"></div>\n    <p>Press SPACE to toggle auto spin</p>\n    <p>Use the ARROW KEYS to move around</p>\n    <p>Hold SHIFT and move the cursor to pan around</p>\n  </div>\n  <div id="drop-region" style="display: none;"></div>\n  <script src="bundle.js"></script>\n</body>\n</html>\n'/*ion-inline-end:"/Users/william/Documents/GitHub/my360-image-viewer/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* Platform */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* Platform */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ionic_native_gyroscope__["a" /* Gyroscope */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ionic_native_gyroscope__["a" /* Gyroscope */]) === "function" && _c || Object])
    ], HomePage);
    return HomePage;
    var _a, _b, _c;
}());

window.onload = function () {
    alert(mobile ? "mobile!" : "computer!");
    if (!mobile)
        document.getElementsByClassName("info2")[0].style.display = "";
    var dropRegion = document.querySelector('#drop-region');
    // Get a canvas of some sort, e.g. fullscreen or embedded in a site
    var canvas = createCanvas({
        canvas: document.querySelector('#canvas'),
    });
    // Load your image
    var image = new Image();
    image.onload = function () {
        // Setup the 360 viewer
        var viewer = __WEBPACK_IMPORTED_MODULE_3_360_image_viewer__({
            image: image,
            canvas: canvas,
            damping: 0.2,
            zoom: true,
            pinching: true,
            distanceBounds: [0, 1.05],
        });
        setupDragDrop(canvas, viewer);
        // Start canvas render loop
        viewer.start();
        viewerSetup(viewer);
        var xFactor = 0.000065;
        var yFactor = 0.000065;
        viewer.on('tick', function (dt) {
            var txt = "";
            txt += viewer.controls.theta;
            txt += " ";
            txt += viewer.controls.phi;
            document.getElementById("position").innerHTML = txt;
            if (shift) {
                // Handle cursor-guided scrolling
                var xdiff = initMouse[0] - currMouse[0];
                var ydiff = initMouse[1] - currMouse[1];
                viewer.controls.theta += Math.sign(xdiff) * Math.pow(xdiff, 2) * xFactor / (canvasSize[0] / 2);
                viewer.controls.phi += Math.sign(ydiff) * Math.pow(ydiff, 2) * yFactor / (canvasSize[1] / 2);
            }
            else if (focus) {
                // Handle auto scrolling
                if (autoSpin && !viewer.controls.dragging) {
                    dt = dt < 20 ? dt : 16.8;
                    viewer.controls.theta -= dt * 0.00005;
                    panUp = viewer.controls.phi >= 0.6 * Math.PI ? false : panUp;
                    panUp = viewer.controls.phi <= 0.48 * Math.PI ? true : panUp;
                    viewer.controls.phi += dt * 0.00005 * (panUp ? 1 : -1);
                }
            }
        });
        function setupDragDrop(canvas, viewer) {
            __WEBPACK_IMPORTED_MODULE_4_drag_drop__(canvas, {
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
    image.src = "../../assets/imgs/pano.jpg";
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
    setupGrabCursor();
    return canvas;
}
function viewerSetup(viewer) {
    // Determine when document has focus
    document.addEventListener("visibilitychange", function () {
        focus = !focus;
    });
    // Personal Preference
    invertDrag();
    if (mobile) {
        document.getElementsByClassName("display")[0].addEventListener("click", function () {
            alert(currGyro);
        });
    }
    // Set up key handlers
    if (!mobile) {
        document.body.onkeydown = checkKeyDown;
        document.body.onkeyup = checkKeyUp;
        document.addEventListener("mousemove", mouseHandler);
    }
    // Set up checkbox handlers
    document.getElementById("invert").addEventListener("change", invertDrag);
    document.getElementById("toggle").addEventListener("change", toggleSpin);
    // Set up button handlers
    document.getElementById("spin").addEventListener("click", toggleSpinKeyDown);
    document.getElementById("left").addEventListener("click", moveLeft);
    document.getElementById("right").addEventListener("click", moveRight);
    // Calls helper methods based on which keys pressed
    function checkKeyDown(e) {
        e = e || window.event;
        switch (e.keyCode) {
            // shift
            case 16:
                shiftDown();
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
                shiftUp();
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
    // Toggles auto spin on key down
    function toggleSpinKeyDown() {
        document.getElementById("toggle").checked =
            !document.getElementById("toggle").checked;
        toggleSpin();
    }
    // Toggles auto spin
    function toggleSpin() {
        autoSpin = !autoSpin;
    }
    // Triggers when shift is held down
    function shiftDown() {
        shift = true;
        initMouse = currMouse;
    }
    // Triggers when shift is released
    function shiftUp() {
        shift = false;
    }
    // Constantly caching the mouse's position
    function mouseHandler(event) {
        var x = event.clientX;
        var y = event.clientY;
        currMouse = [x, y];
    }
    // Inverts the controls for dragging
    function invertDrag() {
        viewer.controls.rotateSpeed = -viewer.controls.rotateSpeed;
    }
}
function gyroSetup(gyro) {
    if (mobile) {
        alert("setting up gyro!");
        var options = {
            frequency: 1000
        };
        gyro.getCurrent(options)
            .then(function (orientation) {
            currGyro = [orientation.x, orientation.y, orientation.z, orientation.timestamp];
            // console.log(orientation.x, orientation.y, orientation.z, orientation.timestamp);
        })
            .catch();
        gyro.watch()
            .subscribe(function (orientation) {
            currGyro = [orientation.x, orientation.y, orientation.z, orientation.timestamp];
            // console.log(orientation.x, orientation.y, orientation.z, orientation.timestamp);
        });
        alert("finished setting up (y)");
    }
}
//# sourceMappingURL=home.js.map

/***/ }),

/***/ 210:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(233);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_gyroscope__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_home_home__ = __webpack_require__(205);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(205);
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

},[210]);
//# sourceMappingURL=main.js.map