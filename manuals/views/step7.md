# Step 7: Privacy &amp; security

In this step we gonna take care of the app's security and encapsulation, since we don't want the users to do whatever they want, and we don't want them to be able to see content which is irrelevant for them.

We gonna start by removing a Meteor package named `insecure`.

This package provides the client with the ability to run collection mutation methods. This is a behavior we are not intrested in since removing data and creating data should be done in the server and only after certain validations.

Meteor includes this package by default only for development purposes and it should be removed once our app is ready for production.

So let's remove this package by running this command:

    $ meteor remove insecure

With that we're able to add ability to remove chats:

[{]: <helper> (diff_step 7.2)
#### Step 7.2: Define 'removeChat' Method

##### Changed server/imports/methods/methods.ts
```diff
@@ -45,6 +45,20 @@
 ┊45┊45┊ 
 ┊46┊46┊    Chats.insert(chat);
 ┊47┊47┊  },
+┊  ┊48┊  removeChat(chatId: string): void {
+┊  ┊49┊    if (!this.userId) throw new Meteor.Error('unauthorized',
+┊  ┊50┊      'User must be logged-in to remove chat');
+┊  ┊51┊ 
+┊  ┊52┊    check(chatId, nonEmptyString);
+┊  ┊53┊ 
+┊  ┊54┊    const chatExists = !!Chats.collection.find(chatId).count();
+┊  ┊55┊ 
+┊  ┊56┊    if (!chatExists) throw new Meteor.Error('chat-not-exists',
+┊  ┊57┊      'Chat doesn\'t exist');
+┊  ┊58┊ 
+┊  ┊59┊    Messages.remove({chatId});
+┊  ┊60┊    Chats.remove(chatId);
+┊  ┊61┊  },
 ┊48┊62┊  addMessage(chatId: string, content: string): void {
 ┊49┊63┊    if (!this.userId) throw new Meteor.Error('unauthorized',
 ┊50┊64┊      'User must be logged-in to create a new chat');
```
[}]: #

We have a Method, now we have to implement it in the UI.

Each chat has two buttons, one for sending attachements and one to open options menu.

Let's create that menu by creating a new component called `MessagesOptionsComponent`:

[{]: <helper> (diff_step 7.3)
#### Step 7.3: Create MessagesOptionsComponent

##### Added client/imports/pages/chat/messages-options.component.ts
```diff
@@ -0,0 +1,80 @@
+┊  ┊ 1┊import {Component} from '@angular/core';
+┊  ┊ 2┊import {NavParams, NavController, ViewController, AlertController} from 'ionic-angular';
+┊  ┊ 3┊import {Meteor} from 'meteor/meteor';
+┊  ┊ 4┊import {MeteorObservable} from 'meteor-rxjs';
+┊  ┊ 5┊import template from './messages-options.component.html';
+┊  ┊ 6┊import style from "./messages-options.component.scss";
+┊  ┊ 7┊import {TabsContainerComponent} from '../tabs-container/tabs-container.component';
+┊  ┊ 8┊ 
+┊  ┊ 9┊@Component({
+┊  ┊10┊  selector: 'messages-options',
+┊  ┊11┊  template,
+┊  ┊12┊  styles: [
+┊  ┊13┊    style
+┊  ┊14┊  ]
+┊  ┊15┊})
+┊  ┊16┊export class MessagesOptionsComponent {
+┊  ┊17┊  constructor(
+┊  ┊18┊    private navCtrl: NavController, 
+┊  ┊19┊    private viewCtrl: ViewController,
+┊  ┊20┊    private alertCtrl: AlertController,
+┊  ┊21┊    private params: NavParams
+┊  ┊22┊  ) {}
+┊  ┊23┊ 
+┊  ┊24┊  remove(): void {
+┊  ┊25┊    const alert = this.alertCtrl.create({
+┊  ┊26┊      title: 'Remove',
+┊  ┊27┊      message: 'Are you sure you would like to proceed?',
+┊  ┊28┊      buttons: [
+┊  ┊29┊        {
+┊  ┊30┊          text: 'Cancel',
+┊  ┊31┊          role: 'cancel'
+┊  ┊32┊        },
+┊  ┊33┊        {
+┊  ┊34┊          text: 'Yes',
+┊  ┊35┊          handler: () => {
+┊  ┊36┊            this.handleRemove(alert);
+┊  ┊37┊            return false;
+┊  ┊38┊          }
+┊  ┊39┊        }
+┊  ┊40┊      ]
+┊  ┊41┊    });
+┊  ┊42┊ 
+┊  ┊43┊    this.viewCtrl.dismiss().then(() => {
+┊  ┊44┊      alert.present();
+┊  ┊45┊    });
+┊  ┊46┊  }
+┊  ┊47┊ 
+┊  ┊48┊  private handleRemove(alert): void {
+┊  ┊49┊    MeteorObservable.call('removeChat', this.params.get('chat')._id).subscribe({
+┊  ┊50┊      next: () => {
+┊  ┊51┊        alert.dismiss().then(() => {
+┊  ┊52┊          this.navCtrl.setRoot(TabsContainerComponent, {}, {
+┊  ┊53┊            animate: true
+┊  ┊54┊          });
+┊  ┊55┊        });
+┊  ┊56┊      },
+┊  ┊57┊      error: (e: Error) => {
+┊  ┊58┊        alert.dismiss().then(() => {
+┊  ┊59┊          if (e) return this.handleError(e);
+┊  ┊60┊  
+┊  ┊61┊          this.navCtrl.setRoot(TabsContainerComponent, {}, {
+┊  ┊62┊            animate: true
+┊  ┊63┊          });
+┊  ┊64┊        });
+┊  ┊65┊      }
+┊  ┊66┊    });
+┊  ┊67┊  }
+┊  ┊68┊ 
+┊  ┊69┊  private handleError(e: Error): void {
+┊  ┊70┊    console.error(e);
+┊  ┊71┊ 
+┊  ┊72┊    const alert = this.alertCtrl.create({
+┊  ┊73┊      title: 'Oops!',
+┊  ┊74┊      message: e.message,
+┊  ┊75┊      buttons: ['OK']
+┊  ┊76┊    });
+┊  ┊77┊ 
+┊  ┊78┊    alert.present();
+┊  ┊79┊  }
+┊  ┊80┊}🚫↵
```
[}]: #

[{]: <helper> (diff_step 7.4)
#### Step 7.4: Create a template

##### Added client/imports/pages/chat/messages-options.component.html
```diff
@@ -0,0 +1,8 @@
+┊ ┊1┊<ion-content class="chats-options-page-content">
+┊ ┊2┊  <ion-list class="options">
+┊ ┊3┊    <button ion-item class="option option-remove" (click)="remove()">
+┊ ┊4┊      <ion-icon name="remove" class="option-icon"></ion-icon>
+┊ ┊5┊      <div class="option-name">Remove</div>
+┊ ┊6┊    </button>
+┊ ┊7┊  </ion-list>
+┊ ┊8┊</ion-content>🚫↵
```
[}]: #

[{]: <helper> (diff_step 7.5)
#### Step 7.5: Add styles

##### Added client/imports/pages/chat/messages-options.component.scss
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
[}]: #

[{]: <helper> (diff_step 7.6)
#### Step 7.6: Register the component

##### Changed client/imports/app/app.module.ts
```diff
@@ -10,6 +10,7 @@
 ┊10┊10┊import {ProfileComponent} from '../pages/auth/profile.component';
 ┊11┊11┊import {ChatsOptionsComponent} from '../pages/chats/chats-options.component';
 ┊12┊12┊import {NewChatComponent} from '../pages/chats/new-chat.component';
+┊  ┊13┊import {MessagesOptionsComponent} from '../pages/chat/messages-options.component';
 ┊13┊14┊
 ┊14┊15┊@NgModule({
 ┊15┊16┊  // Components, Pipes, Directive
```
```diff
@@ -22,7 +23,8 @@
 ┊22┊23┊    VerificationComponent,
 ┊23┊24┊    ProfileComponent,
 ┊24┊25┊    ChatsOptionsComponent,
-┊25┊  ┊    NewChatComponent
+┊  ┊26┊    NewChatComponent,
+┊  ┊27┊    MessagesOptionsComponent
 ┊26┊28┊  ],
 ┊27┊29┊  // Entry Components
 ┊28┊30┊  entryComponents: [
```
```diff
@@ -34,7 +36,8 @@
 ┊34┊36┊    VerificationComponent,
 ┊35┊37┊    ProfileComponent,
 ┊36┊38┊    ChatsOptionsComponent,
-┊37┊  ┊    NewChatComponent
+┊  ┊39┊    NewChatComponent,
+┊  ┊40┊    MessagesOptionsComponent
 ┊38┊41┊  ],
 ┊39┊42┊  // Providers
 ┊40┊43┊  providers: [
```
[}]: #

Great! Now we can define component's method to open the options:

[{]: <helper> (diff_step 7.7)
#### Step 7.7: Define component's method to open options

##### Changed client/imports/pages/chat/messages-page.component.ts
```diff
@@ -1,5 +1,5 @@
 ┊1┊1┊import {Component, OnInit, OnDestroy} from "@angular/core";
-┊2┊ ┊import {NavParams} from "ionic-angular";
+┊ ┊2┊import {NavParams, PopoverController} from "ionic-angular";
 ┊3┊3┊import {Meteor} from 'meteor/meteor';
 ┊4┊4┊import {Chat} from "../../../../both/models/chat.model";
 ┊5┊5┊import {Messages} from "../../../../both/collections/messages.collection";
```
```diff
@@ -7,6 +7,7 @@
 ┊ 7┊ 7┊import {Message} from "../../../../both/models/message.model";
 ┊ 8┊ 8┊import template from "./messages-page.component.html";
 ┊ 9┊ 9┊import style from "./messages-page.component.scss";
+┊  ┊10┊import {MessagesOptionsComponent} from './messages-options.component';
 ┊10┊11┊import {MeteorObservable} from "meteor-rxjs";
 ┊11┊12┊
 ┊12┊13┊@Component({
```
```diff
@@ -25,7 +26,10 @@
 ┊25┊26┊  private message = "";
 ┊26┊27┊  private autoScroller: MutationObserver;
 ┊27┊28┊
-┊28┊  ┊  constructor(navParams: NavParams) {
+┊  ┊29┊  constructor(
+┊  ┊30┊    navParams: NavParams,
+┊  ┊31┊    private popoverCtrl: PopoverController
+┊  ┊32┊  ) {
 ┊29┊33┊    this.selectedChat = <Chat>navParams.get('chat');
 ┊30┊34┊    this.title = this.selectedChat.title;
 ┊31┊35┊    this.picture = this.selectedChat.picture;
```
```diff
@@ -71,6 +75,16 @@
 ┊71┊75┊    return this.messagesList.querySelector('.scroll-content');
 ┊72┊76┊  }
 ┊73┊77┊
+┊  ┊78┊  showOptions(): void {
+┊  ┊79┊    const popover = this.popoverCtrl.create(MessagesOptionsComponent, {
+┊  ┊80┊      chat: this.selectedChat
+┊  ┊81┊    }, {
+┊  ┊82┊      cssClass: 'options-popover'
+┊  ┊83┊    });
+┊  ┊84┊
+┊  ┊85┊    popover.present();
+┊  ┊86┊  }
+┊  ┊87┊
 ┊74┊88┊  onInputKeypress({keyCode}: KeyboardEvent): void {
 ┊75┊89┊    if (keyCode == 13) {
 ┊76┊90┊      this.sendMessage();
```
[}]: #

One thing missing, add this method to the view:

[{]: <helper> (diff_step 7.8)
#### Step 7.8: Implement it in the view

##### Changed client/imports/pages/chat/messages-page.component.html
```diff
@@ -8,7 +8,7 @@
 ┊ 8┊ 8┊
 ┊ 9┊ 9┊    <ion-buttons end>
 ┊10┊10┊      <button ion-button icon-only class="attach-button"><ion-icon name="attach"></ion-icon></button>
-┊11┊  ┊      <button ion-button icon-only class="settings-button"><ion-icon name="more"></ion-icon></button>
+┊  ┊11┊      <button ion-button icon-only class="settings-button" (click)="showOptions()"><ion-icon name="more"></ion-icon></button>
 ┊12┊12┊    </ion-buttons>
 ┊13┊13┊  </ion-navbar>
 ┊14┊14┊</ion-header>
```
[}]: #

Right now all the chats are published to all the clients which is not very good for privacy. Let's fix that.

First thing we need to do inorder to stop all the automatic publication of information is to remove the `autopublish` package from the Meteor server:

    $ meteor remove autopublish

We will now add the [publish-composite](https://atmospherejs.com/reywood/publish-composite) package which will help us implement joined collection pubications.

    $ meteor add reywood:publish-composite

And we will install its belonging typings as well

    $ typings install dt~meteor-publish-composite --save --global

Now we need to explicitly define our publications. Let's start by sending the users' information.

Create a file named `users.publication.ts` under the `server/imports/publications` directory with the following contents:

[{]: <helper> (diff_step 7.12)
#### Step 7.12: Create publication for Users

##### Added server/imports/publications/users.publication.ts
```diff
@@ -0,0 +1,15 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { Mongo } from 'meteor/mongo';
+┊  ┊ 3┊
+┊  ┊ 4┊import { Users } from '../../../both/collections/users.collection';
+┊  ┊ 5┊import { User } from '../../../both/models/user.model';
+┊  ┊ 6┊
+┊  ┊ 7┊Meteor.publish('users', function(): Mongo.Cursor<User> {
+┊  ┊ 8┊  if (!this.userId) return;
+┊  ┊ 9┊ 
+┊  ┊10┊  return Users.collection.find({}, {
+┊  ┊11┊    fields: {
+┊  ┊12┊      profile: 1
+┊  ┊13┊    }
+┊  ┊14┊  });
+┊  ┊15┊});
```
[}]: #

Do the same but for `Messages`:

[{]: <helper> (diff_step 7.14)
#### Step 7.14: Add publication for Messages

##### Added server/imports/publications/messages.publication.ts
```diff
@@ -0,0 +1,12 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { Mongo } from 'meteor/mongo';
+┊  ┊ 3┊
+┊  ┊ 4┊import { Messages } from '../../../both/collections/messages.collection';
+┊  ┊ 5┊import { Message } from '../../../both/models/message.model';
+┊  ┊ 6┊
+┊  ┊ 7┊Meteor.publish('messages', function(chatId: string): Mongo.Cursor<Message> {
+┊  ┊ 8┊  if (!this.userId) return;
+┊  ┊ 9┊  if (!chatId) return;
+┊  ┊10┊ 
+┊  ┊11┊  return Messages.collection.find({chatId});
+┊  ┊12┊});
```
[}]: #

Use `Meteor.publishComposite` from the package we installed and create a publication of `Chats`:

[{]: <helper> (diff_step 7.13)
#### Step 7.13: Add publication for Chats

##### Added server/imports/publications/chats.publication.ts
```diff
@@ -0,0 +1,38 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊
+┊  ┊ 3┊import { Chats } from '../../../both/collections/chats.collection';
+┊  ┊ 4┊import { Chat } from '../../../both/models/chat.model';
+┊  ┊ 5┊import { Messages } from '../../../both/collections/messages.collection';
+┊  ┊ 6┊import { Message } from '../../../both/models/message.model';
+┊  ┊ 7┊import { Users } from '../../../both/collections/users.collection';
+┊  ┊ 8┊import { User } from '../../../both/models/user.model';
+┊  ┊ 9┊
+┊  ┊10┊Meteor.publishComposite('chats', function(): PublishCompositeConfig<Chat> {
+┊  ┊11┊  if (!this.userId) return;
+┊  ┊12┊ 
+┊  ┊13┊  return {
+┊  ┊14┊    find: () => {
+┊  ┊15┊      return Chats.collection.find({memberIds: this.userId});
+┊  ┊16┊    },
+┊  ┊17┊ 
+┊  ┊18┊    children: [
+┊  ┊19┊      <PublishCompositeConfig1<Chat, Message>> {
+┊  ┊20┊        find: (chat) => {
+┊  ┊21┊          return Messages.collection.find({chatId: chat._id}, {
+┊  ┊22┊            sort: {createdAt: -1},
+┊  ┊23┊            limit: 1
+┊  ┊24┊          });
+┊  ┊25┊        }
+┊  ┊26┊      },
+┊  ┊27┊      <PublishCompositeConfig1<Chat, User>> {
+┊  ┊28┊        find: (chat) => {
+┊  ┊29┊          return Users.collection.find({
+┊  ┊30┊            _id: {$in: chat.memberIds}
+┊  ┊31┊          }, {
+┊  ┊32┊            fields: {profile: 1}
+┊  ┊33┊          });
+┊  ┊34┊        }
+┊  ┊35┊      }
+┊  ┊36┊    ]
+┊  ┊37┊  };
+┊  ┊38┊});
```
[}]: #

The chats publication is a composite publication which is made of several nodes. First we gonna find all the relevant chats for the current user logged in. After we have the chats, we gonna return the following cursor for each chat document we found. First we gonna return all the last messages, and second we gonna return all the users we're currently chatting with.

Those publications are still not visible by server:

[{]: <helper> (diff_step 7.15)
#### Step 7.15: Expose publications

##### Changed server/main.ts
```diff
@@ -1,5 +1,8 @@
 ┊1┊1┊import { Main } from './imports/server-main/main';
 ┊2┊2┊import './imports/methods/methods';
+┊ ┊3┊import './imports/publications/chats.publication';
+┊ ┊4┊import './imports/publications/messages.publication';
+┊ ┊5┊import './imports/publications/users.publication';
 ┊3┊6┊import './imports/api/sms';
 ┊4┊7┊
 ┊5┊8┊const mainInstance = new Main();
```
[}]: #


Let's add the subscription for the chats publication in the chats component:

[{]: <helper> (diff_step 7.16)
#### Step 7.16: Subscribe to 'chats'

##### Changed client/imports/pages/chats/chats.component.ts
```diff
@@ -2,6 +2,7 @@
 ┊2┊2┊import template from "./chats.component.html"
 ┊3┊3┊import {Observable} from "rxjs";
 ┊4┊4┊import {Meteor} from 'meteor/meteor';
+┊ ┊5┊import {MeteorObservable} from 'meteor-rxjs';
 ┊5┊6┊import {Chat} from "../../../../both/models/chat.model";
 ┊6┊7┊import * as moment from "moment";
 ┊7┊8┊import style from "./chats.component.scss";
```
```diff
@@ -32,31 +33,36 @@
 ┊32┊33┊
 ┊33┊34┊  ngOnInit() {
 ┊34┊35┊    this.senderId = Meteor.userId();
-┊35┊  ┊    this.chats = Chats
-┊36┊  ┊      .find({})
-┊37┊  ┊      .mergeMap<Chat[]>(chats =>
-┊38┊  ┊        Observable.combineLatest(
-┊39┊  ┊          ...chats.map(chat =>
 ┊40┊36┊
-┊41┊  ┊            Messages.find({ chatId: chat._id }, { sort: { createdAt: -1 }, limit: 1 })
-┊42┊  ┊              .startWith(null)
-┊43┊  ┊              .map(messages => {
-┊44┊  ┊                if (messages) chat.lastMessage = messages[0];
-┊45┊  ┊                return chat;
-┊46┊  ┊              })
+┊  ┊37┊    MeteorObservable.subscribe('chats').subscribe(() => {
+┊  ┊38┊      MeteorObservable.autorun().subscribe(() => {
+┊  ┊39┊        this.chats = Chats
+┊  ┊40┊          .find({})
+┊  ┊41┊          .mergeMap<Chat[]>(chats =>
+┊  ┊42┊            Observable.combineLatest(
+┊  ┊43┊              ...chats.map(chat =>
 ┊47┊44┊
-┊48┊  ┊          )
-┊49┊  ┊        )
-┊50┊  ┊      ).map(chats => {
-┊51┊  ┊        chats.forEach(chat => {
-┊52┊  ┊          const receiver = Meteor.users.findOne(chat.memberIds.find(memberId => memberId !== this.senderId))
+┊  ┊45┊                Messages.find({ chatId: chat._id }, { sort: { createdAt: -1 }, limit: 1 })
+┊  ┊46┊                  .startWith(null)
+┊  ┊47┊                  .map(messages => {
+┊  ┊48┊                    if (messages) chat.lastMessage = messages[0];
+┊  ┊49┊                    return chat;
+┊  ┊50┊                  })
 ┊53┊51┊
-┊54┊  ┊          chat.title = receiver.profile.name;
-┊55┊  ┊          chat.picture = receiver.profile.picture;
-┊56┊  ┊        });
+┊  ┊52┊              )
+┊  ┊53┊            )
+┊  ┊54┊          ).map(chats => {
+┊  ┊55┊            chats.forEach(chat => {
+┊  ┊56┊              const receiver = Meteor.users.findOne(chat.memberIds.find(memberId => memberId !== this.senderId))
 ┊57┊57┊
-┊58┊  ┊        return chats;
-┊59┊  ┊      }).zone();
+┊  ┊58┊              chat.title = receiver.profile.name;
+┊  ┊59┊              chat.picture = receiver.profile.picture;
+┊  ┊60┊            });
+┊  ┊61┊
+┊  ┊62┊            return chats;
+┊  ┊63┊          }).zone();
+┊  ┊64┊      });
+┊  ┊65┊    });
 ┊60┊66┊  }
 ┊61┊67┊
 ┊62┊68┊  addChat(): void {
```
[}]: #

The users publication publishes all the users' profiles, and we need to use it in the new chat dialog whenever we wanna create a new chat.

Let's subscribe to the users publication in the new chat component:

[{]: <helper> (diff_step 7.17)
#### Step 7.17: Subscribe to 'users'

##### Changed client/imports/pages/chats/new-chat.component.ts
```diff
@@ -31,8 +31,10 @@
 ┊31┊31┊  }
 ┊32┊32┊
 ┊33┊33┊  ngOnInit() {
-┊34┊  ┊    MeteorObservable.autorun().zone().subscribe(() => {
-┊35┊  ┊      this.users = this.findUsers().zone();
+┊  ┊34┊    MeteorObservable.subscribe('users').subscribe(() => {
+┊  ┊35┊      MeteorObservable.autorun().subscribe(() => {
+┊  ┊36┊        this.users = this.findUsers().zone();
+┊  ┊37┊      });
 ┊36┊38┊    });
 ┊37┊39┊  }
```
[}]: #

The messages publication is responsible for bringing all the relevant messages for a certain chat. This publication is actually parameterized and it requires us to pass a chat id during subscription.

Let's subscribe to the messages publication in the messages component, and pass the current active chat id provided to us by the nav params:

[{]: <helper> (diff_step 7.18)
#### Step 7.18: Subscribe to 'messages'

##### Changed client/imports/pages/chat/messages-page.component.ts
```diff
@@ -37,15 +37,19 @@
 ┊37┊37┊  }
 ┊38┊38┊
 ┊39┊39┊  ngOnInit() {
-┊40┊  ┊    this.messages = Messages.find(
-┊41┊  ┊      {chatId: this.selectedChat._id},
-┊42┊  ┊      {sort: {createdAt: 1}}
-┊43┊  ┊    ).map((messages: Message[]) => {
-┊44┊  ┊      messages.forEach((message: Message) => {
-┊45┊  ┊        message.ownership = this.senderId == message.senderId ? 'mine' : 'other';
+┊  ┊40┊    MeteorObservable.subscribe('messages', this.selectedChat._id).subscribe(() => {
+┊  ┊41┊      MeteorObservable.autorun().subscribe(() => {
+┊  ┊42┊        this.messages = Messages.find(
+┊  ┊43┊          {chatId: this.selectedChat._id},
+┊  ┊44┊          {sort: {createdAt: 1}}
+┊  ┊45┊        ).map((messages: Message[]) => {
+┊  ┊46┊          messages.forEach((message: Message) => {
+┊  ┊47┊            message.ownership = this.senderId == message.senderId ? 'mine' : 'other';
+┊  ┊48┊          });
+┊  ┊49┊
+┊  ┊50┊          return messages;
+┊  ┊51┊        });
 ┊46┊52┊      });
-┊47┊  ┊
-┊48┊  ┊      return messages;
 ┊49┊53┊    });
 ┊50┊54┊
 ┊51┊55┊    this.autoScroller = this.autoScroll();
```
[}]: #

[{]: <helper> (nav_step next_ref="https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/summary" prev_ref="https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/chats-mutations")
| [< Previous Step](https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/chats-mutations) | [Next Step >](https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/summary) |
|:--------------------------------|--------------------------------:|
[}]: #

