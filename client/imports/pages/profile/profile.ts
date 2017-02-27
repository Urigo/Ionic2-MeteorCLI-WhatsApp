import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Pictures } from '../../../../imports/collections';
import { Profile } from '../../../../imports/models';
import { PictureService } from '../../services/picture';
import { ChatsPage } from '../chats/chats';
import template from './profile.html';

@Component({
  template
})
export class ProfilePage implements OnInit {
  picture: string;
  profile: Profile;

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private pictureService: PictureService
  ) {}

  ngOnInit(): void {
    this.profile = Meteor.user().profile || {
      name: ''
    };

    MeteorObservable.subscribe('user').subscribe(() => {
      this.picture = Pictures.getPictureUrl(this.profile.pictureId);
    });
  }

  selectProfilePicture(): void {
    this.pictureService.select().then((blob) => {
      this.uploadProfilePicture(blob);
    })
      .catch((e) => {
        this.handleError(e);
      });
  }

  uploadProfilePicture(blob: Blob): void {
    this.pictureService.upload(blob).then((picture) => {
      this.profile.pictureId = picture._id;
      this.picture = picture.url;
    })
      .catch((e) => {
        this.handleError(e);
      });
  }

  updateProfile(): void {
    MeteorObservable.call('updateProfile', this.profile).subscribe({
      next: () => {
        this.navCtrl.push(ChatsPage);
      },
      error: (e: Error) => {
        this.handleError(e);
      }
    });
  }

  handleError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: 'Oops!',
      message: e.message,
      buttons: ['OK']
    });

    alert.present();
  }
}