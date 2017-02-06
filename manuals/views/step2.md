[{]: <region> (header)
# Step 2: Chats Page
[}]: #
[{]: <region> (body)
## First Ionic Component

Now that we're finished with the initial setup, we can start building our app.

Our app is gonna have a very clear methodology. It's gonna be made out of pages, and each page will be made out of 3 files:

- `.html` - A view template file written in `HTML` based on `Angular 2`'s new [template engine](https://angular.io/docs/ts/latest/guide/template-syntax.html).
- `.scss` - A stylesheet file written in a `CSS` pre-process language called [SASS](https://sass-lang.com).
- `.ts` - A script file written in `Typescript`.

Following this pattern, we will create our first page, starting with its component - named `ChatsPage`:

[{]: <helper> (diff_step 2.1)
#### Step 2.1: Create Chats page component

##### Added client/imports/pages/chats/chats.ts
```diff
@@ -0,0 +1,11 @@
+┊  ┊ 1┊import { Component } from '@angular/core';
+┊  ┊ 2┊import template from './chats.html';
+┊  ┊ 3┊
+┊  ┊ 4┊@Component({
+┊  ┊ 5┊  template
+┊  ┊ 6┊})
+┊  ┊ 7┊export class ChatsPage {
+┊  ┊ 8┊  constructor() {
+┊  ┊ 9┊
+┊  ┊10┊  }
+┊  ┊11┊}🚫↵
```
[}]: #

`Angular 2` uses decorators to declare `Component`s, and we use `ES2016` classes to create the actual component, and the `template` declares the template file for the component. So now let's create this template file, next to the component file:

[{]: <helper> (diff_step 2.2)
#### Step 2.2: Added chats page template

##### Added client/imports/pages/chats/chats.html
```diff
@@ -0,0 +1,11 @@
+┊  ┊ 1┊<ion-header>
+┊  ┊ 2┊  <ion-navbar>
+┊  ┊ 3┊    <ion-title>
+┊  ┊ 4┊      Chats
+┊  ┊ 5┊    </ion-title>
+┊  ┊ 6┊  </ion-navbar>
+┊  ┊ 7┊</ion-header>
+┊  ┊ 8┊
+┊  ┊ 9┊<ion-content padding>
+┊  ┊10┊  Hello!
+┊  ┊11┊</ion-content>🚫↵
```
[}]: #

Once creating an Ionic page it's recommended to use the following layout:

- &lt;ion-header&gt; - The header of the page. Will usually contain content that should be bounded to the top like navbar.
- &lt;ion-content&gt; - The content of the page. Will usually contain it's actual content like text.
- &lt;ion-footer&gt; - The footer of the page. Will usually contain content that should be bounded to the bottom like toolbars.

Now, we need to add a declaration for this new `Component` in our `NgModule` definition:

[{]: <helper> (diff_step 2.3)
#### Step 2.3: Add chats page to the NgModule

##### Changed client/imports/app/app.module.ts
```diff
@@ -1,17 +1,20 @@
 ┊ 1┊ 1┊import { NgModule, ErrorHandler } from '@angular/core';
 ┊ 2┊ 2┊import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
+┊  ┊ 3┊import { ChatsPage } from '../pages/chats/chats'
 ┊ 3┊ 4┊import { MyApp } from './app.component';
 ┊ 4┊ 5┊
 ┊ 5┊ 6┊@NgModule({
 ┊ 6┊ 7┊  declarations: [
-┊ 7┊  ┊    MyApp
+┊  ┊ 8┊    MyApp,
+┊  ┊ 9┊    ChatsPage
 ┊ 8┊10┊  ],
 ┊ 9┊11┊  imports: [
 ┊10┊12┊    IonicModule.forRoot(MyApp),
 ┊11┊13┊  ],
 ┊12┊14┊  bootstrap: [IonicApp],
 ┊13┊15┊  entryComponents: [
-┊14┊  ┊    MyApp
+┊  ┊16┊    MyApp,
+┊  ┊17┊    ChatsPage
 ┊15┊18┊  ],
 ┊16┊19┊  providers: [
 ┊17┊20┊    { provide: ErrorHandler, useClass: IonicErrorHandler }
```
[}]: #

> You can read more about [Angular 2 NgModule here](https://angular.io/docs/ts/latest/guide/ngmodule.html).

We will define the `ChatsPage` as the initial component of our app by setting the `rootPage` property in the main app component:

[{]: <helper> (diff_step 2.4)
#### Step 2.4: Use the chats page as the main root page

##### Changed client/imports/app/app.component.ts
```diff
@@ -1,12 +1,15 @@
 ┊ 1┊ 1┊import { Component } from '@angular/core';
 ┊ 2┊ 2┊import { Platform } from 'ionic-angular';
 ┊ 3┊ 3┊import { StatusBar, Splashscreen } from 'ionic-native';
+┊  ┊ 4┊import { ChatsPage } from '../pages/chats/chats';
 ┊ 4┊ 5┊import template from "./app.html";
 ┊ 5┊ 6┊
 ┊ 6┊ 7┊@Component({
 ┊ 7┊ 8┊  template
 ┊ 8┊ 9┊})
 ┊ 9┊10┊export class MyApp {
+┊  ┊11┊  rootPage = ChatsPage;
+┊  ┊12┊
 ┊10┊13┊  constructor(platform: Platform) {
 ┊11┊14┊    platform.ready().then(() => {
 ┊12┊15┊      // Okay, so the platform is ready and our plugins are available.
```
[}]: #

To make the `rootPage` visible, we will need to use the `ion-nav` component in the application's view:

[{]: <helper> (diff_step 2.5)
#### Step 2.5: Render ion-nav

##### Changed client/imports/app/app.html
```diff
@@ -1 +1 @@
-┊1┊ ┊My App🚫↵
+┊ ┊1┊<ion-nav [root]="rootPage"></ion-nav>🚫↵
```
[}]: #

Let's add some code to our `Component` with a simple logic; Once the component is created we gonna define some dummy chats, using the `Observable.of`, so we can have some data to test our view against:

[{]: <helper> (diff_step 2.6)
#### Step 2.6: Add stubs for chats objects

##### Changed client/imports/pages/chats/chats.ts
```diff
@@ -1,11 +1,65 @@
 ┊ 1┊ 1┊import { Component } from '@angular/core';
+┊  ┊ 2┊import * as Moment from 'moment';
+┊  ┊ 3┊import { Observable } from 'rxjs';
 ┊ 2┊ 4┊import template from './chats.html';
 ┊ 3┊ 5┊
 ┊ 4┊ 6┊@Component({
 ┊ 5┊ 7┊  template
 ┊ 6┊ 8┊})
 ┊ 7┊ 9┊export class ChatsPage {
+┊  ┊10┊  chats: Observable<any[]>;
+┊  ┊11┊
 ┊ 8┊12┊  constructor() {
+┊  ┊13┊    this.chats = this.findChats();
+┊  ┊14┊  }
 ┊ 9┊15┊
+┊  ┊16┊  private findChats(): Observable<any[]> {
+┊  ┊17┊    return Observable.of([
+┊  ┊18┊      {
+┊  ┊19┊        _id: '0',
+┊  ┊20┊        title: 'Ethan Gonzalez',
+┊  ┊21┊        picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
+┊  ┊22┊        lastMessage: {
+┊  ┊23┊          content: 'You on your way?',
+┊  ┊24┊          createdAt: Moment().subtract(1, 'hours').toDate()
+┊  ┊25┊        }
+┊  ┊26┊      },
+┊  ┊27┊      {
+┊  ┊28┊        _id: '1',
+┊  ┊29┊        title: 'Bryan Wallace',
+┊  ┊30┊        picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
+┊  ┊31┊        lastMessage: {
+┊  ┊32┊          content: 'Hey, it\'s me',
+┊  ┊33┊          createdAt: Moment().subtract(2, 'hours').toDate()
+┊  ┊34┊        }
+┊  ┊35┊      },
+┊  ┊36┊      {
+┊  ┊37┊        _id: '2',
+┊  ┊38┊        title: 'Avery Stewart',
+┊  ┊39┊        picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
+┊  ┊40┊        lastMessage: {
+┊  ┊41┊          content: 'I should buy a boat',
+┊  ┊42┊          createdAt: Moment().subtract(1, 'days').toDate()
+┊  ┊43┊        }
+┊  ┊44┊      },
+┊  ┊45┊      {
+┊  ┊46┊        _id: '3',
+┊  ┊47┊        title: 'Katie Peterson',
+┊  ┊48┊        picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
+┊  ┊49┊        lastMessage: {
+┊  ┊50┊          content: 'Look at my mukluks!',
+┊  ┊51┊          createdAt: Moment().subtract(4, 'days').toDate()
+┊  ┊52┊        }
+┊  ┊53┊      },
+┊  ┊54┊      {
+┊  ┊55┊        _id: '4',
+┊  ┊56┊        title: 'Ray Edwards',
+┊  ┊57┊        picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
+┊  ┊58┊        lastMessage: {
+┊  ┊59┊          content: 'This is wicked good ice cream.',
+┊  ┊60┊          createdAt: Moment().subtract(2, 'weeks').toDate()
+┊  ┊61┊        }
+┊  ┊62┊      }
+┊  ┊63┊    ]);
 ┊10┊64┊  }
 ┊11┊65┊}🚫↵
```
[}]: #

> Further explanation regards `RxJS` can be found in [step 3](./step3.md)

`moment` is an essential package for our data fabrication, which requires us to install it using the following command:

    $ meteor npm install --save moment

## TypeScript Interfaces

Now, because we use `TypeScript`, we can define our own data-types and use them in our app, which will give you a better auto-complete and developing experience in most IDEs. In our application, we have 2 models: a `chat` model and a `message` model. Since we will probably be using these models in both client and server, we will create a dir which is common for both, called `imports`:

    $ mkdir imports

Inside the `imports` dir, we will define our initial `models.ts` file:

[{]: <helper> (diff_step 2.8)
#### Step 2.8: Create models file with declarations of Chat, Message and MessageType

##### Added imports/models.ts
```diff
@@ -0,0 +1,18 @@
+┊  ┊ 1┊export enum MessageType {
+┊  ┊ 2┊  TEXT = <any>'text'
+┊  ┊ 3┊}
+┊  ┊ 4┊
+┊  ┊ 5┊export interface Chat {
+┊  ┊ 6┊  _id?: string;
+┊  ┊ 7┊  title?: string;
+┊  ┊ 8┊  picture?: string;
+┊  ┊ 9┊  lastMessage?: Message;
+┊  ┊10┊}
+┊  ┊11┊
+┊  ┊12┊export interface Message {
+┊  ┊13┊  _id?: string;
+┊  ┊14┊  chatId?: string;
+┊  ┊15┊  content?: string;
+┊  ┊16┊  createdAt?: Date;
+┊  ┊17┊  type?: MessageType
+┊  ┊18┊}🚫↵
```
[}]: #

Now that the models are up and set, we can use apply it to the `ChatsPage`:

[{]: <helper> (diff_step 2.9)
#### Step 2.9: Use TypeScript models

##### Changed client/imports/pages/chats/chats.ts
```diff
@@ -1,19 +1,20 @@
 ┊ 1┊ 1┊import { Component } from '@angular/core';
 ┊ 2┊ 2┊import * as Moment from 'moment';
 ┊ 3┊ 3┊import { Observable } from 'rxjs';
+┊  ┊ 4┊import { Chat, MessageType } from '../../../../imports/models';
 ┊ 4┊ 5┊import template from './chats.html';
 ┊ 5┊ 6┊
 ┊ 6┊ 7┊@Component({
 ┊ 7┊ 8┊  template
 ┊ 8┊ 9┊})
 ┊ 9┊10┊export class ChatsPage {
-┊10┊  ┊  chats: Observable<any[]>;
+┊  ┊11┊  chats: Observable<Chat[]>;
 ┊11┊12┊
 ┊12┊13┊  constructor() {
 ┊13┊14┊    this.chats = this.findChats();
 ┊14┊15┊  }
 ┊15┊16┊
-┊16┊  ┊  private findChats(): Observable<any[]> {
+┊  ┊17┊  private findChats(): Observable<Chat[]> {
 ┊17┊18┊    return Observable.of([
 ┊18┊19┊      {
 ┊19┊20┊        _id: '0',
```
```diff
@@ -21,7 +22,8 @@
 ┊21┊22┊        picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
 ┊22┊23┊        lastMessage: {
 ┊23┊24┊          content: 'You on your way?',
-┊24┊  ┊          createdAt: Moment().subtract(1, 'hours').toDate()
+┊  ┊25┊          createdAt: Moment().subtract(1, 'hours').toDate(),
+┊  ┊26┊          type: MessageType.TEXT
 ┊25┊27┊        }
 ┊26┊28┊      },
 ┊27┊29┊      {
```
```diff
@@ -30,7 +32,8 @@
 ┊30┊32┊        picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
 ┊31┊33┊        lastMessage: {
 ┊32┊34┊          content: 'Hey, it\'s me',
-┊33┊  ┊          createdAt: Moment().subtract(2, 'hours').toDate()
+┊  ┊35┊          createdAt: Moment().subtract(2, 'hours').toDate(),
+┊  ┊36┊          type: MessageType.TEXT
 ┊34┊37┊        }
 ┊35┊38┊      },
 ┊36┊39┊      {
```
```diff
@@ -39,7 +42,8 @@
 ┊39┊42┊        picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
 ┊40┊43┊        lastMessage: {
 ┊41┊44┊          content: 'I should buy a boat',
-┊42┊  ┊          createdAt: Moment().subtract(1, 'days').toDate()
+┊  ┊45┊          createdAt: Moment().subtract(1, 'days').toDate(),
+┊  ┊46┊          type: MessageType.TEXT
 ┊43┊47┊        }
 ┊44┊48┊      },
 ┊45┊49┊      {
```
```diff
@@ -48,7 +52,8 @@
 ┊48┊52┊        picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
 ┊49┊53┊        lastMessage: {
 ┊50┊54┊          content: 'Look at my mukluks!',
-┊51┊  ┊          createdAt: Moment().subtract(4, 'days').toDate()
+┊  ┊55┊          createdAt: Moment().subtract(4, 'days').toDate(),
+┊  ┊56┊          type: MessageType.TEXT
 ┊52┊57┊        }
 ┊53┊58┊      },
 ┊54┊59┊      {
```
```diff
@@ -57,7 +62,8 @@
 ┊57┊62┊        picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
 ┊58┊63┊        lastMessage: {
 ┊59┊64┊          content: 'This is wicked good ice cream.',
-┊60┊  ┊          createdAt: Moment().subtract(2, 'weeks').toDate()
+┊  ┊65┊          createdAt: Moment().subtract(2, 'weeks').toDate(),
+┊  ┊66┊          type: MessageType.TEXT
 ┊61┊67┊        }
 ┊62┊68┊      }
 ┊63┊69┊    ]);
```
[}]: #

## Ionic's Theming System

`Ionic 2` provides us with a comfortable theming system which is based on `SASS` variables. The theme definition file is located in `client/imports/theme/variable.scss`. Since we want our app to have a "Whatsappish" look, we will define a new `SASS` variable called `whatsapp` in the variables file:

[{]: <helper> (diff_step 2.10)
#### Step 2.10: Add whatsapp color to the app theme

##### Changed client/imports/theme/variables.scss
```diff
@@ -11,7 +11,8 @@
 ┊11┊11┊  secondary:  #32db64,
 ┊12┊12┊  danger:     #f53d3d,
 ┊13┊13┊  light:      #f4f4f4,
-┊14┊  ┊  dark:       #222
+┊  ┊14┊  dark:       #222,
+┊  ┊15┊  whatsapp:   #075E54
 ┊15┊16┊);
 ┊16┊17┊
 ┊17┊18┊// Components
```
[}]: #

The `whatsapp` color can be used by adding an attribute called `color` with a value `whatsapp` to any Ionic component.

To begin with, we can start by implementing the `ChatsView` and apply our newly defined theme into it. This view will contain a list representing all the available chats in the component's data-set:

[{]: <helper> (diff_step 2.11)
#### Step 2.11: Add the layout of the chats page

##### Changed client/imports/pages/chats/chats.html
```diff
@@ -1,11 +1,36 @@
 ┊ 1┊ 1┊<ion-header>
-┊ 2┊  ┊  <ion-navbar>
+┊  ┊ 2┊  <ion-navbar color="whatsapp">
 ┊ 3┊ 3┊    <ion-title>
 ┊ 4┊ 4┊      Chats
 ┊ 5┊ 5┊    </ion-title>
+┊  ┊ 6┊    <ion-buttons end>
+┊  ┊ 7┊      <button ion-button icon-only class="add-chat-button">
+┊  ┊ 8┊        <ion-icon name="person-add"></ion-icon>
+┊  ┊ 9┊      </button>
+┊  ┊10┊      <button ion-button icon-only class="options-button">
+┊  ┊11┊        <ion-icon name="more"></ion-icon>
+┊  ┊12┊      </button>
+┊  ┊13┊    </ion-buttons>
 ┊ 6┊14┊  </ion-navbar>
 ┊ 7┊15┊</ion-header>
 ┊ 8┊16┊
-┊ 9┊  ┊<ion-content padding>
-┊10┊  ┊  Hello!
+┊  ┊17┊<ion-content class="chats-page-content">
+┊  ┊18┊  <ion-list class="chats">
+┊  ┊19┊    <ion-item-sliding *ngFor="let chat of chats | async">
+┊  ┊20┊      <button ion-item class="chat">
+┊  ┊21┊        <img class="chat-picture" [src]="chat.picture">
+┊  ┊22┊        <div class="chat-info">
+┊  ┊23┊          <h2 class="chat-title">{{chat.title}}</h2>
+┊  ┊24┊
+┊  ┊25┊          <span *ngIf="chat.lastMessage" class="last-message">
+┊  ┊26┊            <p *ngIf="chat.lastMessage.type == 'text'" class="last-message-content last-message-content-text">{{chat.lastMessage.content}}</p>
+┊  ┊27┊            <span class="last-message-timestamp">{{chat.lastMessage.createdAt }}</span>
+┊  ┊28┊          </span>
+┊  ┊29┊        </div>
+┊  ┊30┊      </button>
+┊  ┊31┊      <ion-item-options class="chat-options">
+┊  ┊32┊        <button ion-button color="danger" class="option option-remove">Remove</button>
+┊  ┊33┊      </ion-item-options>
+┊  ┊34┊    </ion-item-sliding>
+┊  ┊35┊  </ion-list>
 ┊11┊36┊</ion-content>🚫↵
```
[}]: #

We use `ion-list` which Ionic translates into a list, and we use `ion-item` to represent a single item in that list. A chat item includes an image, the receiver's name, and its recent message.

> The `async` pipe is used to iterate through data which should be fetched asynchronously, in this case, observables.

Now, in order to finish our theming and styling, let's create a stylesheet file for our component:

[{]: <helper> (diff_step 2.12)
#### Step 2.12: Create SCSS file for chats page

##### Added client/imports/pages/chats/chats.scss
```diff
@@ -0,0 +1,20 @@
+┊  ┊ 1┊.chats-page-content {
+┊  ┊ 2┊  .chat-picture {
+┊  ┊ 3┊    border-radius: 50%;
+┊  ┊ 4┊    width: 50px;
+┊  ┊ 5┊    float: left;
+┊  ┊ 6┊  }
+┊  ┊ 7┊
+┊  ┊ 8┊  .chat-info {
+┊  ┊ 9┊    float: left;
+┊  ┊10┊    margin: 10px 0 0 20px;
+┊  ┊11┊
+┊  ┊12┊    .last-message-timestamp {
+┊  ┊13┊      position: absolute;
+┊  ┊14┊      top: 10px;
+┊  ┊15┊      right: 10px;
+┊  ┊16┊      font-size: 14px;
+┊  ┊17┊      color: #9A9898;
+┊  ┊18┊    }
+┊  ┊19┊  }
+┊  ┊20┊}🚫↵
```

##### Changed client/main.scss
```diff
@@ -2,4 +2,7 @@
 ┊2┊2┊@import "imports/theme/variables";
 ┊3┊3┊
 ┊4┊4┊// App
-┊5┊ ┊@import "imports/app/app";🚫↵
+┊ ┊5┊@import "imports/app/app";
+┊ ┊6┊
+┊ ┊7┊// Pages
+┊ ┊8┊@import "imports/pages/chats/chats";🚫↵
```
[}]: #

Ionic will load newly defined stylesheet files automatically, so you shouldn't be worried for importations.

## External Angular 2 Modules

Since `Ionic 2` uses `Angular 2` as the layer view, we can load `Angular 2` modules just like any other plain `Angular 2` application. One module that may come in our interest would be the `angular2-moment` module, which will provide us with the ability to use `moment`'s utility functions in the view as pipes.

It requires us to install `angular2-moment` module using the following command:

    $ meteor npm install --save angular2-moment

Now we will need to declare this module in the app's main component:

[{]: <helper> (diff_step 2.14)
#### Step 2.14: Import MomentModule into our app module

##### Changed client/imports/app/app.module.ts
```diff
@@ -1,4 +1,5 @@
 ┊1┊1┊import { NgModule, ErrorHandler } from '@angular/core';
+┊ ┊2┊import { MomentModule } from 'angular2-moment';
 ┊2┊3┊import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
 ┊3┊4┊import { ChatsPage } from '../pages/chats/chats'
 ┊4┊5┊import { MyApp } from './app.component';
```
```diff
@@ -10,6 +11,7 @@
 ┊10┊11┊  ],
 ┊11┊12┊  imports: [
 ┊12┊13┊    IonicModule.forRoot(MyApp),
+┊  ┊14┊    MomentModule
 ┊13┊15┊  ],
 ┊14┊16┊  bootstrap: [IonicApp],
 ┊15┊17┊  entryComponents: [
```
[}]: #

Which will make `moment` available as a pack of pipes, as mentioned earlier:

[{]: <helper> (diff_step 2.15)
#### Step 2.15: Use amCalendar pipe

##### Changed client/imports/pages/chats/chats.html
```diff
@@ -24,7 +24,7 @@
 ┊24┊24┊
 ┊25┊25┊          <span *ngIf="chat.lastMessage" class="last-message">
 ┊26┊26┊            <p *ngIf="chat.lastMessage.type == 'text'" class="last-message-content last-message-content-text">{{chat.lastMessage.content}}</p>
-┊27┊  ┊            <span class="last-message-timestamp">{{chat.lastMessage.createdAt }}</span>
+┊  ┊27┊            <span class="last-message-timestamp">{{ chat.lastMessage.createdAt | amCalendar }}</span>
 ┊28┊28┊          </span>
 ┊29┊29┊        </div>
 ┊30┊30┊      </button>
```
[}]: #

## Ionic Touch Events

Ionic provides us with components which can handle mobile events like: slide, tap and pinch. Since we're going to take advantage of the "sliding" event in the `chats` view, we used the `ion-item-sliding` component, so any time we will slide our item to the left, we should see a `Remove` button.

Right now this button is not hooked to anything. It requires us to bind it into the component:

[{]: <helper> (diff_step 2.16)
#### Step 2.16: Add chat removal event

##### Changed client/imports/pages/chats/chats.html
```diff
@@ -29,7 +29,7 @@
 ┊29┊29┊        </div>
 ┊30┊30┊      </button>
 ┊31┊31┊      <ion-item-options class="chat-options">
-┊32┊  ┊        <button ion-button color="danger" class="option option-remove">Remove</button>
+┊  ┊32┊        <button ion-button color="danger" class="option option-remove" (click)="removeChat(chat)">Remove</button>
 ┊33┊33┊      </ion-item-options>
 ┊34┊34┊    </ion-item-sliding>
 ┊35┊35┊  </ion-list>
```
[}]: #

And now that it is bound to the component we can safely implement its handler:

[{]: <helper> (diff_step 2.17)
#### Step 2.17: Add removeChat method

##### Changed client/imports/pages/chats/chats.ts
```diff
@@ -68,4 +68,13 @@
 ┊68┊68┊      }
 ┊69┊69┊    ]);
 ┊70┊70┊  }
+┊  ┊71┊
+┊  ┊72┊  removeChat(chat: Chat): void {
+┊  ┊73┊    this.chats = this.chats.map<Chat[]>(chatsArray => {
+┊  ┊74┊      const chatIndex = chatsArray.indexOf(chat);
+┊  ┊75┊      chatsArray.splice(chatIndex, 1);
+┊  ┊76┊
+┊  ┊77┊      return chatsArray;
+┊  ┊78┊    });
+┊  ┊79┊  }
 ┊71┊80┊}🚫↵
```
[}]: #
[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step1.md) | [Next Step >](step3.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #