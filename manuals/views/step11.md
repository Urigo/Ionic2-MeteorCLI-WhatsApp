[{]: <region> (header)
# Step 11: Google Maps & Geolocation
[}]: #
[{]: <region> (body)
In this step we will add the ability to send the current location in [Google Maps](https://www.google.com/maps/).

[{]: <helper> (diff_step 11.1)
#### Step 11.1: Add cordova plugin for geolocation

##### Changed .meteor/cordova-plugins
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊cordova-plugin-console@1.0.5
 ┊2┊2┊cordova-plugin-device@1.1.4
+┊ ┊3┊cordova-plugin-geolocation@2.4.1
 ┊3┊4┊cordova-plugin-splashscreen@4.0.1
 ┊4┊5┊cordova-plugin-statusbar@2.2.1
 ┊5┊6┊cordova-plugin-whitelist@1.3.1
```
[}]: #

## Geo Location

To get the devices location (aka `geo-location`) we will install a `Cordova` plug-in called `cordova-plugin-geolocation` which will provide us with these abilities:

    $ meteor add cordova:cordova-plugin-geolocation@2.4.1

## Angular 2 Google Maps

Since the location is going to be presented with `Google Maps`, we will install a package which will help up interact with it in `Angular 2`:

    $ meteor npm install --save angular2-google-maps

Before you import the installed package to the app's `NgModule` be sure to generate an API key. An API key is a code passed in by computer programs calling an API to identify the calling program, its developer, or its user to the Web site. To generate an API key go to [Google Maps API documentation page](https://developers.google.com/maps/documentation/javascript/get-api-key) and follow the instructions. **Each app should have it's own API key**, as for now we can just use an API key we generated for the sake of this tutorial, but once you are ready for production, **replace the API key in the script below**:

[{]: <helper> (diff_step 11.3)
#### Step 11.3: Import google maps module

##### Changed client/imports/app/app.module.ts
```diff
@@ -1,4 +1,5 @@
 ┊1┊1┊import { NgModule, ErrorHandler } from '@angular/core';
+┊ ┊2┊import { AgmCoreModule } from 'angular2-google-maps/core';
 ┊2┊3┊import { MomentModule } from 'angular2-moment';
 ┊3┊4┊import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
 ┊4┊5┊import { ChatsPage } from '../pages/chats/chats'
```
```diff
@@ -26,7 +27,10 @@
 ┊26┊27┊  ],
 ┊27┊28┊  imports: [
 ┊28┊29┊    IonicModule.forRoot(MyApp),
-┊29┊  ┊    MomentModule
+┊  ┊30┊    MomentModule,
+┊  ┊31┊    AgmCoreModule.forRoot({
+┊  ┊32┊      apiKey: 'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
+┊  ┊33┊    })
 ┊30┊34┊  ],
 ┊31┊35┊  bootstrap: [IonicApp],
 ┊32┊36┊  entryComponents: [
```
[}]: #

## Attachments Menu

Before we proceed any further, we will add a new message type to our schema, so we can differentiate between a text message and a location message:

[{]: <helper> (diff_step 11.4)
#### Step 11.4: Added location message type

##### Changed imports/models.ts
```diff
@@ -8,7 +8,8 @@
 ┊ 8┊ 8┊}
 ┊ 9┊ 9┊
 ┊10┊10┊export enum MessageType {
-┊11┊  ┊  TEXT = <any>'text'
+┊  ┊11┊  TEXT = <any>'text',
+┊  ┊12┊  LOCATION = <any>'location'
 ┊12┊13┊}
 ┊13┊14┊
 ┊14┊15┊export interface Chat {
```
[}]: #

We want the user to be able to send a location message through an attachments menu in the `MessagesPage`, so let's implement the initial `MessagesAttachmentsComponent`, and as we go through, we will start filling it up:

[{]: <helper> (diff_step 11.5)
#### Step 11.5: Added stub for messages attachment menu

##### Added client/imports/pages/messages/messages-attachments.ts
```diff
@@ -0,0 +1,15 @@
+┊  ┊ 1┊import { Component } from '@angular/core';
+┊  ┊ 2┊import { AlertController, Platform, ModalController, ViewController } from 'ionic-angular';
+┊  ┊ 3┊import template from './messages-attachments.html';
+┊  ┊ 4┊
+┊  ┊ 5┊@Component({
+┊  ┊ 6┊  template
+┊  ┊ 7┊})
+┊  ┊ 8┊export class MessagesAttachmentsComponent {
+┊  ┊ 9┊  constructor(
+┊  ┊10┊    private alertCtrl: AlertController,
+┊  ┊11┊    private platform: Platform,
+┊  ┊12┊    private viewCtrl: ViewController,
+┊  ┊13┊    private modelCtrl: ModalController
+┊  ┊14┊  ) {}
+┊  ┊15┊}
```
[}]: #

[{]: <helper> (diff_step 11.6)
#### Step 11.6: Added messages attachment menu template

##### Added client/imports/pages/messages/messages-attachments.html
```diff
@@ -0,0 +1,18 @@
+┊  ┊ 1┊<ion-content class="messages-attachments-page-content">
+┊  ┊ 2┊  <ion-list class="attachments">
+┊  ┊ 3┊    <button ion-item class="attachment attachment-gallery">
+┊  ┊ 4┊      <ion-icon name="images" class="attachment-icon"></ion-icon>
+┊  ┊ 5┊      <div class="attachment-name">Gallery</div>
+┊  ┊ 6┊    </button>
+┊  ┊ 7┊
+┊  ┊ 8┊    <button ion-item class="attachment attachment-camera">
+┊  ┊ 9┊      <ion-icon name="camera" class="attachment-icon"></ion-icon>
+┊  ┊10┊      <div class="attachment-name">Camera</div>
+┊  ┊11┊    </button>
+┊  ┊12┊
+┊  ┊13┊    <button ion-item class="attachment attachment-location">
+┊  ┊14┊      <ion-icon name="locate" class="attachment-icon"></ion-icon>
+┊  ┊15┊      <div class="attachment-name">Location</div>
+┊  ┊16┊    </button>
+┊  ┊17┊  </ion-list>
+┊  ┊18┊</ion-content>
```
[}]: #

[{]: <helper> (diff_step 11.7)
#### Step 11.7: Added styles for messages attachment

##### Added client/imports/pages/messages/messages-attachments.scss
```diff
@@ -0,0 +1,46 @@
+┊  ┊ 1┊.messages-attachments-page-content {
+┊  ┊ 2┊  $icon-background-size: 60px;
+┊  ┊ 3┊  $icon-font-size: 20pt;
+┊  ┊ 4┊
+┊  ┊ 5┊  .attachments {
+┊  ┊ 6┊    width: 100%;
+┊  ┊ 7┊    margin: 0;
+┊  ┊ 8┊    display: inline-flex;
+┊  ┊ 9┊  }
+┊  ┊10┊
+┊  ┊11┊  .attachment {
+┊  ┊12┊    text-align: center;
+┊  ┊13┊    margin: 0;
+┊  ┊14┊    padding: 0;
+┊  ┊15┊
+┊  ┊16┊    .item-inner {
+┊  ┊17┊      padding: 0
+┊  ┊18┊    }
+┊  ┊19┊
+┊  ┊20┊    .attachment-icon {
+┊  ┊21┊      width: $icon-background-size;
+┊  ┊22┊      height: $icon-background-size;
+┊  ┊23┊      line-height: $icon-background-size;
+┊  ┊24┊      font-size: $icon-font-size;
+┊  ┊25┊      border-radius: 50%;
+┊  ┊26┊      color: white;
+┊  ┊27┊      margin-bottom: 10px
+┊  ┊28┊    }
+┊  ┊29┊
+┊  ┊30┊    .attachment-name {
+┊  ┊31┊      color: gray;
+┊  ┊32┊    }
+┊  ┊33┊  }
+┊  ┊34┊
+┊  ┊35┊  .attachment-gallery .attachment-icon {
+┊  ┊36┊    background: linear-gradient(#e13838 50%, #f53d3d 50%);
+┊  ┊37┊  }
+┊  ┊38┊
+┊  ┊39┊  .attachment-camera .attachment-icon {
+┊  ┊40┊    background: linear-gradient(#3474e1 50%, #387ef5 50%);
+┊  ┊41┊  }
+┊  ┊42┊
+┊  ┊43┊  .attachment-location .attachment-icon {
+┊  ┊44┊    background: linear-gradient(#2ec95c 50%, #32db64 50%);
+┊  ┊45┊  }
+┊  ┊46┊}
```
[}]: #

[{]: <helper> (diff_step 11.8)
#### Step 11.8: Import MessagesAttachmentsComponent

##### Changed client/imports/app/app.module.ts
```diff
@@ -7,6 +7,7 @@
 ┊ 7┊ 7┊import { NewChatComponent } from '../pages/chats/new-chat';
 ┊ 8┊ 8┊import { LoginPage } from '../pages/login/login';
 ┊ 9┊ 9┊import { MessagesPage } from '../pages/messages/messages';
+┊  ┊10┊import { MessagesAttachmentsComponent } from '../pages/messages/messages-attachments';
 ┊10┊11┊import { MessagesOptionsComponent } from '../pages/messages/messages-options';
 ┊11┊12┊import { ProfilePage } from '../pages/profile/profile';
 ┊12┊13┊import { VerificationPage } from '../pages/verification/verification';
```
```diff
@@ -23,7 +24,8 @@
 ┊23┊24┊    ProfilePage,
 ┊24┊25┊    ChatsOptionsComponent,
 ┊25┊26┊    NewChatComponent,
-┊26┊  ┊    MessagesOptionsComponent
+┊  ┊27┊    MessagesOptionsComponent,
+┊  ┊28┊    MessagesAttachmentsComponent
 ┊27┊29┊  ],
 ┊28┊30┊  imports: [
 ┊29┊31┊    IonicModule.forRoot(MyApp),
```
```diff
@@ -42,7 +44,8 @@
 ┊42┊44┊    ProfilePage,
 ┊43┊45┊    ChatsOptionsComponent,
 ┊44┊46┊    NewChatComponent,
-┊45┊  ┊    MessagesOptionsComponent
+┊  ┊47┊    MessagesOptionsComponent,
+┊  ┊48┊    MessagesAttachmentsComponent
 ┊46┊49┊  ],
 ┊47┊50┊  providers: [
 ┊48┊51┊    { provide: ErrorHandler, useClass: IonicErrorHandler },
```
[}]: #

We will add a generic style-sheet for the attachments menu since it can also use us in the future:

[{]: <helper> (diff_step 11.9)
#### Step 11.9: Added styles for the popover container

##### Changed client/imports/app/app.scss
```diff
@@ -18,3 +18,15 @@
 ┊18┊18┊  left: calc(100% - #{$options-popover-width} - #{$options-popover-margin}) !important;
 ┊19┊19┊  top: $options-popover-margin !important;
 ┊20┊20┊}
+┊  ┊21┊
+┊  ┊22┊// Attachments Popover Component
+┊  ┊23┊// --------------------------------------------------
+┊  ┊24┊
+┊  ┊25┊$attachments-popover-width: 100%;
+┊  ┊26┊
+┊  ┊27┊.attachments-popover .popover-content {
+┊  ┊28┊  width: $attachments-popover-width;
+┊  ┊29┊  transform-origin: 300px 30px !important;
+┊  ┊30┊  left: calc(100% - #{$attachments-popover-width}) !important;
+┊  ┊31┊  top: 58px !important;
+┊  ┊32┊}
```
[}]: #

Now we will add a handler in the `MessagesPage` which will open the newly created menu, and we will bind it to the view:

[{]: <helper> (diff_step 11.10)
#### Step 11.10: Add showAttachments method

##### Changed client/imports/pages/messages/messages.ts
```diff
@@ -6,6 +6,7 @@
 ┊ 6┊ 6┊import { Observable, Subscription, Subscriber } from 'rxjs';
 ┊ 7┊ 7┊import { Messages } from '../../../../imports/collections';
 ┊ 8┊ 8┊import { Chat, Message, MessageType } from '../../../../imports/models';
+┊  ┊ 9┊import { MessagesAttachmentsComponent } from './messages-attachments';
 ┊ 9┊10┊import { MessagesOptionsComponent } from './messages-options';
 ┊10┊11┊import template from './messages.html';
 ┊11┊12┊
```
```diff
@@ -211,4 +212,18 @@
 ┊211┊212┊      this.message = '';
 ┊212┊213┊    });
 ┊213┊214┊  }
-┊214┊   ┊}🚫↵
+┊   ┊215┊
+┊   ┊216┊  showAttachments(): void {
+┊   ┊217┊    const popover = this.popoverCtrl.create(MessagesAttachmentsComponent, {
+┊   ┊218┊      chat: this.selectedChat
+┊   ┊219┊    }, {
+┊   ┊220┊      cssClass: 'attachments-popover'
+┊   ┊221┊    });
+┊   ┊222┊
+┊   ┊223┊    popover.onDidDismiss((params) => {
+┊   ┊224┊      // TODO: Handle result
+┊   ┊225┊    });
+┊   ┊226┊
+┊   ┊227┊    popover.present();
+┊   ┊228┊  }
+┊   ┊229┊}
```
[}]: #

[{]: <helper> (diff_step 11.11)
#### Step 11.11: Bind click event to showAttachments

##### Changed client/imports/pages/messages/messages.html
```diff
@@ -7,7 +7,7 @@
 ┊ 7┊ 7┊    <ion-title class="chat-title">{{title}}</ion-title>
 ┊ 8┊ 8┊
 ┊ 9┊ 9┊    <ion-buttons end>
-┊10┊  ┊      <button ion-button icon-only class="attach-button"><ion-icon name="attach"></ion-icon></button>
+┊  ┊10┊      <button ion-button icon-only class="attach-button" (click)="showAttachments()"><ion-icon name="attach"></ion-icon></button>
 ┊11┊11┊      <button ion-button icon-only class="options-button" (click)="showOptions()"><ion-icon name="more"></ion-icon></button>
 ┊12┊12┊    </ion-buttons>
 ┊13┊13┊  </ion-navbar>
```
[}]: #

## Sending Location

A location is a composition of longitude, latitude and an altitude, or in short: `long, lat, alt`. Let's define a new `Location` model which will represent the mentioned schema:

[{]: <helper> (diff_step 11.12)
#### Step 11.12: Added location model

##### Changed imports/models.ts
```diff
@@ -32,4 +32,10 @@
 ┊32┊32┊
 ┊33┊33┊export interface User extends Meteor.User {
 ┊34┊34┊  profile?: Profile;
-┊35┊  ┊}🚫↵
+┊  ┊35┊}
+┊  ┊36┊
+┊  ┊37┊export interface Location {
+┊  ┊38┊  lat: number;
+┊  ┊39┊  lng: number;
+┊  ┊40┊  zoom: number;
+┊  ┊41┊}
```
[}]: #

Up next, would be implementing the actual component which will handle geo-location sharing:

[{]: <helper> (diff_step 11.13)
#### Step 11.13: Implement location message component

##### Added client/imports/pages/messages/location-message.ts
```diff
@@ -0,0 +1,74 @@
+┊  ┊ 1┊import { Component, OnInit, OnDestroy } from '@angular/core';
+┊  ┊ 2┊import { Platform, ViewController } from 'ionic-angular';
+┊  ┊ 3┊import { Geolocation } from 'ionic-native';
+┊  ┊ 4┊import { Observable, Subscription } from 'rxjs';
+┊  ┊ 5┊import { Location } from '../../../../imports/models';
+┊  ┊ 6┊import template from './location-message.html';
+┊  ┊ 7┊
+┊  ┊ 8┊const DEFAULT_ZOOM = 8;
+┊  ┊ 9┊const EQUATOR = 40075004;
+┊  ┊10┊const DEFAULT_LAT = 51.678418;
+┊  ┊11┊const DEFAULT_LNG = 7.809007;
+┊  ┊12┊const LOCATION_REFRESH_INTERVAL = 500;
+┊  ┊13┊
+┊  ┊14┊@Component({
+┊  ┊15┊  template
+┊  ┊16┊})
+┊  ┊17┊export class NewLocationMessageComponent implements OnInit, OnDestroy {
+┊  ┊18┊  lat: number = DEFAULT_LAT;
+┊  ┊19┊  lng: number = DEFAULT_LNG;
+┊  ┊20┊  zoom: number = DEFAULT_ZOOM;
+┊  ┊21┊  accuracy: number = -1;
+┊  ┊22┊  intervalObs: Subscription;
+┊  ┊23┊
+┊  ┊24┊  constructor(private platform: Platform, private viewCtrl: ViewController) {
+┊  ┊25┊  }
+┊  ┊26┊
+┊  ┊27┊  ngOnInit() {
+┊  ┊28┊    // Refresh location at a specific refresh rate
+┊  ┊29┊    this.intervalObs = this.reloadLocation()
+┊  ┊30┊      .flatMapTo(Observable
+┊  ┊31┊        .interval(LOCATION_REFRESH_INTERVAL)
+┊  ┊32┊        .timeInterval())
+┊  ┊33┊      .subscribe(() => {
+┊  ┊34┊        this.reloadLocation();
+┊  ┊35┊      });
+┊  ┊36┊  }
+┊  ┊37┊
+┊  ┊38┊  ngOnDestroy() {
+┊  ┊39┊    // Dispose subscription
+┊  ┊40┊    if (this.intervalObs) {
+┊  ┊41┊      this.intervalObs.unsubscribe();
+┊  ┊42┊    }
+┊  ┊43┊  }
+┊  ┊44┊
+┊  ┊45┊  calculateZoomByAccureacy(accuracy: number): number {
+┊  ┊46┊    // Source: http://stackoverflow.com/a/25143326
+┊  ┊47┊    const deviceHeight = this.platform.height();
+┊  ┊48┊    const deviceWidth = this.platform.width();
+┊  ┊49┊    const screenSize = Math.min(deviceWidth, deviceHeight);
+┊  ┊50┊    const requiredMpp = accuracy / screenSize;
+┊  ┊51┊
+┊  ┊52┊    return ((Math.log(EQUATOR / (256 * requiredMpp))) / Math.log(2)) + 1;
+┊  ┊53┊  }
+┊  ┊54┊
+┊  ┊55┊  reloadLocation() {
+┊  ┊56┊    return Observable.fromPromise(Geolocation.getCurrentPosition().then((position) => {
+┊  ┊57┊      if (this.lat && this.lng) {
+┊  ┊58┊        // Update view-models to represent the current geo-location
+┊  ┊59┊        this.accuracy = position.coords.accuracy;
+┊  ┊60┊        this.lat = position.coords.latitude;
+┊  ┊61┊        this.lng = position.coords.longitude;
+┊  ┊62┊        this.zoom = this.calculateZoomByAccureacy(this.accuracy);
+┊  ┊63┊      }
+┊  ┊64┊    }));
+┊  ┊65┊  }
+┊  ┊66┊
+┊  ┊67┊  sendLocation() {
+┊  ┊68┊    this.viewCtrl.dismiss(<Location>{
+┊  ┊69┊      lat: this.lat,
+┊  ┊70┊      lng: this.lng,
+┊  ┊71┊      zoom: this.zoom
+┊  ┊72┊    });
+┊  ┊73┊  }
+┊  ┊74┊}
```
[}]: #

Basically, what this component does is refreshing the current geo-location at a specific refresh rate. Note that in order to fetch the geo-location we use `Geolocation's` API, but behind the scene it uses ``cordova-plugin-geolocation`. The `sendLocation` method dismisses the view and returns the calculated geo-location. Now let's added the component's corresponding view:

[{]: <helper> (diff_step 11.14)
#### Step 11.14: Added location message template

##### Added client/imports/pages/messages/location-message.html
```diff
@@ -0,0 +1,22 @@
+┊  ┊ 1┊<ion-header>
+┊  ┊ 2┊  <ion-toolbar color="whatsapp">
+┊  ┊ 3┊    <ion-title>Send Location</ion-title>
+┊  ┊ 4┊
+┊  ┊ 5┊    <ion-buttons end>
+┊  ┊ 6┊      <button ion-button class="dismiss-button" (click)="viewCtrl.dismiss()"><ion-icon name="close"></ion-icon></button>
+┊  ┊ 7┊    </ion-buttons>
+┊  ┊ 8┊  </ion-toolbar>
+┊  ┊ 9┊</ion-header>
+┊  ┊10┊
+┊  ┊11┊<ion-content class="location-message-content">
+┊  ┊12┊  <ion-list>
+┊  ┊13┊    <sebm-google-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
+┊  ┊14┊      <sebm-google-map-marker [latitude]="lat" [longitude]="lng"></sebm-google-map-marker>
+┊  ┊15┊    </sebm-google-map>
+┊  ┊16┊    <ion-item (click)="sendLocation()">
+┊  ┊17┊      <ion-icon name="compass" item-left></ion-icon>
+┊  ┊18┊      <h2>Send your current location</h2>
+┊  ┊19┊      <p *ngIf="accuracy !== -1">Accurate to {{accuracy}} meters</p>
+┊  ┊20┊    </ion-item>
+┊  ┊21┊  </ion-list>
+┊  ┊22┊</ion-content>
```
[}]: #

The `sebm-google-map` is the component which represents the map itself, and we provide it with `lat`, `lng` and `zoom`, so the map can be focused on the current geo-location. If you'll notice, we also used the `sebm-google-map-marker` component with the same data-models, so the marker will be shown right in the center of the map.

Now we will add some `CSS` to make sure the map is visible:

[{]: <helper> (diff_step 11.15)
#### Step 11.15: Added location message stylesheet

##### Added client/imports/pages/messages/location-message.scss
```diff
@@ -0,0 +1,14 @@
+┊  ┊ 1┊.location-message-content {
+┊  ┊ 2┊  .scroll-content {
+┊  ┊ 3┊    margin-top: 44px;
+┊  ┊ 4┊  }
+┊  ┊ 5┊
+┊  ┊ 6┊  sebm-google-map {
+┊  ┊ 7┊    padding: 0;
+┊  ┊ 8┊  }
+┊  ┊ 9┊
+┊  ┊10┊  .sebm-google-map-container {
+┊  ┊11┊    height: 300px;
+┊  ┊12┊    margin-top: -15px;
+┊  ┊13┊  }
+┊  ┊14┊}
```
[}]: #

And we will import the component:

[{]: <helper> (diff_step 11.16)
#### Step 11.16: Import NewLocationMessageComponent

##### Changed client/imports/app/app.module.ts
```diff
@@ -9,6 +9,7 @@
 ┊ 9┊ 9┊import { MessagesPage } from '../pages/messages/messages';
 ┊10┊10┊import { MessagesAttachmentsComponent } from '../pages/messages/messages-attachments';
 ┊11┊11┊import { MessagesOptionsComponent } from '../pages/messages/messages-options';
+┊  ┊12┊import { NewLocationMessageComponent } from '../pages/messages/location-message';
 ┊12┊13┊import { ProfilePage } from '../pages/profile/profile';
 ┊13┊14┊import { VerificationPage } from '../pages/verification/verification';
 ┊14┊15┊import { PhoneService } from '../services/phone';
```
```diff
@@ -25,7 +26,8 @@
 ┊25┊26┊    ChatsOptionsComponent,
 ┊26┊27┊    NewChatComponent,
 ┊27┊28┊    MessagesOptionsComponent,
-┊28┊  ┊    MessagesAttachmentsComponent
+┊  ┊29┊    MessagesAttachmentsComponent,
+┊  ┊30┊    NewLocationMessageComponent
 ┊29┊31┊  ],
 ┊30┊32┊  imports: [
 ┊31┊33┊    IonicModule.forRoot(MyApp),
```
```diff
@@ -45,7 +47,8 @@
 ┊45┊47┊    ChatsOptionsComponent,
 ┊46┊48┊    NewChatComponent,
 ┊47┊49┊    MessagesOptionsComponent,
-┊48┊  ┊    MessagesAttachmentsComponent
+┊  ┊50┊    MessagesAttachmentsComponent,
+┊  ┊51┊    NewLocationMessageComponent
 ┊49┊52┊  ],
 ┊50┊53┊  providers: [
 ┊51┊54┊    { provide: ErrorHandler, useClass: IonicErrorHandler },
```
[}]: #

The component is ready. The only thing left to do would be revealing it. So we will add the appropriate handler in the `MessagesAttachmentsComponent`:

[{]: <helper> (diff_step 11.17)
#### Step 11.17: Implement the sendLocation message to display the new location modal

##### Changed client/imports/pages/messages/messages-attachments.ts
```diff
@@ -1,5 +1,7 @@
 ┊1┊1┊import { Component } from '@angular/core';
 ┊2┊2┊import { AlertController, Platform, ModalController, ViewController } from 'ionic-angular';
+┊ ┊3┊import { MessageType } from '../../../../imports/models';
+┊ ┊4┊import { NewLocationMessageComponent } from './location-message';
 ┊3┊5┊import template from './messages-attachments.html';
 ┊4┊6┊
 ┊5┊7┊@Component({
```
```diff
@@ -12,4 +14,22 @@
 ┊12┊14┊    private viewCtrl: ViewController,
 ┊13┊15┊    private modelCtrl: ModalController
 ┊14┊16┊  ) {}
+┊  ┊17┊
+┊  ┊18┊  sendLocation(): void {
+┊  ┊19┊    const locationModal = this.modelCtrl.create(NewLocationMessageComponent);
+┊  ┊20┊    locationModal.onDidDismiss((location) => {
+┊  ┊21┊      if (!location) {
+┊  ┊22┊        this.viewCtrl.dismiss();
+┊  ┊23┊
+┊  ┊24┊        return;
+┊  ┊25┊      }
+┊  ┊26┊
+┊  ┊27┊      this.viewCtrl.dismiss({
+┊  ┊28┊        messageType: MessageType.LOCATION,
+┊  ┊29┊        selectedLocation: location
+┊  ┊30┊      });
+┊  ┊31┊    });
+┊  ┊32┊
+┊  ┊33┊    locationModal.present();
+┊  ┊34┊  }
 ┊15┊35┊}
```
[}]: #

And we will bind it to its view:

[{]: <helper> (diff_step 11.18)
#### Step 11.18: Bind click event to sendLocation

##### Changed client/imports/pages/messages/messages-attachments.html
```diff
@@ -10,7 +10,7 @@
 ┊10┊10┊      <div class="attachment-name">Camera</div>
 ┊11┊11┊    </button>
 ┊12┊12┊
-┊13┊  ┊    <button ion-item class="attachment attachment-location">
+┊  ┊13┊    <button ion-item class="attachment attachment-location" (click)="sendLocation()">
 ┊14┊14┊      <ion-icon name="locate" class="attachment-icon"></ion-icon>
 ┊15┊15┊      <div class="attachment-name">Location</div>
 ┊16┊16┊    </button>
```
[}]: #

Now we will implement a new method in the `MessagesPage`, called `sendLocationMessage`, which will create a string representation of the current geo-location and send it to the server:

[{]: <helper> (diff_step 11.19)
#### Step 11.19: Implement send location message

##### Changed client/imports/pages/messages/messages.ts
```diff
@@ -5,7 +5,7 @@
 ┊ 5┊ 5┊import * as Moment from 'moment';
 ┊ 6┊ 6┊import { Observable, Subscription, Subscriber } from 'rxjs';
 ┊ 7┊ 7┊import { Messages } from '../../../../imports/collections';
-┊ 8┊  ┊import { Chat, Message, MessageType } from '../../../../imports/models';
+┊  ┊ 8┊import { Chat, Message, MessageType, Location } from '../../../../imports/models';
 ┊ 9┊ 9┊import { MessagesAttachmentsComponent } from './messages-attachments';
 ┊10┊10┊import { MessagesOptionsComponent } from './messages-options';
 ┊11┊11┊import template from './messages.html';
```
```diff
@@ -213,6 +213,16 @@
 ┊213┊213┊    });
 ┊214┊214┊  }
 ┊215┊215┊
+┊   ┊216┊  sendLocationMessage(location: Location): void {
+┊   ┊217┊    MeteorObservable.call('addMessage', MessageType.LOCATION,
+┊   ┊218┊      this.selectedChat._id,
+┊   ┊219┊      `${location.lat},${location.lng},${location.zoom}`
+┊   ┊220┊    ).zone().subscribe(() => {
+┊   ┊221┊      // Zero the input field
+┊   ┊222┊      this.message = '';
+┊   ┊223┊    });
+┊   ┊224┊  }
+┊   ┊225┊
 ┊216┊226┊  showAttachments(): void {
 ┊217┊227┊    const popover = this.popoverCtrl.create(MessagesAttachmentsComponent, {
 ┊218┊228┊      chat: this.selectedChat
```
```diff
@@ -221,7 +231,12 @@
 ┊221┊231┊    });
 ┊222┊232┊
 ┊223┊233┊    popover.onDidDismiss((params) => {
-┊224┊   ┊      // TODO: Handle result
+┊   ┊234┊      if (params) {
+┊   ┊235┊        if (params.messageType === MessageType.LOCATION) {
+┊   ┊236┊          const location = params.selectedLocation;
+┊   ┊237┊          this.sendLocationMessage(location);
+┊   ┊238┊        }
+┊   ┊239┊      }
 ┊225┊240┊    });
 ┊226┊241┊
 ┊227┊242┊    popover.present();
```
[}]: #

This requires us to update the `addMessage` method in the server so it can support location typed messages:

[{]: <helper> (diff_step 11.20)
#### Step 11.20: Allow location message type on server side

##### Changed server/methods.ts
```diff
@@ -73,7 +73,7 @@
 ┊73┊73┊    if (!this.userId) throw new Meteor.Error('unauthorized',
 ┊74┊74┊      'User must be logged-in to create a new chat');
 ┊75┊75┊
-┊76┊  ┊    check(type, Match.OneOf(String, [ MessageType.TEXT ]));
+┊  ┊76┊    check(type, Match.OneOf(String, [ MessageType.TEXT, MessageType.LOCATION ]));
 ┊77┊77┊    check(chatId, nonEmptyString);
 ┊78┊78┊    check(content, nonEmptyString);
```
[}]: #

## Viewing Location Messages

The infrastructure is ready, but we can't yet see the message, therefore, we will need to add support for location messages in the `MessagesPage` view:

[{]: <helper> (diff_step 11.21)
#### Step 11.21: Implement location message view

##### Changed client/imports/pages/messages/messages.html
```diff
@@ -19,6 +19,12 @@
 ┊19┊19┊      <div *ngFor="let message of day.messages" class="message-wrapper">
 ┊20┊20┊        <div [class]="'message message-' + message.ownership">
 ┊21┊21┊          <div *ngIf="message.type == 'text'" class="message-content message-content-text">{{message.content}}</div>
+┊  ┊22┊          <div *ngIf="message.type == 'location'" class="message-content message-content-text">
+┊  ┊23┊            <sebm-google-map [zoom]="getLocation(message.content).zoom" [latitude]="getLocation(message.content).lat" [longitude]="getLocation(message.content).lng">
+┊  ┊24┊              <sebm-google-map-marker [latitude]="getLocation(message.content).lat" [longitude]="getLocation(message.content).lng"></sebm-google-map-marker>
+┊  ┊25┊            </sebm-google-map>
+┊  ┊26┊          </div>
+┊  ┊27┊
 ┊22┊28┊          <span class="message-timestamp">{{ message.createdAt | amDateFormat: 'HH:mm' }}</span>
 ┊23┊29┊        </div>
 ┊24┊30┊      </div>
```
[}]: #

These additions looks pretty similar to the `LocationMessage` since they are based on the same core components.

We will now add a method which can parse a string representation of the location into an actual `JSON`:

[{]: <helper> (diff_step 11.22)
#### Step 11.22: Implement getLocation for parsing the location

##### Changed client/imports/pages/messages/messages.ts
```diff
@@ -241,4 +241,14 @@
 ┊241┊241┊
 ┊242┊242┊    popover.present();
 ┊243┊243┊  }
+┊   ┊244┊
+┊   ┊245┊  getLocation(locationString: string): Location {
+┊   ┊246┊    const splitted = locationString.split(',').map(Number);
+┊   ┊247┊
+┊   ┊248┊    return <Location>{
+┊   ┊249┊      lat: splitted[0],
+┊   ┊250┊      lng: splitted[1],
+┊   ┊251┊      zoom: Math.min(splitted[2] || 0, 19)
+┊   ┊252┊    };
+┊   ┊253┊  }
 ┊244┊254┊}
```
[}]: #

And we will make some final adjustments for the view so the map can be presented properly:

[{]: <helper> (diff_step 11.23)
#### Step 11.23: Added map styles

##### Changed client/imports/pages/messages/messages.scss
```diff
@@ -93,6 +93,11 @@
 ┊ 93┊ 93┊        content: " \00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0";
 ┊ 94┊ 94┊        display: inline;
 ┊ 95┊ 95┊      }
+┊   ┊ 96┊
+┊   ┊ 97┊      .sebm-google-map-container {
+┊   ┊ 98┊        height: 25vh;
+┊   ┊ 99┊        width: 35vh;
+┊   ┊100┊      }
 ┊ 96┊101┊    }
 ┊ 97┊102┊
 ┊ 98┊103┊    .message-timestamp {
```
[}]: #

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step10.md) | [Next Step >](step12.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #