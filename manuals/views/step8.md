[{]: <region> (header)
# Step 8: Chats Creation & Removal
[}]: #
[{]: <region> (body)
Our next step is about adding the ability to create new chats. We have the `ChatsPage` and the authentication system, but we need to hook them up some how. Let's define the initial `User` schema which will be used to retrieve its relevant information in our application:

[{]: <helper> (diff_step 8.1)
#### Step 8.1: Added user model

##### Changed imports/models.ts
```diff
@@ -1,3 +1,5 @@
+┊ ┊1┊import { Meteor } from 'meteor/meteor';
+┊ ┊2┊
 ┊1┊3┊export const DEFAULT_PICTURE_URL = '/assets/default-profile-pic.svg';
 ┊2┊4┊
 ┊3┊5┊export interface Profile {
```
```diff
@@ -24,4 +26,8 @@
 ┊24┊26┊  createdAt?: Date;
 ┊25┊27┊  ownership?: string;
 ┊26┊28┊  type?: MessageType;
+┊  ┊29┊}
+┊  ┊30┊
+┊  ┊31┊export interface User extends Meteor.User {
+┊  ┊32┊  profile?: Profile;
 ┊27┊33┊}🚫↵
```
[}]: #

`Meteor` comes with a built-in users collection, defined as `Meteor.users`, but since we're using `Observables` vastly, we will wrap our collection with one:

[{]: <helper> (diff_step 8.2)
#### Step 8.2: Wrap Meteor users collection

##### Added imports/collections/users.ts
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊import { MongoObservable } from 'meteor-rxjs';
+┊ ┊2┊import { Meteor } from 'meteor/meteor';
+┊ ┊3┊import { User } from '../models';
+┊ ┊4┊
+┊ ┊5┊export const Users = MongoObservable.fromExisting<User>(Meteor.users);🚫↵
```
[}]: #

For accessibility, we're gonna export the collection from the `index` file as well:

[{]: <helper> (diff_step 8.3)
#### Step 8.3: Export users collection form index file

##### Changed imports/collections/index.ts
```diff
@@ -1,2 +1,3 @@
 ┊1┊1┊export * from './chats';
-┊2┊ ┊export * from './messages';🚫↵
+┊ ┊2┊export * from './messages';
+┊ ┊3┊export * from './users';🚫↵
```
[}]: #

## Chats Creation

We will be using `Ionic`'s modal dialog to show the chat creation view. The first thing we're gonna do would be implementing the component itself, along with its view and stylesheet:

[{]: <helper> (diff_step 8.4)
#### Step 8.4: Add new-chat component

##### Added client/imports/pages/chats/new-chat.ts
```diff
@@ -0,0 +1,85 @@
+┊  ┊ 1┊import { Component, OnInit } from '@angular/core';
+┊  ┊ 2┊import { AlertController, ViewController } from 'ionic-angular';
+┊  ┊ 3┊import { MeteorObservable } from 'meteor-rxjs';
+┊  ┊ 4┊import { _ } from 'meteor/underscore';
+┊  ┊ 5┊import { Observable, Subscription } from 'rxjs';
+┊  ┊ 6┊import { Chats, Users } from '../../../../imports/collections';
+┊  ┊ 7┊import { User } from '../../../../imports/models';
+┊  ┊ 8┊import template from './new-chat.html';
+┊  ┊ 9┊
+┊  ┊10┊@Component({
+┊  ┊11┊  template
+┊  ┊12┊})
+┊  ┊13┊export class NewChatComponent implements OnInit {
+┊  ┊14┊  senderId: string;
+┊  ┊15┊  users: Observable<User[]>;
+┊  ┊16┊  usersSubscription: Subscription;
+┊  ┊17┊
+┊  ┊18┊  constructor(
+┊  ┊19┊    private alertCtrl: AlertController,
+┊  ┊20┊    private viewCtrl: ViewController
+┊  ┊21┊  ) {
+┊  ┊22┊    this.senderId = Meteor.userId();
+┊  ┊23┊  }
+┊  ┊24┊
+┊  ┊25┊  ngOnInit() {
+┊  ┊26┊    this.loadUsers();
+┊  ┊27┊  }
+┊  ┊28┊
+┊  ┊29┊  addChat(user): void {
+┊  ┊30┊    MeteorObservable.call('addChat', user._id).subscribe({
+┊  ┊31┊      next: () => {
+┊  ┊32┊        this.viewCtrl.dismiss();
+┊  ┊33┊      },
+┊  ┊34┊      error: (e: Error) => {
+┊  ┊35┊        this.viewCtrl.dismiss().then(() => {
+┊  ┊36┊          this.handleError(e);
+┊  ┊37┊        });
+┊  ┊38┊      }
+┊  ┊39┊    });
+┊  ┊40┊  }
+┊  ┊41┊
+┊  ┊42┊  loadUsers(): void {
+┊  ┊43┊    this.users = this.findUsers();
+┊  ┊44┊  }
+┊  ┊45┊
+┊  ┊46┊  findUsers(): Observable<User[]> {
+┊  ┊47┊    // Find all belonging chats
+┊  ┊48┊    return Chats.find({
+┊  ┊49┊      memberIds: this.senderId
+┊  ┊50┊    }, {
+┊  ┊51┊      fields: {
+┊  ┊52┊        memberIds: 1
+┊  ┊53┊      }
+┊  ┊54┊    })
+┊  ┊55┊    // Invoke merge-map with an empty array in case no chat found
+┊  ┊56┊    .startWith([])
+┊  ┊57┊    .mergeMap((chats) => {
+┊  ┊58┊      // Get all userIDs who we're chatting with
+┊  ┊59┊      const receiverIds = _.chain(chats)
+┊  ┊60┊        .pluck('memberIds')
+┊  ┊61┊        .flatten()
+┊  ┊62┊        .concat(this.senderId)
+┊  ┊63┊        .value();
+┊  ┊64┊
+┊  ┊65┊      // Find all users which are not in belonging chats
+┊  ┊66┊      return Users.find({
+┊  ┊67┊        _id: { $nin: receiverIds }
+┊  ┊68┊      })
+┊  ┊69┊      // Invoke map with an empty array in case no user found
+┊  ┊70┊      .startWith([]);
+┊  ┊71┊    });
+┊  ┊72┊  }
+┊  ┊73┊
+┊  ┊74┊  handleError(e: Error): void {
+┊  ┊75┊    console.error(e);
+┊  ┊76┊
+┊  ┊77┊    const alert = this.alertCtrl.create({
+┊  ┊78┊      buttons: ['OK'],
+┊  ┊79┊      message: e.message,
+┊  ┊80┊      title: 'Oops!'
+┊  ┊81┊    });
+┊  ┊82┊
+┊  ┊83┊    alert.present();
+┊  ┊84┊  }
+┊  ┊85┊}🚫↵
```
[}]: #

[{]: <helper> (diff_step 8.5)
#### Step 8.5: Add new-chat template

##### Added client/imports/pages/chats/new-chat.html
```diff
@@ -0,0 +1,22 @@
+┊  ┊ 1┊<ion-header>
+┊  ┊ 2┊  <ion-toolbar color="whatsapp">
+┊  ┊ 3┊    <ion-title>New Chat</ion-title>
+┊  ┊ 4┊
+┊  ┊ 5┊    <ion-buttons left>
+┊  ┊ 6┊      <button ion-button class="dismiss-button" (click)="viewCtrl.dismiss()"><ion-icon name="close"></ion-icon></button>
+┊  ┊ 7┊    </ion-buttons>
+┊  ┊ 8┊
+┊  ┊ 9┊    <ion-buttons end>
+┊  ┊10┊      <button ion-button class="search-button"><ion-icon name="search"></ion-icon></button>
+┊  ┊11┊    </ion-buttons>
+┊  ┊12┊  </ion-toolbar>
+┊  ┊13┊</ion-header>
+┊  ┊14┊
+┊  ┊15┊<ion-content class="new-chat">
+┊  ┊16┊  <ion-list class="users">
+┊  ┊17┊    <button ion-item *ngFor="let user of users | async" class="user" (click)="addChat(user)">
+┊  ┊18┊      <img class="user-picture" [src]="user.profile.picture">
+┊  ┊19┊      <h2 class="user-name">{{user.profile.name}}</h2>
+┊  ┊20┊    </button>
+┊  ┊21┊  </ion-list>
+┊  ┊22┊</ion-content>🚫↵
```
[}]: #

[{]: <helper> (diff_step 8.6)
#### Step 8.6: Add new-chat style

##### Added client/imports/pages/chats/new-chat.scss
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

##### Changed client/main.scss
```diff
@@ -6,6 +6,7 @@
 ┊ 6┊ 6┊
 ┊ 7┊ 7┊// Pages
 ┊ 8┊ 8┊@import "imports/pages/chats/chats";
+┊  ┊ 9┊@import "imports/pages/chats/new-chat";
 ┊ 9┊10┊@import "imports/pages/chats/chats-options";
 ┊10┊11┊@import "imports/pages/login/login";
 ┊11┊12┊@import "imports/pages/messages/messages";
```
[}]: #

The dialog should contain a list of all the users whose chat does not exist yet. Once we click on one of these users we should be demoted to the chats view with the new chat we've just created.

The dialog should be revealed whenever we click on one of the options in the options pop-over, therefore, we will implement the necessary handler:

[{]: <helper> (diff_step 8.7)
#### Step 8.7: Add addChat method

##### Changed client/imports/pages/chats/chats.ts
```diff
@@ -1,5 +1,5 @@
 ┊1┊1┊import { Component, OnInit } from '@angular/core';
-┊2┊ ┊import { NavController, PopoverController } from 'ionic-angular';
+┊ ┊2┊import { NavController, PopoverController, ModalController } from 'ionic-angular';
 ┊3┊3┊import * as Moment from 'moment';
 ┊4┊4┊import { Observable } from 'rxjs';
 ┊5┊5┊import { Chats, Messages } from '../../../../imports/collections';
```
```diff
@@ -7,6 +7,7 @@
 ┊ 7┊ 7┊import { ChatsOptionsComponent } from './chats-options';
 ┊ 8┊ 8┊import { MessagesPage } from '../messages/messages';
 ┊ 9┊ 9┊import template from './chats.html';
+┊  ┊10┊import { NewChatComponent } from './new-chat';
 ┊10┊11┊
 ┊11┊12┊@Component({
 ┊12┊13┊  template
```
```diff
@@ -16,7 +17,8 @@
 ┊16┊17┊
 ┊17┊18┊  constructor(
 ┊18┊19┊    private navCtrl: NavController,
-┊19┊  ┊    private popoverCtrl: PopoverController) {
+┊  ┊20┊    private popoverCtrl: PopoverController,
+┊  ┊21┊    private modalCtrl: ModalController) {
 ┊20┊22┊  }
 ┊21┊23┊
 ┊22┊24┊  ngOnInit() {
```
```diff
@@ -37,6 +39,11 @@
 ┊37┊39┊      ).zone();
 ┊38┊40┊  }
 ┊39┊41┊
+┊  ┊42┊  addChat(): void {
+┊  ┊43┊    const modal = this.modalCtrl.create(NewChatComponent);
+┊  ┊44┊    modal.present();
+┊  ┊45┊  }
+┊  ┊46┊
 ┊40┊47┊  showMessages(chat): void {
 ┊41┊48┊    this.navCtrl.push(MessagesPage, {chat});
 ┊42┊49┊  }
```
[}]: #

And bind it to the `click` event:

[{]: <helper> (diff_step 8.8)
#### Step 8.8: Bind click event to new chat modal

##### Changed client/imports/pages/chats/chats.html
```diff
@@ -4,7 +4,7 @@
 ┊ 4┊ 4┊      Chats
 ┊ 5┊ 5┊    </ion-title>
 ┊ 6┊ 6┊    <ion-buttons end>
-┊ 7┊  ┊      <button ion-button icon-only class="add-chat-button">
+┊  ┊ 7┊      <button ion-button icon-only class="add-chat-button" (click)="addChat()">
 ┊ 8┊ 8┊        <ion-icon name="person-add"></ion-icon>
 ┊ 9┊ 9┊      </button>
 ┊10┊10┊      <button ion-button icon-only class="options-button" (click)="showOptions()">
```
[}]: #

We will import the newly created component in the app's `NgModule` as well, so it can be recognized properly:

[{]: <helper> (diff_step 8.9)
#### Step 8.9: Import new chat component

##### Changed client/imports/app/app.module.ts
```diff
@@ -3,6 +3,7 @@
 ┊3┊3┊import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
 ┊4┊4┊import { ChatsPage } from '../pages/chats/chats'
 ┊5┊5┊import { ChatsOptionsComponent } from '../pages/chats/chats-options';
+┊ ┊6┊import { NewChatComponent } from '../pages/chats/new-chat';
 ┊6┊7┊import { LoginPage } from '../pages/login/login';
 ┊7┊8┊import { MessagesPage } from '../pages/messages/messages';
 ┊8┊9┊import { ProfilePage } from '../pages/profile/profile';
```
```diff
@@ -18,7 +19,8 @@
 ┊18┊19┊    LoginPage,
 ┊19┊20┊    VerificationPage,
 ┊20┊21┊    ProfilePage,
-┊21┊  ┊    ChatsOptionsComponent
+┊  ┊22┊    ChatsOptionsComponent,
+┊  ┊23┊    NewChatComponent
 ┊22┊24┊  ],
 ┊23┊25┊  imports: [
 ┊24┊26┊    IonicModule.forRoot(MyApp),
```
```diff
@@ -32,7 +34,8 @@
 ┊32┊34┊    LoginPage,
 ┊33┊35┊    VerificationPage,
 ┊34┊36┊    ProfilePage,
-┊35┊  ┊    ChatsOptionsComponent
+┊  ┊37┊    ChatsOptionsComponent,
+┊  ┊38┊    NewChatComponent
 ┊36┊39┊  ],
 ┊37┊40┊  providers: [
 ┊38┊41┊    { provide: ErrorHandler, useClass: IonicErrorHandler },
```
[}]: #

We're also required to implement the appropriate `Meteor` method which will be the actually handler for feeding our data-base with newly created chats:

[{]: <helper> (diff_step 8.10)
#### Step 8.10: Implement addChat method

##### Changed server/methods.ts
```diff
@@ -9,6 +9,35 @@
 ┊ 9┊ 9┊});
 ┊10┊10┊
 ┊11┊11┊Meteor.methods({
+┊  ┊12┊  addChat(receiverId: string): void {
+┊  ┊13┊    if (!this.userId) {
+┊  ┊14┊      throw new Meteor.Error('unauthorized',
+┊  ┊15┊        'User must be logged-in to create a new chat');
+┊  ┊16┊    }
+┊  ┊17┊
+┊  ┊18┊    check(receiverId, nonEmptyString);
+┊  ┊19┊
+┊  ┊20┊    if (receiverId === this.userId) {
+┊  ┊21┊      throw new Meteor.Error('illegal-receiver',
+┊  ┊22┊        'Receiver must be different than the current logged in user');
+┊  ┊23┊    }
+┊  ┊24┊
+┊  ┊25┊    const chatExists = !!Chats.collection.find({
+┊  ┊26┊      memberIds: { $all: [this.userId, receiverId] }
+┊  ┊27┊    }).count();
+┊  ┊28┊
+┊  ┊29┊    if (chatExists) {
+┊  ┊30┊      throw new Meteor.Error('chat-exists',
+┊  ┊31┊        'Chat already exists');
+┊  ┊32┊    }
+┊  ┊33┊
+┊  ┊34┊    const chat = {
+┊  ┊35┊      memberIds: [this.userId, receiverId]
+┊  ┊36┊    };
+┊  ┊37┊
+┊  ┊38┊    Chats.insert(chat);
+┊  ┊39┊  },
+┊  ┊40┊
 ┊12┊41┊  updateProfile(profile: Profile): void {
 ┊13┊42┊    if (!this.userId) throw new Meteor.Error('unauthorized',
 ┊14┊43┊      'User must be logged-in to create a new chat');
```
[}]: #

As you can see, a chat is inserted with an additional `memberIds` field. Whenever we have such a change we should update the model's schema accordingly, in this case we're talking about adding the `memberIds` field, like so:

[{]: <helper> (diff_step 8.11)
#### Step 8.11: Add memberIds field

##### Changed imports/models.ts
```diff
@@ -16,6 +16,7 @@
 ┊16┊16┊  title?: string;
 ┊17┊17┊  picture?: string;
 ┊18┊18┊  lastMessage?: Message;
+┊  ┊19┊  memberIds?: string[];
 ┊19┊20┊}
 ┊20┊21┊
 ┊21┊22┊export interface Message {
```
[}]: #

Thanks to our new-chat dialog, we can create chats dynamically with no need in initial fabrication. Let's replace the chats fabrication with users fabrication in the Meteor server:

[{]: <helper> (diff_step 8.12)
#### Step 8.12: Create real user accounts

##### Changed server/main.ts
```diff
@@ -1,7 +1,7 @@
 ┊1┊1┊import { Accounts } from 'meteor/accounts-base';
 ┊2┊2┊import { Meteor } from 'meteor/meteor';
 ┊3┊3┊import * as Moment from 'moment';
-┊4┊ ┊import { Chats, Messages } from '../imports/collections';
+┊ ┊4┊import { Chats, Messages, Users } from '../imports/collections';
 ┊5┊5┊import { MessageType } from '../imports/models';
 ┊6┊6┊
 ┊7┊7┊Meteor.startup(() => {
```
```diff
@@ -10,67 +10,47 @@
 ┊10┊10┊    SMS.twilio = Meteor.settings['twilio'];
 ┊11┊11┊  }
 ┊12┊12┊
-┊13┊  ┊  if (Chats.find({}).cursor.count() === 0) {
-┊14┊  ┊    let chatId;
-┊15┊  ┊
-┊16┊  ┊    chatId = Chats.collection.insert({
-┊17┊  ┊      title: 'Ethan Gonzalez',
-┊18┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
-┊19┊  ┊    });
-┊20┊  ┊
-┊21┊  ┊    Messages.collection.insert({
-┊22┊  ┊      chatId: chatId,
-┊23┊  ┊      content: 'You on your way?',
-┊24┊  ┊      createdAt: Moment().subtract(1, 'hours').toDate(),
-┊25┊  ┊      type: MessageType.TEXT
-┊26┊  ┊    });
-┊27┊  ┊
-┊28┊  ┊    chatId = Chats.collection.insert({
-┊29┊  ┊      title: 'Bryan Wallace',
-┊30┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg'
-┊31┊  ┊    });
-┊32┊  ┊
-┊33┊  ┊    Messages.collection.insert({
-┊34┊  ┊      chatId: chatId,
-┊35┊  ┊      content: 'Hey, it\'s me',
-┊36┊  ┊      createdAt: Moment().subtract(2, 'hours').toDate(),
-┊37┊  ┊      type: MessageType.TEXT
-┊38┊  ┊    });
-┊39┊  ┊
-┊40┊  ┊    chatId = Chats.collection.insert({
-┊41┊  ┊      title: 'Avery Stewart',
-┊42┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'
-┊43┊  ┊    });
-┊44┊  ┊
-┊45┊  ┊    Messages.collection.insert({
-┊46┊  ┊      chatId: chatId,
-┊47┊  ┊      content: 'I should buy a boat',
-┊48┊  ┊      createdAt: Moment().subtract(1, 'days').toDate(),
-┊49┊  ┊      type: MessageType.TEXT
-┊50┊  ┊    });
-┊51┊  ┊
-┊52┊  ┊    chatId = Chats.collection.insert({
-┊53┊  ┊      title: 'Katie Peterson',
-┊54┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
-┊55┊  ┊    });
-┊56┊  ┊
-┊57┊  ┊    Messages.collection.insert({
-┊58┊  ┊      chatId: chatId,
-┊59┊  ┊      content: 'Look at my mukluks!',
-┊60┊  ┊      createdAt: Moment().subtract(4, 'days').toDate(),
-┊61┊  ┊      type: MessageType.TEXT
-┊62┊  ┊    });
-┊63┊  ┊
-┊64┊  ┊    chatId = Chats.collection.insert({
-┊65┊  ┊      title: 'Ray Edwards',
-┊66┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
-┊67┊  ┊    });
-┊68┊  ┊
-┊69┊  ┊    Messages.collection.insert({
-┊70┊  ┊      chatId: chatId,
-┊71┊  ┊      content: 'This is wicked good ice cream.',
-┊72┊  ┊      createdAt: Moment().subtract(2, 'weeks').toDate(),
-┊73┊  ┊      type: MessageType.TEXT
-┊74┊  ┊    });
+┊  ┊13┊  if (Users.collection.find().count() > 0) {
+┊  ┊14┊    return;
 ┊75┊15┊  }
+┊  ┊16┊
+┊  ┊17┊  Accounts.createUserWithPhone({
+┊  ┊18┊    phone: '+972540000001',
+┊  ┊19┊    profile: {
+┊  ┊20┊      name: 'Ethan Gonzalez',
+┊  ┊21┊      picture: 'https://randomuser.me/api/portraits/men/1.jpg'
+┊  ┊22┊    }
+┊  ┊23┊  });
+┊  ┊24┊
+┊  ┊25┊  Accounts.createUserWithPhone({
+┊  ┊26┊    phone: '+972540000002',
+┊  ┊27┊    profile: {
+┊  ┊28┊      name: 'Bryan Wallace',
+┊  ┊29┊      picture: 'https://randomuser.me/api/portraits/lego/1.jpg'
+┊  ┊30┊    }
+┊  ┊31┊  });
+┊  ┊32┊
+┊  ┊33┊  Accounts.createUserWithPhone({
+┊  ┊34┊    phone: '+972540000003',
+┊  ┊35┊    profile: {
+┊  ┊36┊      name: 'Avery Stewart',
+┊  ┊37┊      picture: 'https://randomuser.me/api/portraits/women/1.jpg'
+┊  ┊38┊    }
+┊  ┊39┊  });
+┊  ┊40┊
+┊  ┊41┊  Accounts.createUserWithPhone({
+┊  ┊42┊    phone: '+972540000004',
+┊  ┊43┊    profile: {
+┊  ┊44┊      name: 'Katie Peterson',
+┊  ┊45┊      picture: 'https://randomuser.me/api/portraits/women/2.jpg'
+┊  ┊46┊    }
+┊  ┊47┊  });
+┊  ┊48┊
+┊  ┊49┊  Accounts.createUserWithPhone({
+┊  ┊50┊    phone: '+972540000005',
+┊  ┊51┊    profile: {
+┊  ┊52┊      name: 'Ray Edwards',
+┊  ┊53┊      picture: 'https://randomuser.me/api/portraits/men/2.jpg'
+┊  ┊54┊    }
+┊  ┊55┊  });
 ┊76┊56┊});🚫↵
```
[}]: #

Since we've changed the data fabrication method, the chat's title and picture are not hard-coded anymore, therefore, any additional data should be fetched in the components themselves:

[{]: <helper> (diff_step 8.13)
#### Step 8.13: Implement chats with with real data

##### Changed client/imports/pages/chats/chats.ts
```diff
@@ -1,9 +1,10 @@
 ┊ 1┊ 1┊import { Component, OnInit } from '@angular/core';
 ┊ 2┊ 2┊import { NavController, PopoverController, ModalController } from 'ionic-angular';
+┊  ┊ 3┊import { MeteorObservable } from 'meteor-rxjs';
 ┊ 3┊ 4┊import * as Moment from 'moment';
-┊ 4┊  ┊import { Observable } from 'rxjs';
-┊ 5┊  ┊import { Chats, Messages } from '../../../../imports/collections';
-┊ 6┊  ┊import { Chat, MessageType } from '../../../../imports/models';
+┊  ┊ 5┊import { Observable, Subscriber } from 'rxjs';
+┊  ┊ 6┊import { Chats, Messages, Users } from '../../../../imports/collections';
+┊  ┊ 7┊import { Chat, Message, MessageType } from '../../../../imports/models';
 ┊ 7┊ 8┊import { ChatsOptionsComponent } from './chats-options';
 ┊ 8┊ 9┊import { MessagesPage } from '../messages/messages';
 ┊ 9┊10┊import template from './chats.html';
```
```diff
@@ -14,29 +15,17 @@
 ┊14┊15┊})
 ┊15┊16┊export class ChatsPage implements OnInit {
 ┊16┊17┊  chats;
+┊  ┊18┊  senderId: string;
 ┊17┊19┊
 ┊18┊20┊  constructor(
 ┊19┊21┊    private navCtrl: NavController,
 ┊20┊22┊    private popoverCtrl: PopoverController,
 ┊21┊23┊    private modalCtrl: ModalController) {
+┊  ┊24┊    this.senderId = Meteor.userId();
 ┊22┊25┊  }
 ┊23┊26┊
 ┊24┊27┊  ngOnInit() {
-┊25┊  ┊    this.chats = Chats
-┊26┊  ┊      .find({})
-┊27┊  ┊      .mergeMap((chats: Chat[]) =>
-┊28┊  ┊        Observable.combineLatest(
-┊29┊  ┊          ...chats.map((chat: Chat) =>
-┊30┊  ┊            Messages
-┊31┊  ┊              .find({chatId: chat._id})
-┊32┊  ┊              .startWith(null)
-┊33┊  ┊              .map(messages => {
-┊34┊  ┊                if (messages) chat.lastMessage = messages[0];
-┊35┊  ┊                return chat;
-┊36┊  ┊              })
-┊37┊  ┊          )
-┊38┊  ┊        )
-┊39┊  ┊      ).zone();
+┊  ┊28┊    this.chats = this.findChats();
 ┊40┊29┊  }
 ┊41┊30┊
 ┊42┊31┊  addChat(): void {
```
```diff
@@ -44,6 +33,60 @@
 ┊44┊33┊    modal.present();
 ┊45┊34┊  }
 ┊46┊35┊
+┊  ┊36┊  findChats(): Observable<Chat[]> {
+┊  ┊37┊    // Find chats and transform them
+┊  ┊38┊    return Chats.find().map(chats => {
+┊  ┊39┊      chats.forEach(chat => {
+┊  ┊40┊        chat.title = '';
+┊  ┊41┊        chat.picture = '';
+┊  ┊42┊
+┊  ┊43┊        const receiverId = chat.memberIds.find(memberId => memberId !== this.senderId);
+┊  ┊44┊        const receiver = Users.findOne(receiverId);
+┊  ┊45┊
+┊  ┊46┊        if (receiver) {
+┊  ┊47┊          chat.title = receiver.profile.name;
+┊  ┊48┊          chat.picture = receiver.profile.picture;
+┊  ┊49┊        }
+┊  ┊50┊
+┊  ┊51┊        // This will make the last message reactive
+┊  ┊52┊        this.findLastChatMessage(chat._id).subscribe((message) => {
+┊  ┊53┊          chat.lastMessage = message;
+┊  ┊54┊        });
+┊  ┊55┊      });
+┊  ┊56┊
+┊  ┊57┊      return chats;
+┊  ┊58┊    });
+┊  ┊59┊  }
+┊  ┊60┊
+┊  ┊61┊  findLastChatMessage(chatId: string): Observable<Message> {
+┊  ┊62┊    return Observable.create((observer: Subscriber<Message>) => {
+┊  ┊63┊      const chatExists = () => !!Chats.findOne(chatId);
+┊  ┊64┊
+┊  ┊65┊      // Re-compute until chat is removed
+┊  ┊66┊      MeteorObservable.autorun().takeWhile(chatExists).subscribe(() => {
+┊  ┊67┊        Messages.find({ chatId }, {
+┊  ┊68┊          sort: { createdAt: -1 }
+┊  ┊69┊        }).subscribe({
+┊  ┊70┊          next: (messages) => {
+┊  ┊71┊            // Invoke subscription with the last message found
+┊  ┊72┊            if (!messages.length) {
+┊  ┊73┊              return;
+┊  ┊74┊            }
+┊  ┊75┊
+┊  ┊76┊            const lastMessage = messages[0];
+┊  ┊77┊            observer.next(lastMessage);
+┊  ┊78┊          },
+┊  ┊79┊          error: (e) => {
+┊  ┊80┊            observer.error(e);
+┊  ┊81┊          },
+┊  ┊82┊          complete: () => {
+┊  ┊83┊            observer.complete();
+┊  ┊84┊          }
+┊  ┊85┊        });
+┊  ┊86┊      });
+┊  ┊87┊    });
+┊  ┊88┊  }
+┊  ┊89┊
 ┊47┊90┊  showMessages(chat): void {
 ┊48┊91┊    this.navCtrl.push(MessagesPage, {chat});
 ┊49┊92┊  }
```
[}]: #

Now we want our changes to take effect. We will reset the database so next time we run our `Meteor` server the users will be fabricated. To reset the database, first make sure the `Meteor` server is stopped , and then type the following command:

    $ meteor reset

Now, as soon as you start the server, new users should be fabricated and inserted into the database:

    $ npm run start
[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step7.md) | [Next Step >](step9.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #