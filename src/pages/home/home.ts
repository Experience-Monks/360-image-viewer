import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

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
