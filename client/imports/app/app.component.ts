import { Component } from '@angular/core';
import { Platform } from "ionic-angular";
import { StatusBar } from "ionic-native";
import template from './app.component.html';

@Component({
  selector: 'app',
  template
})
export class AppComponent {
  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}
