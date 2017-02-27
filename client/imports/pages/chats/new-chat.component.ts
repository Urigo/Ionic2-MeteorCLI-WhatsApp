import {Component, OnInit} from '@angular/core';
import {MeteorObservable, ObservableCursor} from 'meteor-rxjs';
import {NavController, ViewController, AlertController} from 'ionic-angular';
import {Meteor} from 'meteor/meteor';
import {Observable} from 'rxjs/Observable';
import {Chats} from '../../../../both/collections/chats.collection';
import {Users} from '../../../../both/collections/users.collection';
import {User} from '../../../../both/models/user.model';
import template from './new-chat.component.html';
import style from "./new-chat.component.scss";
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
 
@Component({
  selector: 'new-chat',
  template,
  styles: [
    style
  ]
})
export class NewChatComponent implements OnInit {
  users: Observable<User>;
  private senderId: string;
 
  constructor(
    private navCtrl: NavController, 
    private viewCtrl: ViewController,
    private alertCtrl: AlertController
  ) {
    this.senderId = Meteor.userId();
  }

  ngOnInit() {
    MeteorObservable.subscribe('users').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.users = this.findUsers().zone();
      });
    });
  }
 
  addChat(user): void {
    MeteorObservable.call('addChat', user._id).subscribe({
      next: () => {
        this.viewCtrl.dismiss();
      },
      error: (e: Error) => {
        this.viewCtrl.dismiss().then(() => {
          this.handleError(e)
        });
      }
    });
  }
 
  private findUsers(): Observable<User> {
    return Chats.find({
        memberIds: this.senderId
      }, {
        fields: {
          memberIds: 1
        }
      })
        .startWith([]) // empty result
        .mergeMap((chats) => {
          const recieverIds = chats
            .map(({memberIds}) => memberIds)
            .reduce((result, memberIds) => result.concat(memberIds), [])
            .concat(this.senderId);
          
          return Users.find({
            _id: {$nin: recieverIds}
          })
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