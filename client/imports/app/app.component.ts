import { Component } from '@angular/core';
import { Platform } from "ionic-angular";
import { StatusBar } from "ionic-native";
import { Meteor } from 'meteor/meteor';
import template from './app.component.html';
import {TabsContainerComponent} from "../pages/tabs-container/tabs-container.component";
import {LoginComponent} from '../pages/auth/login.component';

@Component({
  selector: 'app',
  template
})
export class AppComponent {
  rootPage: any;

  constructor(platform: Platform) {
    this.rootPage = Meteor.user() ? TabsContainerComponent : LoginComponent;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}
