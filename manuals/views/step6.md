# Step 6: Chats creation &amp; removal

Our next step is about adding the ability to create new chats. So far we had the chats list and the users feature, we just need to connect them.

We will open the new chat view using Ionic's modal dialog ([see documentation](http://ionicframework.com/docs/v2/components/#modals)). The dialog is gonna pop up from the chats view once we click on the icon at the top right corner of the view. Let's implement the handler in the chats component first:

[{]: <helper> (diff_step 6.1)
#### Step 6.1: Add 'addChat' method to ChatsComponent

##### Changed client/imports/pages/chats/chats.component.ts
```diff
@@ -7,9 +7,10 @@
 ┊ 7┊ 7┊import {Chats} from "../../../../both/collections/chats.collection";
 ┊ 8┊ 8┊import {Message} from "../../../../both/models/message.model";
 ┊ 9┊ 9┊import {Messages} from "../../../../both/collections/messages.collection";
-┊10┊  ┊import {NavController, PopoverController} from "ionic-angular";
+┊  ┊10┊import {NavController, PopoverController, ModalController} from "ionic-angular";
 ┊11┊11┊import {MessagesPage} from "../chat/messages-page.component";
 ┊12┊12┊import {ChatsOptionsComponent} from '../chats/chats-options.component';
+┊  ┊13┊import {NewChatComponent} from './new-chat.component';
 ┊13┊14┊
 ┊14┊15┊@Component({
 ┊15┊16┊  selector: "chats",
```
```diff
@@ -23,7 +24,8 @@
 ┊23┊24┊
 ┊24┊25┊  constructor(
 ┊25┊26┊    private navCtrl: NavController,
-┊26┊  ┊    private popoverCtrl: PopoverController
+┊  ┊27┊    private popoverCtrl: PopoverController,
+┊  ┊28┊    private modalCtrl: ModalController
 ┊27┊29┊    ) {}
 ┊28┊30┊
 ┊29┊31┊  ngOnInit() {
```
```diff
@@ -45,6 +47,11 @@
 ┊45┊47┊      ).zone();
 ┊46┊48┊  }
 ┊47┊49┊
+┊  ┊50┊  addChat(): void {
+┊  ┊51┊    const modal = this.modalCtrl.create(NewChatComponent);
+┊  ┊52┊    modal.present();
+┊  ┊53┊  }
+┊  ┊54┊
 ┊48┊55┊  showOptions(): void {
 ┊49┊56┊    const popover = this.popoverCtrl.create(ChatsOptionsComponent, {}, {
 ┊50┊57┊      cssClass: 'options-popover'
```
[}]: #

And let's bind the event to the view:

[{]: <helper> (diff_step 6.2)
#### Step 6.2: Bind that method

##### Changed client/imports/pages/chats/chats.component.html
```diff
@@ -3,7 +3,7 @@
 ┊3┊3┊    <ion-title>Chats</ion-title>
 ┊4┊4┊
 ┊5┊5┊    <ion-buttons end>
-┊6┊ ┊      <button ion-button icon-only class="add-chat-button"><ion-icon name="person-add"></ion-icon></button>
+┊ ┊6┊      <button ion-button icon-only class="add-chat-button" (click)="addChat()"><ion-icon name="person-add"></ion-icon></button>
 ┊7┊7┊      <button ion-button icon-only class="options-button" (click)="showOptions()"><ion-icon name="more"></ion-icon></button>
 ┊8┊8┊    </ion-buttons>
 ┊9┊9┊  </ion-navbar>
```
[}]: #

The dialog should contain a list of all the users whom chat does not exist yet. Once we click on one of these users we should be demoted to the chats view with the new chat we've just created.

Since we wanna insert a new chat we need to create the corresponding method in the `methods.ts` file:

[{]: <helper> (diff_step 6.3)
#### Step 6.3: Define 'addChat' Method

##### Changed server/imports/methods/methods.ts
```diff
@@ -23,6 +23,28 @@
 ┊23┊23┊      $set: {profile}
 ┊24┊24┊    });
 ┊25┊25┊  },
+┊  ┊26┊  addChat(receiverId: string): void {
+┊  ┊27┊    if (!this.userId) throw new Meteor.Error('unauthorized',
+┊  ┊28┊      'User must be logged-in to create a new chat');
+┊  ┊29┊ 
+┊  ┊30┊    check(receiverId, nonEmptyString);
+┊  ┊31┊ 
+┊  ┊32┊    if (receiverId == this.userId) throw new Meteor.Error('illegal-receiver',
+┊  ┊33┊      'Receiver must be different than the current logged in user');
+┊  ┊34┊ 
+┊  ┊35┊    const chatExists = !!Chats.collection.find({
+┊  ┊36┊      memberIds: {$all: [this.userId, receiverId]}
+┊  ┊37┊    }).count();
+┊  ┊38┊ 
+┊  ┊39┊    if (chatExists) throw new Meteor.Error('chat-exists',
+┊  ┊40┊      'Chat already exists');
+┊  ┊41┊ 
+┊  ┊42┊    const chat = {
+┊  ┊43┊      memberIds: [this.userId, receiverId]
+┊  ┊44┊    };
+┊  ┊45┊ 
+┊  ┊46┊    Chats.insert(chat);
+┊  ┊47┊  },
 ┊26┊48┊  addMessage(chatId: string, content: string): void {
 ┊27┊49┊    if (!this.userId) throw new Meteor.Error('unauthorized',
 ┊28┊50┊      'User must be logged-in to create a new chat');
```
[}]: #

As you can see, a chat is inserted with an additional `memberIds` field. Let's update the chat model accordingly:

[{]: <helper> (diff_step 6.4)
#### Step 6.4: Add memberIds prop in Chat model

##### Changed both/models/chat.model.ts
```diff
@@ -2,6 +2,7 @@
 ┊2┊2┊
 ┊3┊3┊export interface Chat {
 ┊4┊4┊  _id?: string;
+┊ ┊5┊  memberIds?: string[];
 ┊5┊6┊  title?: string;
 ┊6┊7┊  picture?: string;
 ┊7┊8┊  lastMessage?: Message;
```
[}]: #

We're going to use `Meteor.users` so let's create a Observable Collection and call it `Users`:

[{]: <helper> (diff_step 6.5)
#### Step 6.5: Create Observable collection from Meteor.users

##### Added both/collections/users.collection.ts
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊import {Meteor} from 'meteor/meteor';
+┊ ┊2┊import {MongoObservable} from "meteor-rxjs";
+┊ ┊3┊import {User} from "../models/user.model";
+┊ ┊4┊
+┊ ┊5┊export const Users = MongoObservable.fromExisting<User>(Meteor.users);
```
[}]: #

[{]: <helper> (diff_step 6.6)
#### Step 6.6: Create a User model

##### Added both/models/user.model.ts
```diff
@@ -0,0 +1,7 @@
+┊ ┊1┊import { Meteor } from 'meteor/meteor';
+┊ ┊2┊
+┊ ┊3┊import { Profile } from '../models/profile.model';
+┊ ┊4┊
+┊ ┊5┊export interface User extends Meteor.User {
+┊ ┊6┊  profile?: Profile;
+┊ ┊7┊}
```
[}]: #

We used `fromExisting()` method which does exactly what the name says.

Now that we have the method ready we can go ahead and implement the new chat dialog:

[{]: <helper> (diff_step 6.7)
#### Step 6.7: Create NewChatComponent

##### Added client/imports/pages/chats/new-chat.component.ts
```diff
@@ -0,0 +1,84 @@
+┊  ┊ 1┊import {Component, OnInit} from '@angular/core';
+┊  ┊ 2┊import {MeteorObservable, ObservableCursor} from 'meteor-rxjs';
+┊  ┊ 3┊import {NavController, ViewController, AlertController} from 'ionic-angular';
+┊  ┊ 4┊import {Meteor} from 'meteor/meteor';
+┊  ┊ 5┊import {Observable} from 'rxjs/Observable';
+┊  ┊ 6┊import {Chats} from '../../../../both/collections/chats.collection';
+┊  ┊ 7┊import {Users} from '../../../../both/collections/users.collection';
+┊  ┊ 8┊import {User} from '../../../../both/models/user.model';
+┊  ┊ 9┊import template from './new-chat.component.html';
+┊  ┊10┊import style from "./new-chat.component.scss";
+┊  ┊11┊import 'rxjs/add/operator/mergeMap';
+┊  ┊12┊import 'rxjs/add/operator/startWith';
+┊  ┊13┊ 
+┊  ┊14┊@Component({
+┊  ┊15┊  selector: 'new-chat',
+┊  ┊16┊  template,
+┊  ┊17┊  styles: [
+┊  ┊18┊    style
+┊  ┊19┊  ]
+┊  ┊20┊})
+┊  ┊21┊export class NewChatComponent implements OnInit {
+┊  ┊22┊  users: Observable<User>;
+┊  ┊23┊  private senderId: string;
+┊  ┊24┊ 
+┊  ┊25┊  constructor(
+┊  ┊26┊    private navCtrl: NavController, 
+┊  ┊27┊    private viewCtrl: ViewController,
+┊  ┊28┊    private alertCtrl: AlertController
+┊  ┊29┊  ) {
+┊  ┊30┊    this.senderId = Meteor.userId();
+┊  ┊31┊  }
+┊  ┊32┊
+┊  ┊33┊  ngOnInit() {
+┊  ┊34┊    MeteorObservable.autorun().zone().subscribe(() => {
+┊  ┊35┊      this.users = this.findUsers().zone();
+┊  ┊36┊    });
+┊  ┊37┊  }
+┊  ┊38┊ 
+┊  ┊39┊  addChat(user): void {
+┊  ┊40┊    MeteorObservable.call('addChat', user._id).subscribe({
+┊  ┊41┊      next: () => {
+┊  ┊42┊        this.viewCtrl.dismiss();
+┊  ┊43┊      },
+┊  ┊44┊      error: (e: Error) => {
+┊  ┊45┊        this.viewCtrl.dismiss().then(() => {
+┊  ┊46┊          this.handleError(e)
+┊  ┊47┊        });
+┊  ┊48┊      }
+┊  ┊49┊    });
+┊  ┊50┊  }
+┊  ┊51┊ 
+┊  ┊52┊  private findUsers(): Observable<User> {
+┊  ┊53┊    return Chats.find({
+┊  ┊54┊        memberIds: this.senderId
+┊  ┊55┊      }, {
+┊  ┊56┊        fields: {
+┊  ┊57┊          memberIds: 1
+┊  ┊58┊        }
+┊  ┊59┊      })
+┊  ┊60┊        .startWith([]) // empty result
+┊  ┊61┊        .mergeMap((chats) => {
+┊  ┊62┊          const recieverIds = chats
+┊  ┊63┊            .map(({memberIds}) => memberIds)
+┊  ┊64┊            .reduce((result, memberIds) => result.concat(memberIds), [])
+┊  ┊65┊            .concat(this.senderId);
+┊  ┊66┊          
+┊  ┊67┊          return Users.find({
+┊  ┊68┊            _id: {$nin: recieverIds}
+┊  ┊69┊          })
+┊  ┊70┊        });
+┊  ┊71┊  }
+┊  ┊72┊ 
+┊  ┊73┊  private handleError(e: Error): void {
+┊  ┊74┊    console.error(e);
+┊  ┊75┊ 
+┊  ┊76┊    const alert = this.alertCtrl.create({
+┊  ┊77┊      title: 'Oops!',
+┊  ┊78┊      message: e.message,
+┊  ┊79┊      buttons: ['OK']
+┊  ┊80┊    });
+┊  ┊81┊ 
+┊  ┊82┊    alert.present();
+┊  ┊83┊  }
+┊  ┊84┊}🚫↵
```
[}]: #

[{]: <helper> (diff_step 6.8)
#### Step 6.8: Create also a template

##### Added client/imports/pages/chats/new-chat.component.html
```diff
@@ -0,0 +1,18 @@
+┊  ┊ 1┊<ion-header>
+┊  ┊ 2┊  <ion-toolbar color="whatsapp">
+┊  ┊ 3┊    <ion-title>New Chat</ion-title>
+┊  ┊ 4┊ 
+┊  ┊ 5┊    <ion-buttons end>
+┊  ┊ 6┊      <button ion-button class="dismiss-button" (click)="viewCtrl.dismiss()"><ion-icon name="close"></ion-icon></button>
+┊  ┊ 7┊    </ion-buttons>
+┊  ┊ 8┊  </ion-toolbar>
+┊  ┊ 9┊</ion-header>
+┊  ┊10┊ 
+┊  ┊11┊<ion-content class="new-chat">
+┊  ┊12┊  <ion-list class="users">
+┊  ┊13┊    <button ion-item *ngFor="let user of users | async" class="user" (click)="addChat(user)">
+┊  ┊14┊      <img class="user-picture" [src]="user.profile.picture">
+┊  ┊15┊      <h2 class="user-name">{{user.profile.name}}</h2>
+┊  ┊16┊    </button>
+┊  ┊17┊  </ion-list>
+┊  ┊18┊</ion-content>🚫↵
```
[}]: #

[{]: <helper> (diff_step 6.9)
#### Step 6.9: Define some styles

##### Added client/imports/pages/chats/new-chat.component.scss
```diff
@@ -0,0 +1,14 @@
+┊  ┊ 1┊.new-chat {
+┊  ┊ 2┊  .user-picture {
+┊  ┊ 3┊    border-radius: 50%;
+┊  ┊ 4┊    width: 50px;
+┊  ┊ 5┊    float: left;
+┊  ┊ 6┊  }
+┊  ┊ 7┊ 
+┊  ┊ 8┊  .user-name {
+┊  ┊ 9┊    margin-left: 20px;
+┊  ┊10┊    margin-top: 25px;
+┊  ┊11┊    transform: translate(0, -50%);
+┊  ┊12┊    float: left;
+┊  ┊13┊  }
+┊  ┊14┊}🚫↵
```
[}]: #

[{]: <helper> (diff_step 6.1)
#### Step 6.1: Add 'addChat' method to ChatsComponent

##### Changed client/imports/pages/chats/chats.component.ts
```diff
@@ -7,9 +7,10 @@
 ┊ 7┊ 7┊import {Chats} from "../../../../both/collections/chats.collection";
 ┊ 8┊ 8┊import {Message} from "../../../../both/models/message.model";
 ┊ 9┊ 9┊import {Messages} from "../../../../both/collections/messages.collection";
-┊10┊  ┊import {NavController, PopoverController} from "ionic-angular";
+┊  ┊10┊import {NavController, PopoverController, ModalController} from "ionic-angular";
 ┊11┊11┊import {MessagesPage} from "../chat/messages-page.component";
 ┊12┊12┊import {ChatsOptionsComponent} from '../chats/chats-options.component';
+┊  ┊13┊import {NewChatComponent} from './new-chat.component';
 ┊13┊14┊
 ┊14┊15┊@Component({
 ┊15┊16┊  selector: "chats",
```
```diff
@@ -23,7 +24,8 @@
 ┊23┊24┊
 ┊24┊25┊  constructor(
 ┊25┊26┊    private navCtrl: NavController,
-┊26┊  ┊    private popoverCtrl: PopoverController
+┊  ┊27┊    private popoverCtrl: PopoverController,
+┊  ┊28┊    private modalCtrl: ModalController
 ┊27┊29┊    ) {}
 ┊28┊30┊
 ┊29┊31┊  ngOnInit() {
```
```diff
@@ -45,6 +47,11 @@
 ┊45┊47┊      ).zone();
 ┊46┊48┊  }
 ┊47┊49┊
+┊  ┊50┊  addChat(): void {
+┊  ┊51┊    const modal = this.modalCtrl.create(NewChatComponent);
+┊  ┊52┊    modal.present();
+┊  ┊53┊  }
+┊  ┊54┊
 ┊48┊55┊  showOptions(): void {
 ┊49┊56┊    const popover = this.popoverCtrl.create(ChatsOptionsComponent, {}, {
 ┊50┊57┊      cssClass: 'options-popover'
```
[}]: #


Thanks to our new-chat dialog, we can create chats dynamically with no need in initial fabrication. Let's replace the chats fabrication with users fabrication in the Meteor server:

[{]: <helper> (diff_step 6.11)
#### Step 6.11: Replace chats fabrication with users fabrication

##### Changed server/imports/server-main/main.ts
```diff
@@ -1,66 +1,44 @@
 ┊ 1┊ 1┊import {Chats} from "../../../both/collections/chats.collection";
 ┊ 2┊ 2┊import {Messages} from "../../../both/collections/messages.collection";
-┊ 3┊  ┊import * as moment from "moment";
+┊  ┊ 3┊import {Users} from '../../../both/collections/users.collection';
+┊  ┊ 4┊import {Accounts} from 'meteor/accounts-base';
 ┊ 4┊ 5┊
 ┊ 5┊ 6┊export class Main {
 ┊ 6┊ 7┊  start(): void {
-┊ 7┊  ┊    if (Chats.collection.find().count()) return;
-┊ 8┊  ┊
-┊ 9┊  ┊    let chatId;
-┊10┊  ┊
-┊11┊  ┊    chatId = Chats.collection.insert({
-┊12┊  ┊      title: 'Ethan Gonzalez',
-┊13┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
-┊14┊  ┊    });
-┊15┊  ┊
-┊16┊  ┊    Messages.collection.insert({
-┊17┊  ┊      chatId: chatId,
-┊18┊  ┊      content: 'You on your way?',
-┊19┊  ┊      createdAt: moment().subtract(1, 'hours').toDate()
-┊20┊  ┊    });
-┊21┊  ┊
-┊22┊  ┊    chatId = Chats.collection.insert({
-┊23┊  ┊      title: 'Bryan Wallace',
-┊24┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg'
-┊25┊  ┊    });
-┊26┊  ┊
-┊27┊  ┊    Messages.collection.insert({
-┊28┊  ┊      chatId: chatId,
-┊29┊  ┊      content: 'Hey, it\'s me',
-┊30┊  ┊      createdAt: moment().subtract(2, 'hours').toDate()
-┊31┊  ┊    });
-┊32┊  ┊
-┊33┊  ┊    chatId = Chats.collection.insert({
-┊34┊  ┊      title: 'Avery Stewart',
-┊35┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'
-┊36┊  ┊    });
-┊37┊  ┊
-┊38┊  ┊    Messages.collection.insert({
-┊39┊  ┊      chatId: chatId,
-┊40┊  ┊      content: 'I should buy a boat',
-┊41┊  ┊      createdAt: moment().subtract(1, 'days').toDate()
-┊42┊  ┊    });
-┊43┊  ┊
-┊44┊  ┊    chatId = Chats.collection.insert({
-┊45┊  ┊      title: 'Katie Peterson',
-┊46┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
-┊47┊  ┊    });
-┊48┊  ┊
-┊49┊  ┊    Messages.collection.insert({
-┊50┊  ┊      chatId: chatId,
-┊51┊  ┊      content: 'Look at my mukluks!',
-┊52┊  ┊      createdAt: moment().subtract(4, 'days').toDate()
-┊53┊  ┊    });
-┊54┊  ┊
-┊55┊  ┊    chatId = Chats.collection.insert({
-┊56┊  ┊      title: 'Ray Edwards',
-┊57┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
-┊58┊  ┊    });
-┊59┊  ┊
-┊60┊  ┊    Messages.collection.insert({
-┊61┊  ┊      chatId: chatId,
-┊62┊  ┊      content: 'This is wicked good ice cream.',
-┊63┊  ┊      createdAt: moment().subtract(2, 'weeks').toDate()
+┊  ┊ 8┊    if (Users.collection.find().count()) return;
+┊  ┊ 9┊
+┊  ┊10┊    [{
+┊  ┊11┊      phone: '+972540000001',
+┊  ┊12┊      profile: {
+┊  ┊13┊        name: 'Ethan Gonzalez',
+┊  ┊14┊        picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
+┊  ┊15┊      }
+┊  ┊16┊    }, {
+┊  ┊17┊      phone: '+972540000002',
+┊  ┊18┊      profile: {
+┊  ┊19┊        name: 'Bryan Wallace',
+┊  ┊20┊        picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg'
+┊  ┊21┊      }
+┊  ┊22┊    }, {
+┊  ┊23┊      phone: '+972540000003',
+┊  ┊24┊      profile: {
+┊  ┊25┊        name: 'Avery Stewart',
+┊  ┊26┊        picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'
+┊  ┊27┊      }
+┊  ┊28┊    }, {
+┊  ┊29┊      phone: '+972540000004',
+┊  ┊30┊      profile: {
+┊  ┊31┊        name: 'Katie Peterson',
+┊  ┊32┊        picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
+┊  ┊33┊      }
+┊  ┊34┊    }, {
+┊  ┊35┊      phone: '+972540000005',
+┊  ┊36┊      profile: {
+┊  ┊37┊        name: 'Ray Edwards',
+┊  ┊38┊        picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
+┊  ┊39┊      }
+┊  ┊40┊    }].forEach(user => {
+┊  ┊41┊      Accounts.createUserWithPhone(user);
 ┊64┊42┊    });
 ┊65┊43┊  }
 ┊66┊44┊}
```
[}]: #

Since we changed the data fabrication method, the chat's title and picture are not hardcoded anymore, therefore they should be calculated in the components themselves. Let's calculate those fields in the chats component:

[{]: <helper> (diff_step 6.12)
#### Step 6.12: Add title and picture to chat

##### Changed client/imports/pages/chats/chats.component.ts
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊import {Component, OnInit} from "@angular/core";
 ┊2┊2┊import template from "./chats.component.html"
 ┊3┊3┊import {Observable} from "rxjs";
+┊ ┊4┊import {Meteor} from 'meteor/meteor';
 ┊4┊5┊import {Chat} from "../../../../both/models/chat.model";
 ┊5┊6┊import * as moment from "moment";
 ┊6┊7┊import style from "./chats.component.scss";
```
```diff
@@ -21,6 +22,7 @@
 ┊21┊22┊})
 ┊22┊23┊export class ChatsComponent implements OnInit {
 ┊23┊24┊  chats: Observable<Chat[]>;
+┊  ┊25┊  senderId: string;
 ┊24┊26┊
 ┊25┊27┊  constructor(
 ┊26┊28┊    private navCtrl: NavController,
```
```diff
@@ -29,6 +31,7 @@
 ┊29┊31┊    ) {}
 ┊30┊32┊
 ┊31┊33┊  ngOnInit() {
+┊  ┊34┊    this.senderId = Meteor.userId();
 ┊32┊35┊    this.chats = Chats
 ┊33┊36┊      .find({})
 ┊34┊37┊      .mergeMap<Chat[]>(chats =>
```
```diff
@@ -44,7 +47,16 @@
 ┊44┊47┊
 ┊45┊48┊          )
 ┊46┊49┊        )
-┊47┊  ┊      ).zone();
+┊  ┊50┊      ).map(chats => {
+┊  ┊51┊        chats.forEach(chat => {
+┊  ┊52┊          const receiver = Meteor.users.findOne(chat.memberIds.find(memberId => memberId !== this.senderId))
+┊  ┊53┊
+┊  ┊54┊          chat.title = receiver.profile.name;
+┊  ┊55┊          chat.picture = receiver.profile.picture;
+┊  ┊56┊        });
+┊  ┊57┊
+┊  ┊58┊        return chats;
+┊  ┊59┊      }).zone();
 ┊48┊60┊  }
 ┊49┊61┊
 ┊50┊62┊  addChat(): void {
```
[}]: #

Now we want our changes to take effect. We will reset the database so next time we run our Meteor server the users will be fabricated. To reset the database, first make sure the Meteor server is stopped and then type the following command:

    $ meteor reset

And once we start our server again it should go through the initialization method and fabricate the users.

[{]: <helper> (nav_step next_ref="https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/privacy" prev_ref="https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/authentication")
| [< Previous Step](https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/authentication) | [Next Step >](https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/privacy) |
|:--------------------------------|--------------------------------:|
[}]: #

