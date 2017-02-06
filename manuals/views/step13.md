[{]: <region> (header)
# Step 13: Native Mobile
[}]: #
[{]: <region> (body)
In this step, we will be implementing additional native features, to enhance the user experience.

## Automatic phone number detection

`Ionic 2` is provided by default with a `Cordova` plug-in called `cordova-plugin-sim`, which allows us to retrieve some data from the current device's SIM card, if even exists. We will use the SIM card to automatically detect the current device's phone number, so this way the user won't need to manually fill-in his phone number whenever he tries to login. We will start by adding the appropriate handler in the `PhoneService`:

[{]: <helper> (diff_step 13.1)
#### Step 13.1: Implement getNumber with native ionic

##### Changed client/imports/services/phone.ts
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import { Injectable } from '@angular/core';
 ┊2┊2┊import { Platform } from 'ionic-angular';
+┊ ┊3┊import { Sim } from 'ionic-native';
 ┊3┊4┊import { Accounts } from 'meteor/accounts-base';
 ┊4┊5┊import { Meteor } from 'meteor/meteor';
 ┊5┊6┊
```
```diff
@@ -9,6 +10,17 @@
 ┊ 9┊10┊
 ┊10┊11┊  }
 ┊11┊12┊
+┊  ┊13┊  getNumber(): Promise<string> {
+┊  ┊14┊    if (!this.platform.is('cordova') ||
+┊  ┊15┊      !this.platform.is('mobile')) {
+┊  ┊16┊      return Promise.resolve('');
+┊  ┊17┊    }
+┊  ┊18┊
+┊  ┊19┊    return Sim.getSimInfo().then((info) => {
+┊  ┊20┊      return '+' + info.phoneNumber;
+┊  ┊21┊    });
+┊  ┊22┊  }
+┊  ┊23┊
 ┊12┊24┊  verify(phoneNumber: string): Promise<void> {
 ┊13┊25┊    return new Promise<void>((resolve, reject) => {
 ┊14┊26┊      Accounts.requestPhoneVerification(phoneNumber, (e: Error) => {
```
[}]: #

And we will use it inside the `LoginPage`:

[{]: <helper> (diff_step 13.2)
#### Step 13.2: Use getNumber native method

##### Changed client/imports/pages/login/login.ts
```diff
@@ -1,4 +1,4 @@
-┊1┊ ┊import { Component } from '@angular/core';
+┊ ┊1┊import { Component, AfterContentInit } from '@angular/core';
 ┊2┊2┊import { Alert, AlertController, NavController } from 'ionic-angular';
 ┊3┊3┊import { PhoneService } from '../../services/phone';
 ┊4┊4┊import { VerificationPage } from '../verification/verification';
```
```diff
@@ -7,7 +7,7 @@
 ┊ 7┊ 7┊@Component({
 ┊ 8┊ 8┊  template
 ┊ 9┊ 9┊})
-┊10┊  ┊export class LoginPage {
+┊  ┊10┊export class LoginPage implements AfterContentInit {
 ┊11┊11┊  phone = '';
 ┊12┊12┊
 ┊13┊13┊  constructor(
```
```diff
@@ -16,6 +16,14 @@
 ┊16┊16┊    private navCtrl: NavController
 ┊17┊17┊  ) {}
 ┊18┊18┊
+┊  ┊19┊  ngAfterContentInit() {
+┊  ┊20┊    this.phoneService.getNumber().then((phone) => {
+┊  ┊21┊      if (phone) {
+┊  ┊22┊        this.login(phone);
+┊  ┊23┊      }
+┊  ┊24┊    });
+┊  ┊25┊  }
+┊  ┊26┊
 ┊19┊27┊  onInputKeypress({keyCode}: KeyboardEvent): void {
 ┊20┊28┊    if (keyCode === 13) {
 ┊21┊29┊      this.login();
```
[}]: #

In-order for it to work, be sure to install the following `Cordova` plug-in:

    $ meteor add cordova:cordova-plugin-sim@1.2.1

## Camera

Next - we will grant access to the device's camera so we can send pictures which are yet to exist in the gallery.

We will start by adding the appropriate `Cordova` plug-in:

    $ meteor add cordova:cordova-plugin-camera@2.3.1

We will bind the `click` event in the `MessagesAttachmentsComponent`:

[{]: <helper> (diff_step 13.5)
#### Step 13.5: Added click event for takePicture

##### Changed client/imports/pages/messages/messages-attachments.html
```diff
@@ -5,7 +5,7 @@
 ┊ 5┊ 5┊      <div class="attachment-name">Gallery</div>
 ┊ 6┊ 6┊    </button>
 ┊ 7┊ 7┊
-┊ 8┊  ┊    <button ion-item class="attachment attachment-camera">
+┊  ┊ 8┊    <button ion-item class="attachment attachment-camera" (click)="takePicture()">
 ┊ 9┊ 9┊      <ion-icon name="camera" class="attachment-icon"></ion-icon>
 ┊10┊10┊      <div class="attachment-name">Camera</div>
 ┊11┊11┊    </button>
```
[}]: #

And we will use the recently installed `Cordova` plug-in in the event handler to take some pictures:

[{]: <helper> (diff_step 13.6)
#### Step 13.6: Implement takePicture

##### Changed client/imports/pages/messages/messages-attachments.ts
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import { Component } from '@angular/core';
 ┊2┊2┊import { AlertController, Platform, ModalController, ViewController } from 'ionic-angular';
+┊ ┊3┊import { Camera } from 'ionic-native';
 ┊3┊4┊import { PictureService } from '../../services/picture';
 ┊4┊5┊import { MessageType } from '../../../../imports/models';
 ┊5┊6┊import { NewLocationMessageComponent } from './location-message';
```
```diff
@@ -26,6 +27,21 @@
 ┊26┊27┊    });
 ┊27┊28┊  }
 ┊28┊29┊
+┊  ┊30┊  takePicture(): void {
+┊  ┊31┊    if (!this.platform.is('cordova')) {
+┊  ┊32┊      return console.warn('Device must run cordova in order to take pictures');
+┊  ┊33┊    }
+┊  ┊34┊
+┊  ┊35┊    Camera.getPicture().then((dataURI) => {
+┊  ┊36┊      const blob = this.pictureService.convertDataURIToBlob(dataURI);
+┊  ┊37┊
+┊  ┊38┊      this.viewCtrl.dismiss({
+┊  ┊39┊        messageType: MessageType.PICTURE,
+┊  ┊40┊        selectedPicture: blob
+┊  ┊41┊      });
+┊  ┊42┊    });
+┊  ┊43┊  }
+┊  ┊44┊
 ┊29┊45┊  sendLocation(): void {
 ┊30┊46┊    const locationModal = this.modelCtrl.create(NewLocationMessageComponent);
 ┊31┊47┊    locationModal.onDidDismiss((location) => {
```
[}]: #

Note that take pictures are retrieved as relative paths in the device, but we use some existing methods in the `PictureService` to convert these paths into the desired format.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step12.md) | [Next Step >](step14.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #