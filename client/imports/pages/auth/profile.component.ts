import {Component, OnInit} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {Meteor} from 'meteor/meteor';
import {MeteorObservable} from 'meteor-rxjs';
import {Profile} from '../../../../both/models/profile.model';
import {TabsContainerComponent} from '../tabs-container/tabs-container.component';

import template from './profile.component.html';
import style from './profile.component.scss';
 
@Component({
  selector: 'profile',
  template,
  styles: [
    style
  ]
})
export class ProfileComponent implements OnInit {
  profile: Profile;
 
  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.profile = Meteor.user().profile || {
      name: '',
      picture: '/assets/ionicons/dist/svg/ios-contact.svg'
    };
  }
 
  done(): void {
    MeteorObservable.call('updateProfile', this.profile).subscribe({
      next: () => {
        this.navCtrl.push(TabsContainerComponent);
      },
      error(e: Error) {
        this.handleError(e);
      }
    });
  }
 
  private handleError(e: Error): void {
    console.error(e);
 
    const alert = this.alertCtrl.create({
      title: 'Oops!',
      message: e.message,
      buttons: ['OK']
    });
 
    alert.present();
  }
}