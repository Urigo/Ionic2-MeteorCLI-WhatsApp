import {Component} from '@angular/core';
import {NavParams, NavController, ViewController, AlertController} from 'ionic-angular';
import {Meteor} from 'meteor/meteor';
import {MeteorObservable} from 'meteor-rxjs';
import template from './messages-options.component.html';
import style from "./messages-options.component.scss";
import {TabsContainerComponent} from '../tabs-container/tabs-container.component';
 
@Component({
  selector: 'messages-options',
  template,
  styles: [
    style
  ]
})
export class MessagesOptionsComponent {
  constructor(
    private navCtrl: NavController, 
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private params: NavParams
  ) {}
 
  remove(): void {
    const alert = this.alertCtrl.create({
      title: 'Remove',
      message: 'Are you sure you would like to proceed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.handleRemove(alert);
            return false;
          }
        }
      ]
    });
 
    this.viewCtrl.dismiss().then(() => {
      alert.present();
    });
  }
 
  private handleRemove(alert): void {
    MeteorObservable.call('removeChat', this.params.get('chat')._id).subscribe({
      next: () => {
        alert.dismiss().then(() => {
          this.navCtrl.setRoot(TabsContainerComponent, {}, {
            animate: true
          });
        });
      },
      error: (e: Error) => {
        alert.dismiss().then(() => {
          if (e) return this.handleError(e);
  
          this.navCtrl.setRoot(TabsContainerComponent, {}, {
            animate: true
          });
        });
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