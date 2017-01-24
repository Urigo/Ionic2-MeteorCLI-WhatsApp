import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import template from './show-picture.html';

@Component({
  template
})
export class ShowPictureComponent {
  pictureSrc: string;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    this.pictureSrc = navParams.get('pictureSrc');
  }
}
