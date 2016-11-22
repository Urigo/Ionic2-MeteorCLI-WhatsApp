# Step 5: Authentication

In this step we will authenticate and identify users in our app.

Before we go ahead and start extending our app, we will add a few packages which will make our lives a bit less complex when it comes to authentication and users management.

Firt we will update our Meteor server and add few Meteor packages called `accounts-base` and `accounts-phone` which will give us the ability to verify a user using an SMS code:

    $ meteor add npm-bcrypt
    $ meteor add accounts-base
    $ meteor add mys:accounts-phone

We will also need to install their decleration files so Typescript know how to handle them:

    $ typings install dt~meteor-accounts-phone --save --global

For the sake of debugging we gonna write an authentication settings file (`private/settings.json`) which might make our life easier, but once your'e in production mode you *shouldn't* use this configuration:

[{]: <helper> (diff_step 5.3)
#### Step 5.3: Add authentication settings

##### Added private/settings.json
```diff
@@ -0,0 +1,8 @@
+┊ ┊1┊{
+┊ ┊2┊  "accounts-phone": {
+┊ ┊3┊    "verificationWaitTime": 0,
+┊ ┊4┊    "verificationRetriesWaitTime": 0,
+┊ ┊5┊    "adminPhoneNumbers": ["+9721234567", "+97212345678", "+97212345679"],
+┊ ┊6┊    "phoneVerificationMasterCode": "1234"
+┊ ┊7┊  }
+┊ ┊8┊}🚫↵
```
[}]: #

Now anytime we run our app we should provide it with a `settings.json`:

    $ meteor run --settings private/settings.json

To make it simpler we can add `start` script to `package.json`:

[{]: <helper> (diff_step 5.4)
#### Step 5.4: Run the App with settings

##### Changed package.json
```diff
@@ -2,7 +2,7 @@
 ┊2┊2┊  "name": "angular2-meteor-base",
 ┊3┊3┊  "private": true,
 ┊4┊4┊  "scripts": {
-┊5┊ ┊    "start": "meteor run",
+┊ ┊5┊    "start": "meteor run --settings private/settings.json",
 ┊6┊6┊    "test": "meteor test --driver-package practicalmeteor:mocha",
 ┊7┊7┊    "test:ci": "meteor test --once --driver-package dispatch:mocha-phantomjs",
 ┊8┊8┊    "postinstall": "typings i"
```
[}]: #

> *NOTE*: If you would like to test the verification with a real phone number, `accounts-phone` provides an easy access for [twilio's API](https://www.twilio.com/), for more information see [accounts-phone's repo](https://github.com/okland/accounts-phone).

We will now apply the settings file we've just created so it can actually take effect:

[{]: <helper> (diff_step 5.5)
#### Step 5.5: Define SMS settings

##### Added server/imports/api/sms.ts
```diff
@@ -0,0 +1,8 @@
+┊ ┊1┊import { Meteor } from 'meteor/meteor';
+┊ ┊2┊import { Accounts } from 'meteor/accounts-base';
+┊ ┊3┊ 
+┊ ┊4┊ 
+┊ ┊5┊if (Meteor.settings) {
+┊ ┊6┊  Object.assign(Accounts._options, Meteor.settings['accounts-phone']);
+┊ ┊7┊  SMS.twilio = Meteor.settings['twilio'];
+┊ ┊8┊}🚫↵
```
[}]: #

We created `server/imports/api/sms.ts` file, now we have to import it inside `main.ts`:

[{]: <helper> (diff_step 5.6)
#### Step 5.6: Import those settings

##### Changed server/main.ts
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import { Main } from './imports/server-main/main';
 ┊2┊2┊import './imports/methods/methods';
+┊ ┊3┊import './imports/api/sms';
 ┊3┊4┊
 ┊4┊5┊const mainInstance = new Main();
 ┊5┊6┊mainInstance.start();
```
[}]: #

For authentication we're going to create the following flow in our app:

- login - The initial page. Ask for the user's phone number.
- verification - Verify a user's phone number by an SMS authentication.
- profile - Ask a user to pickup its name. Afterwards he will be promoted to the tabs page.

Before we implement these page, we need to identify if a user is currently logged in. If so, he will be automatically promoted to the chats view, if not, he is going to be promoted to the login view and enter a phone number.

Let's apply this feature to our app's main component:

[{]: <helper> (diff_step 5.7)
#### Step 5.7: Wait for user if logging in

##### Changed client/main.ts
```diff
@@ -3,10 +3,19 @@
 ┊ 3┊ 3┊import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 ┊ 4┊ 4┊import { enableProdMode } from '@angular/core';
 ┊ 5┊ 5┊import { Meteor } from "meteor/meteor";
+┊  ┊ 6┊import { MeteorObservable } from 'meteor-rxjs';
 ┊ 6┊ 7┊import { AppModule } from './imports/app/app.module';
 ┊ 7┊ 8┊
 ┊ 8┊ 9┊enableProdMode();
 ┊ 9┊10┊
 ┊10┊11┊Meteor.startup(() => {
-┊11┊  ┊   platformBrowserDynamic().bootstrapModule(AppModule);
+┊  ┊12┊  const sub = MeteorObservable.autorun().subscribe(() => {
+┊  ┊13┊    if (Meteor.loggingIn()) return;
+┊  ┊14┊    
+┊  ┊15┊    setTimeout(() => {
+┊  ┊16┊      sub.unsubscribe();
+┊  ┊17┊    });
+┊  ┊18┊    
+┊  ┊19┊    platformBrowserDynamic().bootstrapModule(AppModule);
+┊  ┊20┊  });
 ┊12┊21┊});
```
[}]: #

We don't have yet a proper component with auth logic but let's add it anyway as `LoginComponent`:

[{]: <helper> (diff_step 5.8)
#### Step 5.8: Use LoginComponent if user is not logged in

##### Changed client/imports/app/app.component.ts
```diff
@@ -1,17 +1,20 @@
 ┊ 1┊ 1┊import { Component } from '@angular/core';
 ┊ 2┊ 2┊import { Platform } from "ionic-angular";
 ┊ 3┊ 3┊import { StatusBar } from "ionic-native";
+┊  ┊ 4┊import { Meteor } from 'meteor/meteor';
 ┊ 4┊ 5┊import template from './app.component.html';
 ┊ 5┊ 6┊import {TabsContainerComponent} from "../pages/tabs-container/tabs-container.component";
+┊  ┊ 7┊import {LoginComponent} from '../pages/auth/login.component';
 ┊ 6┊ 8┊
 ┊ 7┊ 9┊@Component({
 ┊ 8┊10┊  selector: 'app',
 ┊ 9┊11┊  template
 ┊10┊12┊})
 ┊11┊13┊export class AppComponent {
-┊12┊  ┊  rootPage = TabsContainerComponent;
+┊  ┊14┊  rootPage: any;
 ┊13┊15┊
 ┊14┊16┊  constructor(platform: Platform) {
+┊  ┊17┊    this.rootPage = Meteor.user() ? TabsContainerComponent : LoginComponent;
 ┊15┊18┊    platform.ready().then(() => {
 ┊16┊19┊      // Okay, so the platform is ready and our plugins are available.
 ┊17┊20┊      // Here you can do any higher level native things you might need.
```
[}]: #

Great, now that we're set, let's start implementing the views we mentioned earlier. We will start with the login component.

In this component we will request an SMS verification right after a phone number has been entered:

[{]: <helper> (diff_step 5.9)
#### Step 5.9: Create LoginComponent

##### Added client/imports/pages/auth/login.component.ts
```diff
@@ -0,0 +1,74 @@
+┊  ┊ 1┊import { Component } from '@angular/core';
+┊  ┊ 2┊import { NavController, AlertController } from 'ionic-angular';
+┊  ┊ 3┊import { Accounts } from 'meteor/accounts-base';
+┊  ┊ 4┊import { VerificationComponent } from './verification.component';
+┊  ┊ 5┊import template from './login.component.html';
+┊  ┊ 6┊import style from "./login.component.scss";
+┊  ┊ 7┊ 
+┊  ┊ 8┊@Component({
+┊  ┊ 9┊  selector: 'login',
+┊  ┊10┊  template,
+┊  ┊11┊  styles: [
+┊  ┊12┊    style
+┊  ┊13┊  ]
+┊  ┊14┊})
+┊  ┊15┊export class LoginComponent {
+┊  ┊16┊  phone = '';
+┊  ┊17┊ 
+┊  ┊18┊  constructor(
+┊  ┊19┊    private navCtrl: NavController,
+┊  ┊20┊    private alertCtrl: AlertController
+┊  ┊21┊    ) {}
+┊  ┊22┊ 
+┊  ┊23┊  onInputKeypress({keyCode}: KeyboardEvent): void {
+┊  ┊24┊    if (keyCode == 13) {
+┊  ┊25┊      this.login();
+┊  ┊26┊    }
+┊  ┊27┊  }
+┊  ┊28┊ 
+┊  ┊29┊  login(): void {
+┊  ┊30┊    const alert = this.alertCtrl.create({
+┊  ┊31┊      title: 'Confirm',
+┊  ┊32┊      message: `Would you like to proceed with the phone number ${this.phone}?`,
+┊  ┊33┊      buttons: [
+┊  ┊34┊        {
+┊  ┊35┊          text: 'Cancel',
+┊  ┊36┊          role: 'cancel'
+┊  ┊37┊        },
+┊  ┊38┊        {
+┊  ┊39┊          text: 'Yes',
+┊  ┊40┊          handler: () => {
+┊  ┊41┊            this.handleLogin(alert);
+┊  ┊42┊            return false;
+┊  ┊43┊          }
+┊  ┊44┊        }
+┊  ┊45┊      ]
+┊  ┊46┊    });
+┊  ┊47┊ 
+┊  ┊48┊    alert.present();
+┊  ┊49┊  }
+┊  ┊50┊ 
+┊  ┊51┊  private handleLogin(alert): void {
+┊  ┊52┊    Accounts.requestPhoneVerification(this.phone, (e: Error) => {
+┊  ┊53┊      alert.dismiss().then(() => {
+┊  ┊54┊        if (e) return this.handleError(e);
+┊  ┊55┊ 
+┊  ┊56┊        this.navCtrl.push(VerificationComponent, {
+┊  ┊57┊          phone: this.phone
+┊  ┊58┊        });
+┊  ┊59┊      });
+┊  ┊60┊    });
+┊  ┊61┊  }
+┊  ┊62┊ 
+┊  ┊63┊  private handleError(e: Error): void {
+┊  ┊64┊    console.error(e);
+┊  ┊65┊ 
+┊  ┊66┊    const alert = this.alertCtrl.create({
+┊  ┊67┊      title: 'Oops!',
+┊  ┊68┊      message: e.message,
+┊  ┊69┊      buttons: ['OK']
+┊  ┊70┊    });
+┊  ┊71┊ 
+┊  ┊72┊    alert.present();
+┊  ┊73┊  }
+┊  ┊74┊}🚫↵
```
[}]: #

Few things to be explained:

- `onInputKeypress` is to catch Enter key press
- `login` method creates an alert (see [documentation](http://ionicframework.com/docs/v2/components/#alert)) to confirm the action
- `handleError` creates an alert with an error message
- `handleLogin` calls `Accounts.requestPhoneVerification` request an SMS verification and moves to verification view.

Okay, the logic is clear. Let's move to the template:

[{]: <helper> (diff_step 5.1)
#### Step 5.1: Added accounts packages

##### Changed .meteor/packages
```diff
@@ -26,3 +26,6 @@
 ┊26┊26┊mobile-status-bar
 ┊27┊27┊launch-screen
 ┊28┊28┊check
+┊  ┊29┊accounts-base
+┊  ┊30┊mys:accounts-phone
+┊  ┊31┊npm-bcrypt
```

##### Changed .meteor/versions
```diff
@@ -1,3 +1,4 @@
+┊ ┊1┊accounts-base@1.2.14
 ┊1┊2┊allow-deny@1.0.5
 ┊2┊3┊angular2-compilers@0.6.6
 ┊3┊4┊autopublish@1.0.7
```
```diff
@@ -22,6 +23,7 @@
 ┊22┊23┊ddp@1.2.5
 ┊23┊24┊ddp-client@1.2.9
 ┊24┊25┊ddp-common@1.2.8
+┊  ┊26┊ddp-rate-limiter@1.0.6
 ┊25┊27┊ddp-server@1.2.10
 ┊26┊28┊deps@1.0.12
 ┊27┊29┊diff-sequence@1.0.7
```
```diff
@@ -30,6 +32,7 @@
 ┊30┊32┊ecmascript@0.5.9
 ┊31┊33┊ecmascript-runtime@0.3.15
 ┊32┊34┊ejson@1.0.13
+┊  ┊35┊email@1.0.16
 ┊33┊36┊es5-shim@4.6.15
 ┊34┊37┊geojson-utils@1.0.10
 ┊35┊38┊hot-code-push@1.0.4
```
```diff
@@ -42,6 +45,7 @@
 ┊42┊45┊jquery@1.11.10
 ┊43┊46┊launch-screen@1.1.0
 ┊44┊47┊livedata@1.0.18
+┊  ┊48┊localstorage@1.0.12
 ┊45┊49┊logging@1.1.16
 ┊46┊50┊meteor@1.6.0
 ┊47┊51┊meteor-base@1.0.4
```
```diff
@@ -53,7 +57,9 @@
 ┊53┊57┊modules-runtime@0.7.7
 ┊54┊58┊mongo@1.1.14
 ┊55┊59┊mongo-id@1.0.6
+┊  ┊60┊mys:accounts-phone@0.0.21
 ┊56┊61┊mys:fonts@0.0.2
+┊  ┊62┊npm-bcrypt@0.9.2
 ┊57┊63┊npm-mongo@2.2.11_2
 ┊58┊64┊observe-sequence@1.0.14
 ┊59┊65┊ordered-dict@1.0.9
```
```diff
@@ -64,13 +70,17 @@
 ┊64┊70┊practicalmeteor:sinon@1.14.1_2
 ┊65┊71┊promise@0.8.8
 ┊66┊72┊random@1.0.10
+┊  ┊73┊rate-limit@1.0.6
 ┊67┊74┊reactive-var@1.0.11
 ┊68┊75┊reload@1.1.11
 ┊69┊76┊retry@1.0.9
 ┊70┊77┊routepolicy@1.0.12
+┊  ┊78┊service-configuration@1.0.11
+┊  ┊79┊sha@1.0.9
 ┊71┊80┊shell-server@0.2.1
 ┊72┊81┊spacebars@1.0.13
 ┊73┊82┊spacebars-compiler@1.0.13
+┊  ┊83┊srp@1.0.10
 ┊74┊84┊standard-minifier-css@1.3.2
 ┊75┊85┊standard-minifier-js@1.2.1
 ┊76┊86┊templating@1.2.14_1
```
[}]: #

And styles:

[{]: <helper> (diff_step 5.11)
#### Step 5.11: Define styles

##### Added client/imports/pages/auth/login.component.scss
```diff
@@ -0,0 +1,11 @@
+┊  ┊ 1┊.login-page-content {
+┊  ┊ 2┊  .instructions {
+┊  ┊ 3┊    text-align: center;
+┊  ┊ 4┊    font-size: medium;
+┊  ┊ 5┊    margin: 50px;
+┊  ┊ 6┊  }
+┊  ┊ 7┊ 
+┊  ┊ 8┊  .text-input {
+┊  ┊ 9┊    text-align: center;
+┊  ┊10┊  }
+┊  ┊11┊}🚫↵
```
[}]: #

Our new component is not available yet:

[{]: <helper> (diff_step 5.12)
#### Step 5.12: Register LoginComponent in the AppModule

##### Changed client/imports/app/app.module.ts
```diff
@@ -5,6 +5,7 @@
 ┊ 5┊ 5┊import {ChatsComponent} from "../pages/chats/chats.component";
 ┊ 6┊ 6┊import {MomentModule} from "angular2-moment";
 ┊ 7┊ 7┊import {MessagesPage} from "../pages/chat/messages-page.component";
+┊  ┊ 8┊import {LoginComponent} from '../pages/auth/login.component';
 ┊ 8┊ 9┊
 ┊ 9┊10┊@NgModule({
 ┊10┊11┊  // Components, Pipes, Directive
```
```diff
@@ -12,14 +13,16 @@
 ┊12┊13┊    AppComponent,
 ┊13┊14┊    TabsContainerComponent,
 ┊14┊15┊    ChatsComponent,
-┊15┊  ┊    MessagesPage
+┊  ┊16┊    MessagesPage,
+┊  ┊17┊    LoginComponent
 ┊16┊18┊  ],
 ┊17┊19┊  // Entry Components
 ┊18┊20┊  entryComponents: [
 ┊19┊21┊    AppComponent,
 ┊20┊22┊    TabsContainerComponent,
 ┊21┊23┊    ChatsComponent,
-┊22┊  ┊    MessagesPage
+┊  ┊24┊    MessagesPage,
+┊  ┊25┊    LoginComponent
 ┊23┊26┊  ],
 ┊24┊27┊  // Providers
 ┊25┊28┊  providers: [
```
[}]: #

That's great, everything is set up. We can now move to verification page.

Let's create a component called `VerificationComponent`:

[{]: <helper> (diff_step 5.13)
#### Step 5.13: Add VerificationComponent

##### Added client/imports/pages/auth/verification.component.ts
```diff
@@ -0,0 +1,59 @@
+┊  ┊ 1┊import {Component, OnInit, NgZone} from '@angular/core';
+┊  ┊ 2┊import {NavController, NavParams, AlertController} from 'ionic-angular';
+┊  ┊ 3┊import {Accounts} from 'meteor/accounts-base';
+┊  ┊ 4┊import {ProfileComponent} from './profile.component';
+┊  ┊ 5┊import template from './verification.component.html';
+┊  ┊ 6┊import style from './verification.component.scss';
+┊  ┊ 7┊ 
+┊  ┊ 8┊ 
+┊  ┊ 9┊@Component({
+┊  ┊10┊  selector: 'verification',
+┊  ┊11┊  template,
+┊  ┊12┊  styles: [
+┊  ┊13┊    style
+┊  ┊14┊  ]
+┊  ┊15┊})
+┊  ┊16┊export class VerificationComponent implements OnInit {
+┊  ┊17┊  code: string = '';
+┊  ┊18┊  phone: string;
+┊  ┊19┊ 
+┊  ┊20┊  constructor(
+┊  ┊21┊    private navCtrl: NavController,
+┊  ┊22┊    private alertCtrl: AlertController, 
+┊  ┊23┊    private zone: NgZone, 
+┊  ┊24┊    private navParams: NavParams) {}
+┊  ┊25┊  
+┊  ┊26┊  ngOnInit() {
+┊  ┊27┊    this.phone = this.navParams.get('phone');
+┊  ┊28┊  }
+┊  ┊29┊ 
+┊  ┊30┊  onInputKeypress({keyCode}: KeyboardEvent): void {
+┊  ┊31┊    if (keyCode == 13) {
+┊  ┊32┊      this.verify();
+┊  ┊33┊    }
+┊  ┊34┊  }
+┊  ┊35┊ 
+┊  ┊36┊  verify(): void {
+┊  ┊37┊    Accounts.verifyPhone(this.phone, this.code, (e: Error) => {
+┊  ┊38┊      this.zone.run(() => {
+┊  ┊39┊        if (e) return this.handleError(e);
+┊  ┊40┊ 
+┊  ┊41┊        this.navCtrl.setRoot(ProfileComponent, {}, {
+┊  ┊42┊          animate: true
+┊  ┊43┊        });
+┊  ┊44┊      });
+┊  ┊45┊    });
+┊  ┊46┊  }
+┊  ┊47┊ 
+┊  ┊48┊  private handleError(e: Error): void {
+┊  ┊49┊    console.error(e);
+┊  ┊50┊ 
+┊  ┊51┊    const alert = this.alertCtrl.create({
+┊  ┊52┊      title: 'Oops!',
+┊  ┊53┊      message: e.message,
+┊  ┊54┊      buttons: ['OK']
+┊  ┊55┊    });
+┊  ┊56┊ 
+┊  ┊57┊    alert.present();
+┊  ┊58┊  }
+┊  ┊59┊}🚫↵
```
[}]: #

Logic is pretty much the same as in LoginComponent. When verification succeed we redirect user to the `ProfileComponent`.

So let's add the view and the styles:

[{]: <helper> (diff_step 5.14)
#### Step 5.14: Create a template

##### Added client/imports/pages/auth/verification.component.html
```diff
@@ -0,0 +1,25 @@
+┊  ┊ 1┊<ion-header>
+┊  ┊ 2┊  <ion-navbar color="whatsapp">
+┊  ┊ 3┊    <ion-title>Verification</ion-title>
+┊  ┊ 4┊ 
+┊  ┊ 5┊    <ion-buttons end>
+┊  ┊ 6┊      <button ion-button class="verify-button" (click)="verify()">Verify</button>
+┊  ┊ 7┊    </ion-buttons>
+┊  ┊ 8┊  </ion-navbar>
+┊  ┊ 9┊</ion-header>
+┊  ┊10┊ 
+┊  ┊11┊<ion-content padding class="verification-page-content">
+┊  ┊12┊  <div class="instructions">
+┊  ┊13┊    <div>
+┊  ┊14┊      An SMS message with the verification code has been sent to {{phone}}.
+┊  ┊15┊    </div>
+┊  ┊16┊    <br>
+┊  ┊17┊    <div>
+┊  ┊18┊      To proceed, please enter the 4-digit verification code below.
+┊  ┊19┊    </div>
+┊  ┊20┊  </div>
+┊  ┊21┊ 
+┊  ┊22┊  <ion-item>
+┊  ┊23┊    <ion-input [(ngModel)]="code" (keypress)="onInputKeypress($event)" type="tel" placeholder="Your verification code"></ion-input>
+┊  ┊24┊  </ion-item>
+┊  ┊25┊</ion-content>🚫↵
```
[}]: #

[{]: <helper> (diff_step 5.15)
#### Step 5.15: Define styles

##### Added client/imports/pages/auth/verification.component.scss
```diff
@@ -0,0 +1,11 @@
+┊  ┊ 1┊.verification-page-content {
+┊  ┊ 2┊  .instructions {
+┊  ┊ 3┊    text-align: center;
+┊  ┊ 4┊    font-size: medium;
+┊  ┊ 5┊    margin: 50px;
+┊  ┊ 6┊  }
+┊  ┊ 7┊ 
+┊  ┊ 8┊  .text-input {
+┊  ┊ 9┊    text-align: center;
+┊  ┊10┊  }
+┊  ┊11┊}🚫↵
```
[}]: #

Make it available to AppModule:

[{]: <helper> (diff_step 5.16)
#### Step 5.16: Register VerificationComponent

##### Changed client/imports/app/app.module.ts
```diff
@@ -6,6 +6,7 @@
 ┊ 6┊ 6┊import {MomentModule} from "angular2-moment";
 ┊ 7┊ 7┊import {MessagesPage} from "../pages/chat/messages-page.component";
 ┊ 8┊ 8┊import {LoginComponent} from '../pages/auth/login.component';
+┊  ┊ 9┊import {VerificationComponent} from '../pages/auth/verification.component';
 ┊ 9┊10┊
 ┊10┊11┊@NgModule({
 ┊11┊12┊  // Components, Pipes, Directive
```
```diff
@@ -14,7 +15,8 @@
 ┊14┊15┊    TabsContainerComponent,
 ┊15┊16┊    ChatsComponent,
 ┊16┊17┊    MessagesPage,
-┊17┊  ┊    LoginComponent
+┊  ┊18┊    LoginComponent,
+┊  ┊19┊    VerificationComponent
 ┊18┊20┊  ],
 ┊19┊21┊  // Entry Components
 ┊20┊22┊  entryComponents: [
```
```diff
@@ -22,7 +24,8 @@
 ┊22┊24┊    TabsContainerComponent,
 ┊23┊25┊    ChatsComponent,
 ┊24┊26┊    MessagesPage,
-┊25┊  ┊    LoginComponent
+┊  ┊27┊    LoginComponent,
+┊  ┊28┊    VerificationComponent
 ┊26┊29┊  ],
 ┊27┊30┊  // Providers
 ┊28┊31┊  providers: [
```
[}]: #

Last step of our authentication pattern is to pickup a name.

Let's add a Method that updates user's profile:

[{]: <helper> (diff_step 5.17)
#### Step 5.17: Add 'updateProfile' method

##### Changed server/imports/methods/methods.ts
```diff
@@ -2,6 +2,7 @@
 ┊2┊2┊import {Chats} from "../../../both/collections/chats.collection";
 ┊3┊3┊import {Messages} from "../../../both/collections/messages.collection";
 ┊4┊4┊import {check, Match} from 'meteor/check';
+┊ ┊5┊import {Profile} from '../../../both/models/profile.model';
 ┊5┊6┊
 ┊6┊7┊const nonEmptyString = Match.Where((str) => {
 ┊7┊8┊  check(str, String);
```
```diff
@@ -9,6 +10,19 @@
 ┊ 9┊10┊});
 ┊10┊11┊
 ┊11┊12┊Meteor.methods({
+┊  ┊13┊  updateProfile(profile: Profile): void {
+┊  ┊14┊    if (!this.userId) throw new Meteor.Error('unauthorized',
+┊  ┊15┊      'User must be logged-in to create a new chat');
+┊  ┊16┊ 
+┊  ┊17┊    check(profile, {
+┊  ┊18┊      name: nonEmptyString,
+┊  ┊19┊      picture: nonEmptyString
+┊  ┊20┊    });
+┊  ┊21┊ 
+┊  ┊22┊    Meteor.users.update(this.userId, {
+┊  ┊23┊      $set: {profile}
+┊  ┊24┊    });
+┊  ┊25┊  },
 ┊12┊26┊  addMessage(chatId: string, content: string): void {
 ┊13┊27┊    check(chatId, nonEmptyString);
 ┊14┊28┊    check(content, nonEmptyString);
```
[}]: #


It would be nice to define a separate model for a profile:

[{]: <helper> (diff_step 5.18)
#### Step 5.18: Define Profile model

##### Added both/models/profile.model.ts
```diff
@@ -0,0 +1,4 @@
+┊ ┊1┊export interface Profile {
+┊ ┊2┊  name?: string;
+┊ ┊3┊  picture?: string;
+┊ ┊4┊}🚫↵
```
[}]: #

Now we can create the `ProfileComponent`:

[{]: <helper> (diff_step 5.19)
#### Step 5.19: Create ProfileComponent

##### Added client/imports/pages/auth/profile.component.ts
```diff
@@ -0,0 +1,55 @@
+┊  ┊ 1┊import {Component, OnInit} from '@angular/core';
+┊  ┊ 2┊import {NavController, AlertController} from 'ionic-angular';
+┊  ┊ 3┊import {Meteor} from 'meteor/meteor';
+┊  ┊ 4┊import {MeteorObservable} from 'meteor-rxjs';
+┊  ┊ 5┊import {Profile} from '../../../../both/models/profile.model';
+┊  ┊ 6┊import {TabsContainerComponent} from '../tabs-container/tabs-container.component';
+┊  ┊ 7┊
+┊  ┊ 8┊import template from './profile.component.html';
+┊  ┊ 9┊import style from './profile.component.scss';
+┊  ┊10┊ 
+┊  ┊11┊@Component({
+┊  ┊12┊  selector: 'profile',
+┊  ┊13┊  template,
+┊  ┊14┊  styles: [
+┊  ┊15┊    style
+┊  ┊16┊  ]
+┊  ┊17┊})
+┊  ┊18┊export class ProfileComponent implements OnInit {
+┊  ┊19┊  profile: Profile;
+┊  ┊20┊ 
+┊  ┊21┊  constructor(
+┊  ┊22┊    private navCtrl: NavController,
+┊  ┊23┊    private alertCtrl: AlertController
+┊  ┊24┊  ) {}
+┊  ┊25┊
+┊  ┊26┊  ngOnInit(): void {
+┊  ┊27┊    this.profile = Meteor.user().profile || {
+┊  ┊28┊      name: '',
+┊  ┊29┊      picture: '/assets/ionicons/dist/svg/ios-contact.svg'
+┊  ┊30┊    };
+┊  ┊31┊  }
+┊  ┊32┊ 
+┊  ┊33┊  done(): void {
+┊  ┊34┊    MeteorObservable.call('updateProfile', this.profile).subscribe({
+┊  ┊35┊      next: () => {
+┊  ┊36┊        this.navCtrl.push(TabsContainerComponent);
+┊  ┊37┊      },
+┊  ┊38┊      error(e: Error) {
+┊  ┊39┊        this.handleError(e);
+┊  ┊40┊      }
+┊  ┊41┊    });
+┊  ┊42┊  }
+┊  ┊43┊ 
+┊  ┊44┊  private handleError(e: Error): void {
+┊  ┊45┊    console.error(e);
+┊  ┊46┊ 
+┊  ┊47┊    const alert = this.alertCtrl.create({
+┊  ┊48┊      title: 'Oops!',
+┊  ┊49┊      message: e.message,
+┊  ┊50┊      buttons: ['OK']
+┊  ┊51┊    });
+┊  ┊52┊ 
+┊  ┊53┊    alert.present();
+┊  ┊54┊  }
+┊  ┊55┊}🚫↵
```
[}]: #

The logic is simple, call `updateProfile` and redirect to `TabsContainerComponent` which is our main view if the action succeed.

If you'll take a look at the constructor's logic we set the default profile picture to be one of ionicon's svgs. We need to make sure there is an access point available through the network to that asset. If we'd like to serve files as-is we simply gonna add them to the `assets` dir; So let's add a symlink to `ionicons` in that dir:

    public/assets$ ln -s ../../node_modules/ionicons

There's no component without a view:

[{]: <helper> (diff_step 5.21)
#### Step 5.21: Create a template for ProfileComponent

##### Added client/imports/pages/auth/profile.component.html
```diff
@@ -0,0 +1,21 @@
+┊  ┊ 1┊<ion-header>
+┊  ┊ 2┊  <ion-navbar color="whatsapp">
+┊  ┊ 3┊    <ion-title>Profile</ion-title>
+┊  ┊ 4┊ 
+┊  ┊ 5┊    <ion-buttons end>
+┊  ┊ 6┊      <button ion-button class="done-button" (click)="done()">Done</button>
+┊  ┊ 7┊    </ion-buttons>
+┊  ┊ 8┊  </ion-navbar>
+┊  ┊ 9┊</ion-header>
+┊  ┊10┊ 
+┊  ┊11┊<ion-content class="profile-page-content">
+┊  ┊12┊  <div class="profile-picture">
+┊  ┊13┊    <img [src]="profile.picture">
+┊  ┊14┊    <ion-icon name="create"></ion-icon>
+┊  ┊15┊  </div>
+┊  ┊16┊ 
+┊  ┊17┊  <ion-item class="profile-name">
+┊  ┊18┊    <ion-label stacked>Name</ion-label>
+┊  ┊19┊    <ion-input [(ngModel)]="profile.name" placeholder="Your name"></ion-input>
+┊  ┊20┊  </ion-item>
+┊  ┊21┊</ion-content>🚫↵
```
[}]: #

There's no good looking view without a stylesheet:

[{]: <helper> (diff_step 5.22)
#### Step 5.22: Also the styles

##### Added client/imports/pages/auth/profile.component.scss
```diff
@@ -0,0 +1,20 @@
+┊  ┊ 1┊.profile-page-content {
+┊  ┊ 2┊  .profile-picture {
+┊  ┊ 3┊    max-width: 300px;
+┊  ┊ 4┊    display: block;
+┊  ┊ 5┊    margin: auto;
+┊  ┊ 6┊ 
+┊  ┊ 7┊    img {
+┊  ┊ 8┊      margin-bottom: -33px;
+┊  ┊ 9┊      width: 100%;
+┊  ┊10┊    }
+┊  ┊11┊ 
+┊  ┊12┊    ion-icon {
+┊  ┊13┊      float: right;
+┊  ┊14┊      font-size: 30px;
+┊  ┊15┊      opacity: 0.5;
+┊  ┊16┊      border-left: black solid 1px;
+┊  ┊17┊      padding-left: 5px;
+┊  ┊18┊    }
+┊  ┊19┊  }
+┊  ┊20┊}🚫↵
```
[}]: #

There's no access to the component without a declaration inside AppModule:

[{]: <helper> (diff_step 5.23)
#### Step 5.23: Register ProfileComponent

##### Changed client/imports/app/app.module.ts
```diff
@@ -7,6 +7,7 @@
 ┊ 7┊ 7┊import {MessagesPage} from "../pages/chat/messages-page.component";
 ┊ 8┊ 8┊import {LoginComponent} from '../pages/auth/login.component';
 ┊ 9┊ 9┊import {VerificationComponent} from '../pages/auth/verification.component';
+┊  ┊10┊import {ProfileComponent} from '../pages/auth/profile.component';
 ┊10┊11┊
 ┊11┊12┊@NgModule({
 ┊12┊13┊  // Components, Pipes, Directive
```
```diff
@@ -16,7 +17,8 @@
 ┊16┊17┊    ChatsComponent,
 ┊17┊18┊    MessagesPage,
 ┊18┊19┊    LoginComponent,
-┊19┊  ┊    VerificationComponent
+┊  ┊20┊    VerificationComponent,
+┊  ┊21┊    ProfileComponent
 ┊20┊22┊  ],
 ┊21┊23┊  // Entry Components
 ┊22┊24┊  entryComponents: [
```
```diff
@@ -25,7 +27,8 @@
 ┊25┊27┊    ChatsComponent,
 ┊26┊28┊    MessagesPage,
 ┊27┊29┊    LoginComponent,
-┊28┊  ┊    VerificationComponent
+┊  ┊30┊    VerificationComponent,
+┊  ┊31┊    ProfileComponent
 ┊29┊32┊  ],
 ┊30┊33┊  // Providers
 ┊31┊34┊  providers: [
```
[}]: #

Our authentication flow is complete! However there are some few adjustments we need to make before we proceed to the next step.

For the messaging system, each message should have an owner. If a user is logged-in a message document should be inserted with an additional `senderId` field:

[{]: <helper> (diff_step 5.24)
#### Step 5.24: Add senderId property to addMessage method

##### Changed server/imports/methods/methods.ts
```diff
@@ -24,6 +24,9 @@
 ┊24┊24┊    });
 ┊25┊25┊  },
 ┊26┊26┊  addMessage(chatId: string, content: string): void {
+┊  ┊27┊    if (!this.userId) throw new Meteor.Error('unauthorized',
+┊  ┊28┊      'User must be logged-in to create a new chat');
+┊  ┊29┊
 ┊27┊30┊    check(chatId, nonEmptyString);
 ┊28┊31┊    check(content, nonEmptyString);
 ┊29┊32┊
```
```diff
@@ -34,6 +37,7 @@
 ┊34┊37┊
 ┊35┊38┊    Messages.collection.insert({
 ┊36┊39┊      chatId: chatId,
+┊  ┊40┊      senderId: this.userId,
 ┊37┊41┊      content: content,
 ┊38┊42┊      createdAt: new Date()
 ┊39┊43┊    });
```
[}]: #

[{]: <helper> (diff_step 5.25)
#### Step 5.25: Add it also to the model

##### Changed both/models/message.model.ts
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊export interface Message {
 ┊2┊2┊  _id?: string;
 ┊3┊3┊  chatId?: string;
+┊ ┊4┊  senderId?: string;
 ┊4┊5┊  content?: string;
 ┊5┊6┊  ownership?: string;
 ┊6┊7┊  createdAt?: Date;
```
[}]: #

We can determine message ownership inside the component:

[{]: <helper> (diff_step 5.26)
#### Step 5.26: Determine message ownership based on sender id

##### Changed client/imports/pages/chat/messages-page.component.ts
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import {Component, OnInit, OnDestroy} from "@angular/core";
 ┊2┊2┊import {NavParams} from "ionic-angular";
+┊ ┊3┊import {Meteor} from 'meteor/meteor';
 ┊3┊4┊import {Chat} from "../../../../both/models/chat.model";
 ┊4┊5┊import {Messages} from "../../../../both/collections/messages.collection";
 ┊5┊6┊import {Observable} from "rxjs";
```
```diff
@@ -20,6 +21,7 @@
 ┊20┊21┊  private title: string;
 ┊21┊22┊  private picture: string;
 ┊22┊23┊  private messages: Observable<Message[]>;
+┊  ┊24┊  private senderId: string;
 ┊23┊25┊  private message = "";
 ┊24┊26┊  private autoScroller: MutationObserver;
 ┊25┊27┊
```
```diff
@@ -27,18 +29,16 @@
 ┊27┊29┊    this.selectedChat = <Chat>navParams.get('chat');
 ┊28┊30┊    this.title = this.selectedChat.title;
 ┊29┊31┊    this.picture = this.selectedChat.picture;
+┊  ┊32┊    this.senderId = Meteor.userId();
 ┊30┊33┊  }
 ┊31┊34┊
 ┊32┊35┊  ngOnInit() {
-┊33┊  ┊    let isEven = false;
-┊34┊  ┊
 ┊35┊36┊    this.messages = Messages.find(
 ┊36┊37┊      {chatId: this.selectedChat._id},
 ┊37┊38┊      {sort: {createdAt: 1}}
 ┊38┊39┊    ).map((messages: Message[]) => {
 ┊39┊40┊      messages.forEach((message: Message) => {
-┊40┊  ┊        message.ownership = isEven ? 'mine' : 'other';
-┊41┊  ┊        isEven = !isEven;
+┊  ┊41┊        message.ownership = this.senderId == message.senderId ? 'mine' : 'other';
 ┊42┊42┊      });
 ┊43┊43┊
 ┊44┊44┊      return messages;
```
[}]: #

Now we're going to add the abilities to log-out and edit our profile as well, which are going to be presented to us using a popover. 
Let's show a popover any time we press on the options icon in the top right corner of the chats view:

[{]: <helper> (diff_step 5.27)
#### Step 5.27: Add options-popover to ChatsComponent

##### Changed client/imports/pages/chats/chats.component.ts
```diff
@@ -7,8 +7,9 @@
 ┊ 7┊ 7┊import {Chats} from "../../../../both/collections/chats.collection";
 ┊ 8┊ 8┊import {Message} from "../../../../both/models/message.model";
 ┊ 9┊ 9┊import {Messages} from "../../../../both/collections/messages.collection";
-┊10┊  ┊import {NavController} from "ionic-angular";
+┊  ┊10┊import {NavController, PopoverController} from "ionic-angular";
 ┊11┊11┊import {MessagesPage} from "../chat/messages-page.component";
+┊  ┊12┊import {ChatsOptionsComponent} from '../chats/chats-options.component';
 ┊12┊13┊
 ┊13┊14┊@Component({
 ┊14┊15┊  selector: "chats",
```
```diff
@@ -20,9 +21,10 @@
 ┊20┊21┊export class ChatsComponent implements OnInit {
 ┊21┊22┊  chats: Observable<Chat[]>;
 ┊22┊23┊
-┊23┊  ┊  constructor(private navCtrl: NavController) {
-┊24┊  ┊
-┊25┊  ┊  }
+┊  ┊24┊  constructor(
+┊  ┊25┊    private navCtrl: NavController,
+┊  ┊26┊    private popoverCtrl: PopoverController
+┊  ┊27┊    ) {}
 ┊26┊28┊
 ┊27┊29┊  ngOnInit() {
 ┊28┊30┊    this.chats = Chats
```
```diff
@@ -43,6 +45,14 @@
 ┊43┊45┊      ).zone();
 ┊44┊46┊  }
 ┊45┊47┊
+┊  ┊48┊  showOptions(): void {
+┊  ┊49┊    const popover = this.popoverCtrl.create(ChatsOptionsComponent, {}, {
+┊  ┊50┊      cssClass: 'options-popover'
+┊  ┊51┊    });
+┊  ┊52┊ 
+┊  ┊53┊    popover.present();
+┊  ┊54┊  }
+┊  ┊55┊
 ┊46┊56┊  showMessages(chat): void {
 ┊47┊57┊    this.navCtrl.push(MessagesPage, {chat});
 ┊48┊58┊  }
```
[}]: #

[{]: <helper> (diff_step 5.28)
#### Step 5.28: Bind showOptions

##### Changed client/imports/pages/chats/chats.component.html
```diff
@@ -4,7 +4,7 @@
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊    <ion-buttons end>
 ┊ 6┊ 6┊      <button ion-button icon-only class="add-chat-button"><ion-icon name="person-add"></ion-icon></button>
-┊ 7┊  ┊      <button ion-button icon-only class="options-button"><ion-icon name="more"></ion-icon></button>
+┊  ┊ 7┊      <button ion-button icon-only class="options-button" (click)="showOptions()"><ion-icon name="more"></ion-icon></button>
 ┊ 8┊ 8┊    </ion-buttons>
 ┊ 9┊ 9┊  </ion-navbar>
 ┊10┊10┊</ion-header>
```
[}]: #

It uses popover functionality from Ionic ([see documentation](http://ionicframework.com/docs/v2/components/#popovers)).

As you can see, we used `ChatsOptionsComponent`.

Now let's implement the component for the chats options which will handle the profile editing and logging-out:

[{]: <helper> (diff_step 5.29)
#### Step 5.29: Add ChatsOptionsComponent

##### Added client/imports/pages/chats/chats-options.component.ts
```diff
@@ -0,0 +1,76 @@
+┊  ┊ 1┊import {Component} from '@angular/core';
+┊  ┊ 2┊import {NavController, ViewController, AlertController} from 'ionic-angular';
+┊  ┊ 3┊import {Meteor} from 'meteor/meteor';
+┊  ┊ 4┊import {ProfileComponent} from '../auth/profile.component';
+┊  ┊ 5┊import {LoginComponent} from '../auth/login.component';
+┊  ┊ 6┊import template from './chats-options.component.html';
+┊  ┊ 7┊import style from "./chats-options.component.scss";
+┊  ┊ 8┊ 
+┊  ┊ 9┊@Component({
+┊  ┊10┊  selector: 'chats-options',
+┊  ┊11┊  template,
+┊  ┊12┊  styles: [
+┊  ┊13┊    style
+┊  ┊14┊  ]
+┊  ┊15┊})
+┊  ┊16┊export class ChatsOptionsComponent {
+┊  ┊17┊  constructor(
+┊  ┊18┊    private navCtrl: NavController, 
+┊  ┊19┊    private viewCtrl: ViewController,
+┊  ┊20┊    private alertCtrl: AlertController
+┊  ┊21┊  ) {}
+┊  ┊22┊ 
+┊  ┊23┊  editProfile(): void {
+┊  ┊24┊    this.viewCtrl.dismiss().then(() => {
+┊  ┊25┊      this.navCtrl.push(ProfileComponent);
+┊  ┊26┊    });
+┊  ┊27┊  }
+┊  ┊28┊ 
+┊  ┊29┊  logout(): void {
+┊  ┊30┊    const alert = this.alertCtrl.create({
+┊  ┊31┊      title: 'Logout',
+┊  ┊32┊      message: 'Are you sure you would like to proceed?',
+┊  ┊33┊      buttons: [
+┊  ┊34┊        {
+┊  ┊35┊          text: 'Cancel',
+┊  ┊36┊          role: 'cancel'
+┊  ┊37┊        },
+┊  ┊38┊        {
+┊  ┊39┊          text: 'Yes',
+┊  ┊40┊          handler: () => {
+┊  ┊41┊            this.handleLogout(alert);
+┊  ┊42┊            return false;
+┊  ┊43┊          }
+┊  ┊44┊        }
+┊  ┊45┊      ]
+┊  ┊46┊    });
+┊  ┊47┊ 
+┊  ┊48┊    this.viewCtrl.dismiss().then(() => {
+┊  ┊49┊      alert.present();
+┊  ┊50┊    });
+┊  ┊51┊  }
+┊  ┊52┊ 
+┊  ┊53┊  private handleLogout(alert): void {
+┊  ┊54┊    Meteor.logout((e: Error) => {
+┊  ┊55┊      alert.dismiss().then(() => {
+┊  ┊56┊        if (e) return this.handleError(e);
+┊  ┊57┊ 
+┊  ┊58┊        this.navCtrl.setRoot(LoginComponent, {}, {
+┊  ┊59┊          animate: true
+┊  ┊60┊        });
+┊  ┊61┊      });
+┊  ┊62┊    });
+┊  ┊63┊  }
+┊  ┊64┊ 
+┊  ┊65┊  private handleError(e: Error): void {
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

Add a template and styles:

[{]: <helper> (diff_step 5.3)
#### Step 5.3: Add authentication settings

##### Added private/settings.json
```diff
@@ -0,0 +1,8 @@
+┊ ┊1┊{
+┊ ┊2┊  "accounts-phone": {
+┊ ┊3┊    "verificationWaitTime": 0,
+┊ ┊4┊    "verificationRetriesWaitTime": 0,
+┊ ┊5┊    "adminPhoneNumbers": ["+9721234567", "+97212345678", "+97212345679"],
+┊ ┊6┊    "phoneVerificationMasterCode": "1234"
+┊ ┊7┊  }
+┊ ┊8┊}🚫↵
```
[}]: #

[{]: <helper> (diff_step 5.31)
#### Step 5.31: Define styles

##### Added client/imports/pages/chats/chats-options.component.scss
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

Add it to AppModule:

[{]: <helper> (diff_step 5.32)
#### Step 5.32: Register ChatsOptionsComponent

##### Changed client/imports/app/app.module.ts
```diff
@@ -8,6 +8,7 @@
 ┊ 8┊ 8┊import {LoginComponent} from '../pages/auth/login.component';
 ┊ 9┊ 9┊import {VerificationComponent} from '../pages/auth/verification.component';
 ┊10┊10┊import {ProfileComponent} from '../pages/auth/profile.component';
+┊  ┊11┊import {ChatsOptionsComponent} from '../pages/chats/chats-options.component';
 ┊11┊12┊
 ┊12┊13┊@NgModule({
 ┊13┊14┊  // Components, Pipes, Directive
```
```diff
@@ -18,7 +19,8 @@
 ┊18┊19┊    MessagesPage,
 ┊19┊20┊    LoginComponent,
 ┊20┊21┊    VerificationComponent,
-┊21┊  ┊    ProfileComponent
+┊  ┊22┊    ProfileComponent,
+┊  ┊23┊    ChatsOptionsComponent
 ┊22┊24┊  ],
 ┊23┊25┊  // Entry Components
 ┊24┊26┊  entryComponents: [
```
```diff
@@ -28,7 +30,8 @@
 ┊28┊30┊    MessagesPage,
 ┊29┊31┊    LoginComponent,
 ┊30┊32┊    VerificationComponent,
-┊31┊  ┊    ProfileComponent
+┊  ┊33┊    ProfileComponent,
+┊  ┊34┊    ChatsOptionsComponent
 ┊32┊35┊  ],
 ┊33┊36┊  // Providers
 ┊34┊37┊  providers: [
```
[}]: #

As for now, once you click on the options icon in the chats view, the popover should appear in the middle of the screen. To fix it, we simply gonna add the following `scss` file to the `styles` dir:

[{]: <helper> (diff_step 5.33)
#### Step 5.33: Add options-popover stylesheet

##### Added client/styles/options-popover.scss
```diff
@@ -0,0 +1,11 @@
+┊  ┊ 1┊.options-popover {
+┊  ┊ 2┊  $popover-width: 200px;
+┊  ┊ 3┊  $popover-margin: 5px;
+┊  ┊ 4┊ 
+┊  ┊ 5┊  .popover-content {
+┊  ┊ 6┊    width: $popover-width;
+┊  ┊ 7┊    transform-origin: right top 0px !important;
+┊  ┊ 8┊    left: calc(100% - #{$popover-width} - #{$popover-margin}) !important;
+┊  ┊ 9┊    top: $popover-margin !important;
+┊  ┊10┊  }
+┊  ┊11┊}🚫↵
```
[}]: #

Note that this style-sheet is not a component specific, so it has to be loaded as a global asset rather then provide it to the component during its initialization.

[{]: <helper> (nav_step next_ref="https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/chats-mutations" prev_ref="https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/messages-page")
| [< Previous Step](https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/messages-page) | [Next Step >](https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/chats-mutations) |
|:--------------------------------|--------------------------------:|
[}]: #

