[{]: <region> (header)
# Step 9: Privacy & Subscriptions
[}]: #
[{]: <region> (body)
In this step we gonna take care of the app's security and encapsulation, since we don't want the users to do whatever they want, and we don't want them to be able to see content which is irrelevant for them.

We gonna start by removing a `Meteor` package named `insecure`. This package provides the client with the ability to run collection mutation methods. This is a behavior we are not interested in since removing data and creating data should be done in the server and only after certain validations. `Meteor` includes this package by default only for development purposes and it should be removed once our app is ready for production. As said, we will remove this package by typing the following command:

    $ meteor remove insecure

## Secured Mutations

Since we enabled restrictions to run certain operations on data-collections directly from the client, we will need to define a method on the server which will handle each of these. By calling these methods, we will be able to manipulate the data the way we want, but not directly. The first method we're going to take care of would be the `removeChat` method, which will handle, obviously, chat removals by given ID:

[{]: <helper> (diff_step 9.2)
#### Step 9.2: Add removeChat method

##### Changed server/methods.ts
```diff
@@ -38,6 +38,24 @@
 ┊38┊38┊    Chats.insert(chat);
 ┊39┊39┊  },
 ┊40┊40┊
+┊  ┊41┊  removeChat(chatId: string): void {
+┊  ┊42┊    if (!this.userId) {
+┊  ┊43┊      throw new Meteor.Error('unauthorized',
+┊  ┊44┊        'User must be logged-in to remove chat');
+┊  ┊45┊    }
+┊  ┊46┊
+┊  ┊47┊    check(chatId, nonEmptyString);
+┊  ┊48┊
+┊  ┊49┊    const chatExists = !!Chats.collection.find(chatId).count();
+┊  ┊50┊
+┊  ┊51┊    if (!chatExists) {
+┊  ┊52┊      throw new Meteor.Error('chat-not-exists',
+┊  ┊53┊        'Chat doesn\'t exist');
+┊  ┊54┊    }
+┊  ┊55┊
+┊  ┊56┊    Chats.remove(chatId);
+┊  ┊57┊  },
+┊  ┊58┊
 ┊41┊59┊  updateProfile(profile: Profile): void {
 ┊42┊60┊    if (!this.userId) throw new Meteor.Error('unauthorized',
 ┊43┊61┊      'User must be logged-in to create a new chat');
```
[}]: #

We will carefully replace the removal method invocation in the `ChatsPage` with the method we've just defined:

[{]: <helper> (diff_step 9.3)
#### Step 9.3: Use removeChat on client side

##### Changed client/imports/pages/chats/chats.ts
```diff
@@ -1,5 +1,5 @@
 ┊1┊1┊import { Component, OnInit } from '@angular/core';
-┊2┊ ┊import { NavController, PopoverController, ModalController } from 'ionic-angular';
+┊ ┊2┊import { NavController, PopoverController, ModalController, AlertController } from 'ionic-angular';
 ┊3┊3┊import { MeteorObservable } from 'meteor-rxjs';
 ┊4┊4┊import * as Moment from 'moment';
 ┊5┊5┊import { Observable, Subscriber } from 'rxjs';
```
```diff
@@ -20,7 +20,8 @@
 ┊20┊20┊  constructor(
 ┊21┊21┊    private navCtrl: NavController,
 ┊22┊22┊    private popoverCtrl: PopoverController,
-┊23┊  ┊    private modalCtrl: ModalController) {
+┊  ┊23┊    private modalCtrl: ModalController,
+┊  ┊24┊    private alertCtrl: AlertController) {
 ┊24┊25┊    this.senderId = Meteor.userId();
 ┊25┊26┊  }
 ┊26┊27┊
```
```diff
@@ -92,8 +93,25 @@
 ┊ 92┊ 93┊  }
 ┊ 93┊ 94┊
 ┊ 94┊ 95┊  removeChat(chat: Chat): void {
-┊ 95┊   ┊    Chats.remove({_id: chat._id}).subscribe(() => {
+┊   ┊ 96┊    MeteorObservable.call('removeChat', chat._id).subscribe({
+┊   ┊ 97┊      error: (e: Error) => {
+┊   ┊ 98┊        if (e) {
+┊   ┊ 99┊          this.handleError(e);
+┊   ┊100┊        }
+┊   ┊101┊      }
+┊   ┊102┊    });
+┊   ┊103┊  }
+┊   ┊104┊
+┊   ┊105┊  handleError(e: Error): void {
+┊   ┊106┊    console.error(e);
+┊   ┊107┊
+┊   ┊108┊    const alert = this.alertCtrl.create({
+┊   ┊109┊      buttons: ['OK'],
+┊   ┊110┊      message: e.message,
+┊   ┊111┊      title: 'Oops!'
 ┊ 96┊112┊    });
+┊   ┊113┊
+┊   ┊114┊    alert.present();
 ┊ 97┊115┊  }
 ┊ 98┊116┊
 ┊ 99┊117┊  showOptions(): void {
```
[}]: #

In the `MessagesPage` we have options icon presented as three periods at the right side of the navigation bar. We will now implement this option menu which should pop-over once clicked. We will start by implementing its corresponding component called `MessagesOptionsComponent`, along with its view-template, style-sheet, and necessary importations:

[{]: <helper> (diff_step 9.4)
#### Step 9.4: Add message options component

##### Added client/imports/pages/messages/messages-options.ts
```diff
@@ -0,0 +1,76 @@
+┊  ┊ 1┊import { Component } from '@angular/core';
+┊  ┊ 2┊import { AlertController, NavController, NavParams, ViewController } from 'ionic-angular';
+┊  ┊ 3┊import { MeteorObservable } from 'meteor-rxjs';
+┊  ┊ 4┊import { ChatsPage } from '../chats/chats';
+┊  ┊ 5┊import template from './messages-options.html';
+┊  ┊ 6┊
+┊  ┊ 7┊@Component({
+┊  ┊ 8┊  template
+┊  ┊ 9┊})
+┊  ┊10┊export class MessagesOptionsComponent {
+┊  ┊11┊  constructor(
+┊  ┊12┊    public alertCtrl: AlertController,
+┊  ┊13┊    public navCtrl: NavController,
+┊  ┊14┊    public params: NavParams,
+┊  ┊15┊    public viewCtrl: ViewController
+┊  ┊16┊  ) {}
+┊  ┊17┊
+┊  ┊18┊  remove(): void {
+┊  ┊19┊    const alert = this.alertCtrl.create({
+┊  ┊20┊      title: 'Remove',
+┊  ┊21┊      message: 'Are you sure you would like to proceed?',
+┊  ┊22┊      buttons: [
+┊  ┊23┊        {
+┊  ┊24┊          text: 'Cancel',
+┊  ┊25┊          role: 'cancel'
+┊  ┊26┊        },
+┊  ┊27┊        {
+┊  ┊28┊          text: 'Yes',
+┊  ┊29┊          handler: () => {
+┊  ┊30┊            this.handleRemove(alert);
+┊  ┊31┊            return false;
+┊  ┊32┊          }
+┊  ┊33┊        }
+┊  ┊34┊      ]
+┊  ┊35┊    });
+┊  ┊36┊
+┊  ┊37┊    this.viewCtrl.dismiss().then(() => {
+┊  ┊38┊      alert.present();
+┊  ┊39┊    });
+┊  ┊40┊  }
+┊  ┊41┊
+┊  ┊42┊  handleRemove(alert): void {
+┊  ┊43┊    MeteorObservable.call('removeChat', this.params.get('chat')._id).subscribe({
+┊  ┊44┊      next: () => {
+┊  ┊45┊        alert.dismiss().then(() => {
+┊  ┊46┊          this.navCtrl.setRoot(ChatsPage, {}, {
+┊  ┊47┊            animate: true
+┊  ┊48┊          });
+┊  ┊49┊        });
+┊  ┊50┊      },
+┊  ┊51┊      error: (e: Error) => {
+┊  ┊52┊        alert.dismiss().then(() => {
+┊  ┊53┊          if (e) {
+┊  ┊54┊            return this.handleError(e);
+┊  ┊55┊          }
+┊  ┊56┊
+┊  ┊57┊          this.navCtrl.setRoot(ChatsPage, {}, {
+┊  ┊58┊            animate: true
+┊  ┊59┊          });
+┊  ┊60┊        });
+┊  ┊61┊      }
+┊  ┊62┊    });
+┊  ┊63┊  }
+┊  ┊64┊
+┊  ┊65┊  handleError(e: Error): void {
+┊  ┊66┊    console.error(e);
+┊  ┊67┊
+┊  ┊68┊    const alert = this.alertCtrl.create({
+┊  ┊69┊      title: 'Oops!',
+┊  ┊70┊      message: e.message,
+┊  ┊71┊      buttons: ['OK']
+┊  ┊72┊    });
+┊  ┊73┊
+┊  ┊74┊    alert.present();
+┊  ┊75┊  }
+┊  ┊76┊}🚫↵
```
[}]: #

[{]: <helper> (diff_step 9.5)
#### Step 9.5: Add messages options template

##### Added client/imports/pages/messages/messages-options.html
```diff
@@ -0,0 +1,8 @@
+┊ ┊1┊<ion-content class="chats-options-page-content">
+┊ ┊2┊  <ion-list class="options">
+┊ ┊3┊    <button ion-item class="option option-remove" (click)="remove()">
+┊ ┊4┊      <ion-icon name="trash" class="option-icon"></ion-icon>
+┊ ┊5┊      <div class="option-name">Remove</div>
+┊ ┊6┊    </button>
+┊ ┊7┊  </ion-list>
+┊ ┊8┊</ion-content>🚫↵
```
[}]: #

[{]: <helper> (diff_step 9.6)
#### Step 9.6: Add message options styles

##### Added client/imports/pages/messages/messages-options.scss
```diff
@@ -0,0 +1,13 @@
+┊  ┊ 1┊.chats-options-page-content {
+┊  ┊ 2┊  .options {
+┊  ┊ 3┊    margin: 0;
+┊  ┊ 4┊  }
+┊  ┊ 5┊
+┊  ┊ 6┊  .option-name {
+┊  ┊ 7┊    float: left;
+┊  ┊ 8┊  }
+┊  ┊ 9┊
+┊  ┊10┊  .option-icon {
+┊  ┊11┊    float: right;
+┊  ┊12┊  }
+┊  ┊13┊}🚫↵
```

##### Changed client/main.scss
```diff
@@ -10,5 +10,6 @@
 ┊10┊10┊@import "imports/pages/chats/chats-options";
 ┊11┊11┊@import "imports/pages/login/login";
 ┊12┊12┊@import "imports/pages/messages/messages";
+┊  ┊13┊@import "imports/pages/messages/messages-options";
 ┊13┊14┊@import "imports/pages/profile/profile";
 ┊14┊15┊@import "imports/pages/verification/verification";
```
[}]: #

[{]: <helper> (diff_step 9.7)
#### Step 9.7: Import messages options component

##### Changed client/imports/app/app.module.ts
```diff
@@ -6,6 +6,7 @@
 ┊ 6┊ 6┊import { NewChatComponent } from '../pages/chats/new-chat';
 ┊ 7┊ 7┊import { LoginPage } from '../pages/login/login';
 ┊ 8┊ 8┊import { MessagesPage } from '../pages/messages/messages';
+┊  ┊ 9┊import { MessagesOptionsComponent } from '../pages/messages/messages-options';
 ┊ 9┊10┊import { ProfilePage } from '../pages/profile/profile';
 ┊10┊11┊import { VerificationPage } from '../pages/verification/verification';
 ┊11┊12┊import { PhoneService } from '../services/phone';
```
```diff
@@ -20,7 +21,8 @@
 ┊20┊21┊    VerificationPage,
 ┊21┊22┊    ProfilePage,
 ┊22┊23┊    ChatsOptionsComponent,
-┊23┊  ┊    NewChatComponent
+┊  ┊24┊    NewChatComponent,
+┊  ┊25┊    MessagesOptionsComponent
 ┊24┊26┊  ],
 ┊25┊27┊  imports: [
 ┊26┊28┊    IonicModule.forRoot(MyApp),
```
```diff
@@ -35,7 +37,8 @@
 ┊35┊37┊    VerificationPage,
 ┊36┊38┊    ProfilePage,
 ┊37┊39┊    ChatsOptionsComponent,
-┊38┊  ┊    NewChatComponent
+┊  ┊40┊    NewChatComponent,
+┊  ┊41┊    MessagesOptionsComponent
 ┊39┊42┊  ],
 ┊40┊43┊  providers: [
 ┊41┊44┊    { provide: ErrorHandler, useClass: IonicErrorHandler },
```
[}]: #

Now that the component is ready, we will implement the handler in the `MessagesPage` which will actually show it, using the `PopoverController`:

[{]: <helper> (diff_step 9.8)
#### Step 9.8: Implemente showOptions method

##### Changed client/imports/pages/messages/messages.ts
```diff
@@ -1,11 +1,12 @@
 ┊ 1┊ 1┊import { Component, OnDestroy, OnInit, ElementRef } from '@angular/core';
-┊ 2┊  ┊import { NavParams } from 'ionic-angular';
+┊  ┊ 2┊import { NavParams, PopoverController } from 'ionic-angular';
 ┊ 3┊ 3┊import { MeteorObservable } from 'meteor-rxjs';
 ┊ 4┊ 4┊import { _ } from 'meteor/underscore';
 ┊ 5┊ 5┊import * as Moment from 'moment';
 ┊ 6┊ 6┊import { Observable } from 'rxjs';
 ┊ 7┊ 7┊import { Messages } from '../../../../imports/collections';
 ┊ 8┊ 8┊import { Chat, Message, MessageType } from '../../../../imports/models';
+┊  ┊ 9┊import { MessagesOptionsComponent } from './messages-options';
 ┊ 9┊10┊import template from './messages.html';
 ┊10┊11┊
 ┊11┊12┊@Component({
```
```diff
@@ -23,7 +24,8 @@
 ┊23┊24┊
 ┊24┊25┊  constructor(
 ┊25┊26┊    navParams: NavParams,
-┊26┊  ┊    private el: ElementRef
+┊  ┊27┊    private el: ElementRef,
+┊  ┊28┊    private popoverCtrl: PopoverController
 ┊27┊29┊  ) {
 ┊28┊30┊    this.selectedChat = <Chat>navParams.get('chat');
 ┊29┊31┊    this.title = this.selectedChat.title;
```
```diff
@@ -57,6 +59,16 @@
 ┊57┊59┊    this.messagesDayGroups = this.findMessagesDayGroups();
 ┊58┊60┊  }
 ┊59┊61┊
+┊  ┊62┊  showOptions(): void {
+┊  ┊63┊    const popover = this.popoverCtrl.create(MessagesOptionsComponent, {
+┊  ┊64┊      chat: this.selectedChat
+┊  ┊65┊    }, {
+┊  ┊66┊      cssClass: 'options-popover messages-options-popover'
+┊  ┊67┊    });
+┊  ┊68┊
+┊  ┊69┊    popover.present();
+┊  ┊70┊  }
+┊  ┊71┊
 ┊60┊72┊  findMessagesDayGroups() {
 ┊61┊73┊    return Messages.find({
 ┊62┊74┊      chatId: this.selectedChat._id
```
[}]: #

And we will bind the handler for the view so any time we press on the `options` button the event will be trigger the handler:

[{]: <helper> (diff_step 9.9)
#### Step 9.9: Bind showOptions to messages options button

##### Changed client/imports/pages/messages/messages.html
```diff
@@ -8,7 +8,7 @@
 ┊ 8┊ 8┊
 ┊ 9┊ 9┊    <ion-buttons end>
 ┊10┊10┊      <button ion-button icon-only class="attach-button"><ion-icon name="attach"></ion-icon></button>
-┊11┊  ┊      <button ion-button icon-only class="options-button"><ion-icon name="more"></ion-icon></button>
+┊  ┊11┊      <button ion-button icon-only class="options-button" (click)="showOptions()"><ion-icon name="more"></ion-icon></button>
 ┊12┊12┊    </ion-buttons>
 ┊13┊13┊  </ion-navbar>
 ┊14┊14┊</ion-header>
```
[}]: #

Right now all the chats are published to all the clients which is not very good for privacy, and it's inefficient since the entire data-base is being fetched automatically rather than fetching only the data which is necessary for the current view. This behavior occurs because of a `Meteor` package, which is installed by default for development purposes, called `autopublish`. To get rid of the auto-publishing behavior we will need to get rid of the `autopublish` package as well:

    $ meteor remove autopublish

This requires us to explicitly define our publications. We will start with the `users` publication which will be used in the `NewChatComponent` to fetch all the users who we can potentially chat with:

[{]: <helper> (diff_step 9.11)
#### Step 9.11: Add users publication

##### Added server/publications.ts
```diff
@@ -0,0 +1,16 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { Mongo } from 'meteor/mongo';
+┊  ┊ 3┊import { Users } from '../imports/collections';
+┊  ┊ 4┊import { User } from '../imports/models';
+┊  ┊ 5┊
+┊  ┊ 6┊Meteor.publish('users', function(): Mongo.Cursor<User> {
+┊  ┊ 7┊  if (!this.userId) {
+┊  ┊ 8┊    return;
+┊  ┊ 9┊  }
+┊  ┊10┊
+┊  ┊11┊  return Users.collection.find({}, {
+┊  ┊12┊    fields: {
+┊  ┊13┊      profile: 1
+┊  ┊14┊    }
+┊  ┊15┊  });
+┊  ┊16┊});🚫↵
```
[}]: #

The second publication we're going to implement would be the `messages` publication which will be used in the `MessagesPage`:

[{]: <helper> (diff_step 9.12)
#### Step 9.12: Add messages publication

##### Changed server/publications.ts
```diff
@@ -1,7 +1,7 @@
 ┊1┊1┊import { Meteor } from 'meteor/meteor';
 ┊2┊2┊import { Mongo } from 'meteor/mongo';
-┊3┊ ┊import { Users } from '../imports/collections';
-┊4┊ ┊import { User } from '../imports/models';
+┊ ┊3┊import { Messages, Users } from '../imports/collections';
+┊ ┊4┊import { Message, User } from '../imports/models';
 ┊5┊5┊
 ┊6┊6┊Meteor.publish('users', function(): Mongo.Cursor<User> {
 ┊7┊7┊  if (!this.userId) {
```
```diff
@@ -13,4 +13,16 @@
 ┊13┊13┊      profile: 1
 ┊14┊14┊    }
 ┊15┊15┊  });
+┊  ┊16┊});
+┊  ┊17┊
+┊  ┊18┊Meteor.publish('messages', function(chatId: string): Mongo.Cursor<Message> {
+┊  ┊19┊  if (!this.userId || !chatId) {
+┊  ┊20┊    return;
+┊  ┊21┊  }
+┊  ┊22┊
+┊  ┊23┊  return Messages.collection.find({
+┊  ┊24┊    chatId
+┊  ┊25┊  }, {
+┊  ┊26┊    sort: { createdAt: -1 }
+┊  ┊27┊  });
 ┊16┊28┊});🚫↵
```
[}]: #

As you see, all our publications so far are only focused on fetching data from a single collection. We will now add the [publish-composite](https://atmospherejs.com/reywood/publish-composite) package which will help us implement joined collection publications:

    $ meteor add reywood:publish-composite

We will install the package's declarations as well so the compiler can recognize the extensions made in `Meteor`'s API:

    $ meteor npm install --save @types/meteor-publish-composite

And we will import the declarations by adding the following field in the `tsconfig` file:

[{]: <helper> (diff_step 9.15)
#### Step 9.15: Import @types/meteor-publish-composite

##### Changed tsconfig.json
```diff
@@ -19,7 +19,8 @@
 ┊19┊19┊    "types": [
 ┊20┊20┊      "meteor-typings",
 ┊21┊21┊      "@types/underscore",
-┊22┊  ┊      "@types/meteor-accounts-phone"
+┊  ┊22┊      "@types/meteor-accounts-phone",
+┊  ┊23┊      "@types/meteor-publish-composite"
 ┊23┊24┊    ]
 ┊24┊25┊  },
 ┊25┊26┊  "include": [
```
[}]: #

Now we will implement our first composite-publication, called `chats`. Why exactly does the `chats` publication has to count on multiple collections? That's because we're relying on multiple collections when presenting the data in the `ChatsPage`:

- **ChatsCollection** - Used to retrieve the actual information for each chat.
- **MessagesCollection** - Used to retrieve the last message for the corresponding chat.
- **UsersCollection** - Used to retrieve the receiver's information for the corresponding chat.

To implement this composite publication we will use the `Meteor.publishComposite` method:

[{]: <helper> (diff_step 9.16)
#### Step 9.16: Implement chats publication

##### Changed server/publications.ts
```diff
@@ -1,7 +1,7 @@
 ┊1┊1┊import { Meteor } from 'meteor/meteor';
 ┊2┊2┊import { Mongo } from 'meteor/mongo';
-┊3┊ ┊import { Messages, Users } from '../imports/collections';
-┊4┊ ┊import { Message, User } from '../imports/models';
+┊ ┊3┊import { Chats, Messages, Users } from '../imports/collections';
+┊ ┊4┊import { Chat, Message, User } from '../imports/models';
 ┊5┊5┊
 ┊6┊6┊Meteor.publish('users', function(): Mongo.Cursor<User> {
 ┊7┊7┊  if (!this.userId) {
```
```diff
@@ -25,4 +25,36 @@
 ┊25┊25┊  }, {
 ┊26┊26┊    sort: { createdAt: -1 }
 ┊27┊27┊  });
+┊  ┊28┊});
+┊  ┊29┊
+┊  ┊30┊Meteor.publishComposite('chats', function(): PublishCompositeConfig<Chat> {
+┊  ┊31┊  if (!this.userId) {
+┊  ┊32┊    return;
+┊  ┊33┊  }
+┊  ┊34┊
+┊  ┊35┊  return {
+┊  ┊36┊    find: () => {
+┊  ┊37┊      return Chats.collection.find({ memberIds: this.userId });
+┊  ┊38┊    },
+┊  ┊39┊
+┊  ┊40┊    children: [
+┊  ┊41┊      <PublishCompositeConfig1<Chat, Message>> {
+┊  ┊42┊        find: (chat) => {
+┊  ┊43┊          return Messages.collection.find({ chatId: chat._id }, {
+┊  ┊44┊            sort: { createdAt: -1 },
+┊  ┊45┊            limit: 1
+┊  ┊46┊          });
+┊  ┊47┊        }
+┊  ┊48┊      },
+┊  ┊49┊      <PublishCompositeConfig1<Chat, User>> {
+┊  ┊50┊        find: (chat) => {
+┊  ┊51┊          return Users.collection.find({
+┊  ┊52┊            _id: { $in: chat.memberIds }
+┊  ┊53┊          }, {
+┊  ┊54┊            fields: { profile: 1 }
+┊  ┊55┊          });
+┊  ┊56┊        }
+┊  ┊57┊      }
+┊  ┊58┊    ]
+┊  ┊59┊  };
 ┊28┊60┊});🚫↵
```
[}]: #

The `chats` publication is made out of several nodes, which are structured according to the list above.

We finished with all the necessary publications for now, all is left to do is using them. The usages of these publications are called `subscriptions`, so whenever we subscribe to a publication, we will fetch the data exported by it, and then we can run queries of this data in our client, as we desire.

The first subscription we're going to make would be the `users` subscription in the `NewChatComponent`, so whenever we open the dialog a subscription should be made:

[{]: <helper> (diff_step 9.17)
#### Step 9.17: Subscribe to users

##### Changed client/imports/pages/chats/new-chat.ts
```diff
@@ -40,7 +40,13 @@
 ┊40┊40┊  }
 ┊41┊41┊
 ┊42┊42┊  loadUsers(): void {
-┊43┊  ┊    this.users = this.findUsers();
+┊  ┊43┊    // Fetch all users matching search pattern
+┊  ┊44┊    const subscription = MeteorObservable.subscribe('users');
+┊  ┊45┊    const autorun = MeteorObservable.autorun();
+┊  ┊46┊
+┊  ┊47┊    Observable.merge(subscription, autorun).subscribe(() => {
+┊  ┊48┊      this.users = this.findUsers();
+┊  ┊49┊    });
 ┊44┊50┊  }
 ┊45┊51┊
 ┊46┊52┊  findUsers(): Observable<User[]> {
```
[}]: #

The second subscription we're going to define would be the `chats` subscription in the `ChatsPage`, this way we will have the necessary data to work with when presenting the users we're chatting with:

[{]: <helper> (diff_step 9.18)
#### Step 9.18: Subscribe to chats

##### Changed client/imports/pages/chats/chats.ts
```diff
@@ -26,7 +26,11 @@
 ┊26┊26┊  }
 ┊27┊27┊
 ┊28┊28┊  ngOnInit() {
-┊29┊  ┊    this.chats = this.findChats();
+┊  ┊29┊    MeteorObservable.subscribe('chats').subscribe(() => {
+┊  ┊30┊      MeteorObservable.autorun().subscribe(() => {
+┊  ┊31┊        this.chats = this.findChats();
+┊  ┊32┊      });
+┊  ┊33┊    });
 ┊30┊34┊  }
 ┊31┊35┊
 ┊32┊36┊  addChat(): void {
```
[}]: #

The `messages` publication is responsible for bringing all the relevant messages for a certain chat. Unlike the other two publications, this publication is actually parameterized and it requires us to pass a chat id during subscription. Let's subscribe to the `messages` publication in the `MessagesPage`, and pass the current active chat ID provided to us by the navigation parameters:

[{]: <helper> (diff_step 9.19)
#### Step 9.19: Subscribe to messages

##### Changed client/imports/pages/messages/messages.ts
```diff
@@ -3,7 +3,7 @@
 ┊3┊3┊import { MeteorObservable } from 'meteor-rxjs';
 ┊4┊4┊import { _ } from 'meteor/underscore';
 ┊5┊5┊import * as Moment from 'moment';
-┊6┊ ┊import { Observable } from 'rxjs';
+┊ ┊6┊import { Observable, Subscription } from 'rxjs';
 ┊7┊7┊import { Messages } from '../../../../imports/collections';
 ┊8┊8┊import { Chat, Message, MessageType } from '../../../../imports/models';
 ┊9┊9┊import { MessagesOptionsComponent } from './messages-options';
```
```diff
@@ -21,6 +21,8 @@
 ┊21┊21┊  autoScroller: MutationObserver;
 ┊22┊22┊  scrollOffset = 0;
 ┊23┊23┊  senderId: string;
+┊  ┊24┊  loadingMessages: boolean;
+┊  ┊25┊  messagesComputation: Subscription;
 ┊24┊26┊
 ┊25┊27┊  constructor(
 ┊26┊28┊    navParams: NavParams,
```
```diff
@@ -54,9 +56,32 @@
 ┊54┊56┊    this.autoScroller.disconnect();
 ┊55┊57┊  }
 ┊56┊58┊
-┊57┊  ┊  subscribeMessages() {
+┊  ┊59┊  // Subscribes to the relevant set of messages
+┊  ┊60┊  subscribeMessages(): void {
+┊  ┊61┊    // A flag which indicates if there's a subscription in process
+┊  ┊62┊    this.loadingMessages = true;
+┊  ┊63┊    // A custom offset to be used to re-adjust the scrolling position once
+┊  ┊64┊    // new dataset is fetched
 ┊58┊65┊    this.scrollOffset = this.scroller.scrollHeight;
-┊59┊  ┊    this.messagesDayGroups = this.findMessagesDayGroups();
+┊  ┊66┊
+┊  ┊67┊    MeteorObservable.subscribe('messages',
+┊  ┊68┊      this.selectedChat._id
+┊  ┊69┊    ).subscribe(() => {
+┊  ┊70┊      // Keep tracking changes in the dataset and re-render the view
+┊  ┊71┊      if (!this.messagesComputation) {
+┊  ┊72┊        this.messagesComputation = this.autorunMessages();
+┊  ┊73┊      }
+┊  ┊74┊
+┊  ┊75┊      // Allow incoming subscription requests
+┊  ┊76┊      this.loadingMessages = false;
+┊  ┊77┊    });
+┊  ┊78┊  }
+┊  ┊79┊
+┊  ┊80┊  // Detects changes in the messages dataset and re-renders the view
+┊  ┊81┊  autorunMessages(): Subscription {
+┊  ┊82┊    return MeteorObservable.autorun().subscribe(() => {
+┊  ┊83┊      this.messagesDayGroups = this.findMessagesDayGroups();
+┊  ┊84┊    });
 ┊60┊85┊  }
 ┊61┊86┊
 ┊62┊87┊  showOptions(): void {
```
```diff
@@ -114,6 +139,11 @@
 ┊114┊139┊  }
 ┊115┊140┊
 ┊116┊141┊  scrollDown(): void {
+┊   ┊142┊    // Don't scroll down if messages subscription is being loaded
+┊   ┊143┊    if (this.loadingMessages) {
+┊   ┊144┊      return;
+┊   ┊145┊    }
+┊   ┊146┊
 ┊117┊147┊    // Scroll down and apply specified offset
 ┊118┊148┊    this.scroller.scrollTop = this.scroller.scrollHeight - this.scrollOffset;
 ┊119┊149┊    // Zero offset for next invocation
```
[}]: #
[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step8.md) | [Next Step >](step10.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #