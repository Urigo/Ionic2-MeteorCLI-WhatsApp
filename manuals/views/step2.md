# Step 2: Chats page

Now that we're finished with the initial setup, we can start building our app.

An Ionic application is made out of pages, each page is an Angular component.

## First page

Let's create the first page and call it `TabsContainer`:

[{]: <helper> (diff_step 2.1)
#### Step 2.1: Added tabs container component

##### Added client/imports/pages/tabs-container/tabs-container.component.ts
```diff
@@ -0,0 +1,18 @@
+┊  ┊ 1┊import {Component} from "@angular/core";
+┊  ┊ 2┊
+┊  ┊ 3┊@Component({
+┊  ┊ 4┊  selector: "tabs-container",
+┊  ┊ 5┊  template: `
+┊  ┊ 6┊  <ion-tabs>
+┊  ┊ 7┊    <ion-tab tabIcon="chatboxes"></ion-tab>
+┊  ┊ 8┊    <ion-tab tabIcon="contacts"></ion-tab>
+┊  ┊ 9┊    <ion-tab tabIcon="star"></ion-tab>
+┊  ┊10┊    <ion-tab tabIcon="clock"></ion-tab>
+┊  ┊11┊  </ion-tabs>
+┊  ┊12┊  `
+┊  ┊13┊})
+┊  ┊14┊export class TabsContainerComponent {
+┊  ┊15┊  constructor() {
+┊  ┊16┊
+┊  ┊17┊  }
+┊  ┊18┊}🚫↵
```
[}]: #

We defined 3 tabs (see [documentation](http://ionicframework.com/docs/v2/api/components/tabs/Tabs/)): `chats`, `contacts`, `favorites`.
In this tutorial we want to focus only on the messaging system, therefore we only gonna implement the chats tab, the rest is just for the layout.

Now we need to include this component in the `AppModule` to make it available for our application:

[{]: <helper> (diff_step 2.2)
#### Step 2.2: Added the Component to the NgModule

##### Changed client/imports/app/app.module.ts
```diff
@@ -1,15 +1,18 @@
 ┊ 1┊ 1┊import { NgModule } from '@angular/core';
 ┊ 2┊ 2┊import { AppComponent } from './app.component';
 ┊ 3┊ 3┊import { IonicApp, IonicModule } from "ionic-angular";
+┊  ┊ 4┊import {TabsContainerComponent} from "../pages/tabs-container/tabs-container.component";
 ┊ 4┊ 5┊
 ┊ 5┊ 6┊@NgModule({
 ┊ 6┊ 7┊  // Components, Pipes, Directive
 ┊ 7┊ 8┊  declarations: [
-┊ 8┊  ┊    AppComponent
+┊  ┊ 9┊    AppComponent,
+┊  ┊10┊    TabsContainerComponent
 ┊ 9┊11┊  ],
 ┊10┊12┊  // Entry Components
 ┊11┊13┊  entryComponents: [
-┊12┊  ┊    AppComponent
+┊  ┊14┊    AppComponent,
+┊  ┊15┊    TabsContainerComponent
 ┊13┊16┊  ],
 ┊14┊17┊  // Providers
 ┊15┊18┊  providers: [
```
[}]: #

## Navigation

One thing is missing and that's the root page. The application doesn't know which page to load at the beginning.

Navigation is handled through the `<ion-nav>` component. Go to AppComponent's template to change it:

[{]: <helper> (diff_step 2.3)
#### Step 2.3: Updated the main component to use Ionic navigation

##### Changed client/imports/app/app.component.html
```diff
@@ -1,3 +1 @@
-┊1┊ ┊<div>
-┊2┊ ┊    <h1>Hello Angular2-Meteor!</h1>
-┊3┊ ┊</div>
+┊ ┊1┊<ion-nav [root]="rootPage"></ion-nav>🚫↵
```
[}]: #

Now we can define `rootPage` and use `TabsContainerComponent`:

[{]: <helper> (diff_step 2.4)
#### Step 2.4: Added missing rootPage variable

##### Changed client/imports/app/app.component.ts
```diff
@@ -2,12 +2,15 @@
 ┊ 2┊ 2┊import { Platform } from "ionic-angular";
 ┊ 3┊ 3┊import { StatusBar } from "ionic-native";
 ┊ 4┊ 4┊import template from './app.component.html';
+┊  ┊ 5┊import {TabsContainerComponent} from "../pages/tabs-container/tabs-container.component";
 ┊ 5┊ 6┊
 ┊ 6┊ 7┊@Component({
 ┊ 7┊ 8┊  selector: 'app',
 ┊ 8┊ 9┊  template
 ┊ 9┊10┊})
 ┊10┊11┊export class AppComponent {
+┊  ┊12┊  rootPage = TabsContainerComponent;
+┊  ┊13┊
 ┊11┊14┊  constructor(platform: Platform) {
 ┊12┊15┊    platform.ready().then(() => {
 ┊13┊16┊      // Okay, so the platform is ready and our plugins are available.
```
[}]: #

Navigation in Ionic works as a simple stack. New pages are pushed onto and popped off of, corresponding to moving forward and backward in history.

## Chats

We're going to create a component that contains list of chats.

First thing, a template:

[{]: <helper> (diff_step 2.5)
#### Step 2.5: Added the chats page template

##### Added client/imports/pages/chats/chats.component.html
```diff
@@ -0,0 +1,9 @@
+┊ ┊1┊<ion-header>
+┊ ┊2┊  <ion-navbar>
+┊ ┊3┊    <ion-title>Chats</ion-title>
+┊ ┊4┊  </ion-navbar>
+┊ ┊5┊</ion-header>
+┊ ┊6┊
+┊ ┊7┊<ion-content padding>
+┊ ┊8┊  <h2>Welcome!</h2>
+┊ ┊9┊</ion-content>🚫↵
```
[}]: #

Then, the actual component, called `ChatsComponent`:

[{]: <helper> (diff_step 2.6)
#### Step 2.6: Added the chats page component

##### Added client/imports/pages/chats/chats.component.ts
```diff
@@ -0,0 +1,12 @@
+┊  ┊ 1┊import {Component} from "@angular/core";
+┊  ┊ 2┊import template from "./chats.component.html"
+┊  ┊ 3┊
+┊  ┊ 4┊@Component({
+┊  ┊ 5┊  selector: "chats",
+┊  ┊ 6┊  template
+┊  ┊ 7┊})
+┊  ┊ 8┊export class ChatsComponent {
+┊  ┊ 9┊  constructor() {
+┊  ┊10┊
+┊  ┊11┊  }
+┊  ┊12┊}🚫↵
```
[}]: #

As you probably remember, it still need to be added to AppModule:

[{]: <helper> (diff_step 2.7)
#### Step 2.7: Added the chats page to the NgModule

##### Changed client/imports/app/app.module.ts
```diff
@@ -2,17 +2,20 @@
 ┊ 2┊ 2┊import { AppComponent } from './app.component';
 ┊ 3┊ 3┊import { IonicApp, IonicModule } from "ionic-angular";
 ┊ 4┊ 4┊import {TabsContainerComponent} from "../pages/tabs-container/tabs-container.component";
+┊  ┊ 5┊import {ChatsComponent} from "../pages/chats/chats.component";
 ┊ 5┊ 6┊
 ┊ 6┊ 7┊@NgModule({
 ┊ 7┊ 8┊  // Components, Pipes, Directive
 ┊ 8┊ 9┊  declarations: [
 ┊ 9┊10┊    AppComponent,
-┊10┊  ┊    TabsContainerComponent
+┊  ┊11┊    TabsContainerComponent,
+┊  ┊12┊    ChatsComponent
 ┊11┊13┊  ],
 ┊12┊14┊  // Entry Components
 ┊13┊15┊  entryComponents: [
 ┊14┊16┊    AppComponent,
-┊15┊  ┊    TabsContainerComponent
+┊  ┊17┊    TabsContainerComponent,
+┊  ┊18┊    ChatsComponent
 ┊16┊19┊  ],
 ┊17┊20┊  // Providers
 ┊18┊21┊  providers: [
```
[}]: #

Since, the component is available, we can bind it to Chats tab:

[{]: <helper> (diff_step 2.8)
#### Step 2.8: Use the chats page component in ion-tabs

##### Changed client/imports/pages/tabs-container/tabs-container.component.ts
```diff
@@ -1,10 +1,11 @@
 ┊ 1┊ 1┊import {Component} from "@angular/core";
+┊  ┊ 2┊import {ChatsComponent} from "../chats/chats.component";
 ┊ 2┊ 3┊
 ┊ 3┊ 4┊@Component({
 ┊ 4┊ 5┊  selector: "tabs-container",
 ┊ 5┊ 6┊  template: `
 ┊ 6┊ 7┊  <ion-tabs>
-┊ 7┊  ┊    <ion-tab tabIcon="chatboxes"></ion-tab>
+┊  ┊ 8┊    <ion-tab [root]="chatsRoot" tabIcon="chatboxes"></ion-tab>
 ┊ 8┊ 9┊    <ion-tab tabIcon="contacts"></ion-tab>
 ┊ 9┊10┊    <ion-tab tabIcon="star"></ion-tab>
 ┊10┊11┊    <ion-tab tabIcon="clock"></ion-tab>
```
```diff
@@ -12,6 +13,8 @@
 ┊12┊13┊  `
 ┊13┊14┊})
 ┊14┊15┊export class TabsContainerComponent {
+┊  ┊16┊  chatsRoot = ChatsComponent;
+┊  ┊17┊
 ┊15┊18┊  constructor() {
 ┊16┊19┊
 ┊17┊20┊  }
```
[}]: #


## Theme

Ionic2 provides us with a new theming system.
The theme is determined thanks to SASS variables located in the file `client/styles/ionic.scss`.
By changing these variables our entire app's theme will be changed as well.
Not only that, but you can also add new theming colors, and they should be available on the HTML as attributes, and the should affect the theming of most Ionic elements once we use them.

Since we want our app to have a Whatsapp theme, we gonna define a new variable called `whatsapp`:

[{]: <helper> (diff_step 2.9)
#### Step 2.9: Add whatsapp theme variable

##### Changed client/styles/ionic.scss
```diff
@@ -27,7 +27,8 @@
 ┊27┊27┊        danger:     #f53d3d,
 ┊28┊28┊        light:      #f4f4f4,
 ┊29┊29┊        dark:       #222,
-┊30┊  ┊        favorite:   #69BB7B
+┊  ┊30┊        favorite:   #69BB7B,
+┊  ┊31┊        whatsapp:   #075E54
 ┊31┊32┊);
 ┊32┊33┊
 ┊33┊34┊// Components
```
[}]: #

Now whenever we will use it as an HTML attribute we gonna have a greenish background, just like Whatsapp.

[{]: <helper> (diff_step 2.1)
#### Step 2.1: Added tabs container component

##### Added client/imports/pages/tabs-container/tabs-container.component.ts
```diff
@@ -0,0 +1,18 @@
+┊  ┊ 1┊import {Component} from "@angular/core";
+┊  ┊ 2┊
+┊  ┊ 3┊@Component({
+┊  ┊ 4┊  selector: "tabs-container",
+┊  ┊ 5┊  template: `
+┊  ┊ 6┊  <ion-tabs>
+┊  ┊ 7┊    <ion-tab tabIcon="chatboxes"></ion-tab>
+┊  ┊ 8┊    <ion-tab tabIcon="contacts"></ion-tab>
+┊  ┊ 9┊    <ion-tab tabIcon="star"></ion-tab>
+┊  ┊10┊    <ion-tab tabIcon="clock"></ion-tab>
+┊  ┊11┊  </ion-tabs>
+┊  ┊12┊  `
+┊  ┊13┊})
+┊  ┊14┊export class TabsContainerComponent {
+┊  ┊15┊  constructor() {
+┊  ┊16┊
+┊  ┊17┊  }
+┊  ┊18┊}🚫↵
```
[}]: #


## Models

It's time to think about the data structure of chats and messages.

Let's begin with a message. It should contain content and date of creating.

[{]: <helper> (diff_step 2.11)
#### Step 2.11: Added message model

##### Added both/models/message.model.ts
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊export interface Message {
+┊ ┊2┊  _id?: string;
+┊ ┊3┊  content?: string;
+┊ ┊4┊  createdAt?: Date;
+┊ ┊5┊}🚫↵
```
[}]: #

Because it represents a Mongo Object we also added `_id` property.

Do the same for a chat:

[{]: <helper> (diff_step 2.12)
#### Step 2.12: Added chat model

##### Added both/models/chat.model.ts
```diff
@@ -0,0 +1,8 @@
+┊ ┊1┊import {Message} from "./message.model";
+┊ ┊2┊
+┊ ┊3┊export interface Chat {
+┊ ┊4┊  _id?: string;
+┊ ┊5┊  title?: string;
+┊ ┊6┊  picture?: string;
+┊ ┊7┊  lastMessage?: Message;
+┊ ┊8┊}🚫↵
```
[}]: #

Chat has title, picture and an object with a last message.


## Data

Whatsapp needs data, so we going to define dummy chats just so we can test our view.

[{]: <helper> (diff_step 2.14)
#### Step 2.14: Added list of stub chats

##### Changed client/imports/pages/chats/chats.component.ts
```diff
@@ -1,12 +1,63 @@
 ┊ 1┊ 1┊import {Component} from "@angular/core";
 ┊ 2┊ 2┊import template from "./chats.component.html"
+┊  ┊ 3┊import {Observable} from "rxjs";
+┊  ┊ 4┊import {Chat} from "../../../../both/models/chat.model";
+┊  ┊ 5┊import * as moment from "moment";
 ┊ 3┊ 6┊
 ┊ 4┊ 7┊@Component({
 ┊ 5┊ 8┊  selector: "chats",
 ┊ 6┊ 9┊  template
 ┊ 7┊10┊})
 ┊ 8┊11┊export class ChatsComponent {
-┊ 9┊  ┊  constructor() {
+┊  ┊12┊  chats: Observable<Chat[]>;
 ┊10┊13┊
+┊  ┊14┊  constructor() {
+┊  ┊15┊    this.chats = Observable.of([
+┊  ┊16┊      {
+┊  ┊17┊        _id: '0',
+┊  ┊18┊        title: 'Ethan Gonzalez',
+┊  ┊19┊        picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
+┊  ┊20┊        lastMessage: {
+┊  ┊21┊          content: 'You on your way?',
+┊  ┊22┊          createdAt: moment().subtract(1, 'hours').toDate()
+┊  ┊23┊        }
+┊  ┊24┊      },
+┊  ┊25┊      {
+┊  ┊26┊        _id: '1',
+┊  ┊27┊        title: 'Bryan Wallace',
+┊  ┊28┊        picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
+┊  ┊29┊        lastMessage: {
+┊  ┊30┊          content: 'Hey, it\'s me',
+┊  ┊31┊          createdAt: moment().subtract(2, 'hours').toDate()
+┊  ┊32┊        }
+┊  ┊33┊      },
+┊  ┊34┊      {
+┊  ┊35┊        _id: '2',
+┊  ┊36┊        title: 'Avery Stewart',
+┊  ┊37┊        picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
+┊  ┊38┊        lastMessage: {
+┊  ┊39┊          content: 'I should buy a boat',
+┊  ┊40┊          createdAt: moment().subtract(1, 'days').toDate()
+┊  ┊41┊        }
+┊  ┊42┊      },
+┊  ┊43┊      {
+┊  ┊44┊        _id: '3',
+┊  ┊45┊        title: 'Katie Peterson',
+┊  ┊46┊        picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
+┊  ┊47┊        lastMessage: {
+┊  ┊48┊          content: 'Look at my mukluks!',
+┊  ┊49┊          createdAt: moment().subtract(4, 'days').toDate()
+┊  ┊50┊        }
+┊  ┊51┊      },
+┊  ┊52┊      {
+┊  ┊53┊        _id: '4',
+┊  ┊54┊        title: 'Ray Edwards',
+┊  ┊55┊        picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
+┊  ┊56┊        lastMessage: {
+┊  ┊57┊          content: 'This is wicked good ice cream.',
+┊  ┊58┊          createdAt: moment().subtract(2, 'weeks').toDate()
+┊  ┊59┊        }
+┊  ┊60┊      }
+┊  ┊61┊    ])
 ┊11┊62┊  }
 ┊12┊63┊}🚫↵
```
[}]: #

As you can see we're using a package called [`Moment`](http://momentjs.com/) to fabricate some dates. Let's install it:

    $ npm install moment

It requires declarations:

    $ typings install --save --global dt~moment

We used `Observable.of` that creates an `Observable` that emits values we specified as arguments.

## View

Let's update the view of ChatsComponent: 

[{]: <helper> (diff_step 2.15)
#### Step 2.15: Added chats view layout

##### Changed client/imports/pages/chats/chats.component.html
```diff
@@ -1,9 +1,27 @@
 ┊ 1┊ 1┊<ion-header>
-┊ 2┊  ┊  <ion-navbar>
+┊  ┊ 2┊  <ion-navbar color="whatsapp">
 ┊ 3┊ 3┊    <ion-title>Chats</ion-title>
+┊  ┊ 4┊
+┊  ┊ 5┊    <ion-buttons end>
+┊  ┊ 6┊      <button ion-button icon-only class="add-chat-button"><ion-icon name="person-add"></ion-icon></button>
+┊  ┊ 7┊      <button ion-button icon-only class="options-button"><ion-icon name="more"></ion-icon></button>
+┊  ┊ 8┊    </ion-buttons>
 ┊ 4┊ 9┊  </ion-navbar>
 ┊ 5┊10┊</ion-header>
 ┊ 6┊11┊
-┊ 7┊  ┊<ion-content padding>
-┊ 8┊  ┊  <h2>Welcome!</h2>
-┊ 9┊  ┊</ion-content>🚫↵
+┊  ┊12┊<ion-content class="chats-page-content">
+┊  ┊13┊  <ion-list class="chats">
+┊  ┊14┊    <button ion-item *ngFor="let chat of chats | async" class="chat">
+┊  ┊15┊      <img class="chat-picture" [src]="chat.picture">
+┊  ┊16┊
+┊  ┊17┊      <div class="chat-info">
+┊  ┊18┊        <h2 class="chat-title">{{chat.title}}</h2>
+┊  ┊19┊
+┊  ┊20┊        <span *ngIf="chat.lastMessage" class="last-message">
+┊  ┊21┊          <p class="last-message-content">{{chat.lastMessage.content}}</p>
+┊  ┊22┊          <span class="last-message-timestamp">{{chat.lastMessage.createdAt}}</span>
+┊  ┊23┊        </span>
+┊  ┊24┊      </div>
+┊  ┊25┊    </button>
+┊  ┊26┊  </ion-list>
+┊  ┊27┊</ion-content>
```
[}]: #

We placed two buttons at the end of Navigation Bar.
First's purpose is to add new chat, but second's to open a menu with more options.

New `ion-content` contains list of chats. Each element has a picture, title and an information about the last message.

> **NOTE:** Ionic elements will always have a prefix of `ion` and are self explanatory. Further information about Ionic's HTML elements can be found [here](ionicframework.com/docs/v2/component). It's very important to use these elemnts since they are the ones who provides us with the mobile-app look.

The `*ngFor` attribute is used for iteration and is equivalent to Angular1's `ng-for` attribute. The '*' sign just tells us that this is a template directive we're dealing with (A directive that should eventually be rendered in the view).
As you probably noticed, we used `AsyncPipe` to display the result of Observable under `chat` property.

Let' make it to look better by creating the `chats.component.scss` file:

[{]: <helper> (diff_step 2.16)
#### Step 2.16: Added some css styles to the chats list

##### Added client/imports/pages/chats/chats.component.scss
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
[}]: #

To include those styles in our component we need to:

[{]: <helper> (diff_step 2.17)
#### Step 2.17: Import the new styles into the Component

##### Changed client/imports/pages/chats/chats.component.ts
```diff
@@ -3,10 +3,15 @@
 ┊ 3┊ 3┊import {Observable} from "rxjs";
 ┊ 4┊ 4┊import {Chat} from "../../../../both/models/chat.model";
 ┊ 5┊ 5┊import * as moment from "moment";
+┊  ┊ 6┊import style from "./chats.component.scss";
+┊  ┊ 7┊
 ┊ 6┊ 8┊
 ┊ 7┊ 9┊@Component({
 ┊ 8┊10┊  selector: "chats",
-┊ 9┊  ┊  template
+┊  ┊11┊  template,
+┊  ┊12┊  styles: [
+┊  ┊13┊    style
+┊  ┊14┊  ]
 ┊10┊15┊})
 ┊11┊16┊export class ChatsComponent {
 ┊12┊17┊  chats: Observable<Chat[]>;
```
[}]: #

We also want to display date under `createdAt` property in a proper way. Moment library contains a package for Angular that will help us.

    $ npm install angular2-moment@1.0.0-beta.3 --save

It's not yet available to Whatsapp. Let's change it:

[{]: <helper> (diff_step 2.19)
#### Step 2.19: Added MomentModule to the NgModule

##### Changed client/imports/app/app.module.ts
```diff
@@ -3,6 +3,7 @@
 ┊3┊3┊import { IonicApp, IonicModule } from "ionic-angular";
 ┊4┊4┊import {TabsContainerComponent} from "../pages/tabs-container/tabs-container.component";
 ┊5┊5┊import {ChatsComponent} from "../pages/chats/chats.component";
+┊ ┊6┊import {MomentModule} from "angular2-moment";
 ┊6┊7┊
 ┊7┊8┊@NgModule({
 ┊8┊9┊  // Components, Pipes, Directive
```
```diff
@@ -23,7 +24,8 @@
 ┊23┊24┊  ],
 ┊24┊25┊  // Modules
 ┊25┊26┊  imports: [
-┊26┊  ┊    IonicModule.forRoot(AppComponent)
+┊  ┊27┊    IonicModule.forRoot(AppComponent),
+┊  ┊28┊    MomentModule
 ┊27┊29┊  ],
 ┊28┊30┊  // Main Component
 ┊29┊31┊  bootstrap: [ IonicApp ]
```
[}]: #

Now we can use `AmCalendarPipe`:

[{]: <helper> (diff_step 2.2)
#### Step 2.2: Added the Component to the NgModule

##### Changed client/imports/app/app.module.ts
```diff
@@ -1,15 +1,18 @@
 ┊ 1┊ 1┊import { NgModule } from '@angular/core';
 ┊ 2┊ 2┊import { AppComponent } from './app.component';
 ┊ 3┊ 3┊import { IonicApp, IonicModule } from "ionic-angular";
+┊  ┊ 4┊import {TabsContainerComponent} from "../pages/tabs-container/tabs-container.component";
 ┊ 4┊ 5┊
 ┊ 5┊ 6┊@NgModule({
 ┊ 6┊ 7┊  // Components, Pipes, Directive
 ┊ 7┊ 8┊  declarations: [
-┊ 8┊  ┊    AppComponent
+┊  ┊ 9┊    AppComponent,
+┊  ┊10┊    TabsContainerComponent
 ┊ 9┊11┊  ],
 ┊10┊12┊  // Entry Components
 ┊11┊13┊  entryComponents: [
-┊12┊  ┊    AppComponent
+┊  ┊14┊    AppComponent,
+┊  ┊15┊    TabsContainerComponent
 ┊13┊16┊  ],
 ┊14┊17┊  // Providers
 ┊15┊18┊  providers: [
```
[}]: #

Pipes serves the same proposes as AngularJS' filters and they share exactly the same syntax, only they are called in a different name.

[{]: <helper> (nav_step next_ref="https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/meteor-server-side" prev_ref="https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/setup")
| [< Previous Step](https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/setup) | [Next Step >](https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/meteor-server-side) |
|:--------------------------------|--------------------------------:|
[}]: #

