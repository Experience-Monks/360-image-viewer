import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { create360Viewer } from '360-image-viewer';
import { canvasFit } from 'canvas-fit'
// const create360Viewer = require('360-image-viewer');
// const canvasFit = require('canvas-fit');

var mobile = false;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  constructor(public navCtrl: NavController, public platform: Platform) {}
  check() {
    mobile = this.platform.is('mobileweb') ? true : false;
    alert(mobile ? "mobile!" : "desktop!")
  }

}
