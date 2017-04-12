# Step 1: Bootstraping

> If you got directly into here, please read the whole [intro section](https://angular-meteor.com/tutorials/whatsapp2-tutorial) explaining the goals for this tutorial and project.

Both [Meteor](https://meteor.com) and [Ionic](https://ionicframework.com) took their platform to the next level in tooling.
Both provide CLI interface instead of bringing bunch of dependencies and configure build tools.
There are also differences between those tools. in this post we will focus on the `Meteor` CLI.

> If you are interested in the [Ionic CLI](https://angular-meteor.com/tutorials/whatsapp2/ionic/setup), the steps needed to use it with Meteor are almost identical to the steps required by the Meteor CLI.

Start by installing `Meteor` if you haven't already (See [reference](https://www.meteor.com/install)).

Now let's create our app - write this in the command line:

    $ meteor create whatsapp

And let's see what we've got. Go into the new folder:

    $ cd whatsapp

A `Meteor` project will contain the following dirs by default:

  - client - A dir containing all client scripts.
  - server - A dir containing all server scripts.

These scripts should be loaded automatically by their alphabetic order on their belonging platform, e.g. a script defined under the client dir should be loaded by `Meteor` only on the client. A script defined in neither of these folders should be loaded on both.

`Meteor` apps use [Blaze](http://blazejs.org/) as its default template engine and [Babel](https://babeljs.io/) as its default script pre-processor. In this tutorial, we're interested in using [Angular 2](https://angular.io/)'s template engine and [Typescript](https://www.typescriptlang.org/) as our script pre-processor; Therefore will remove the `blaze-html-templates` package:

    $ meteor remove blaze-html-templates

And we will replace it with a package called `angular2-compilers`:

    $ meteor add angular2-compilers

The `angular2-compilers` package not only replace the `Blaze` template engine, but it also applies `Typescript` to our `Meteor` project, as it's the recommended scripting language recommended by the `Angular` team. In addition, all `CSS` files will be compiled with a pre-processor called [SASS](http://sass-lang.com/), something which will definitely ease the styling process.

The `Typescript` compiler operates based on a user defined config, and without it, it's not going to behave expectedly; Therefore, we will define the following `Typescript` config file:

[{]: <helper> (diff_step 1.3)
#### Step 1.3: Add Typescript config file

##### Added tsconfig.json
```diff
@@ -0,0 +1,36 @@
+┊  ┊ 1┊{
+┊  ┊ 2┊  "compilerOptions": {
+┊  ┊ 3┊    "allowSyntheticDefaultImports": true,
+┊  ┊ 4┊    "baseUrl": ".",
+┊  ┊ 5┊    "declaration": false,
+┊  ┊ 6┊    "emitDecoratorMetadata": true,
+┊  ┊ 7┊    "experimentalDecorators": true,
+┊  ┊ 8┊    "lib": [
+┊  ┊ 9┊      "dom",
+┊  ┊10┊      "es2015"
+┊  ┊11┊    ],
+┊  ┊12┊    "module": "commonjs",
+┊  ┊13┊    "moduleResolution": "node",
+┊  ┊14┊    "sourceMap": true,
+┊  ┊15┊    "target": "es5",
+┊  ┊16┊    "skipLibCheck": true,
+┊  ┊17┊    "stripInternal": true,
+┊  ┊18┊    "noImplicitAny": false,
+┊  ┊19┊    "types": [
+┊  ┊20┊      "meteor-typings",
+┊  ┊21┊      "@types/underscore"
+┊  ┊22┊    ]
+┊  ┊23┊  },
+┊  ┊24┊  "include": [
+┊  ┊25┊    "client/**/*.ts",
+┊  ┊26┊    "server/**/*.ts",
+┊  ┊27┊    "imports/**/*.ts"
+┊  ┊28┊  ],
+┊  ┊29┊  "exclude": [
+┊  ┊30┊    "node_modules"
+┊  ┊31┊  ],
+┊  ┊32┊  "compileOnSave": false,
+┊  ┊33┊  "atom": {
+┊  ┊34┊    "rewriteTsconfig": false
+┊  ┊35┊  }
+┊  ┊36┊}🚫↵
```
[}]: #

> More information regards `Typescript` configuration file can be found [here](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

Not all third-party libraries have any support for `Typescript` whatsoever, something that we should be careful with when building a `Typescript` app. To allow non-supported third-party libraries, we will add the following declaration file:

[{]: <helper> (diff_step 1.4)
#### Step 1.4: Add declarations file

##### Added declarations.d.ts
```diff
@@ -0,0 +1 @@
+┊ ┊1┊declare module '*';🚫↵
```
[}]: #

Like most libraries, `Angular 2` is relied on peer dependencies, which we will have to make sure exist in our app by installing the following packages:

    $ meteor npm install --save @angular/common
    $ meteor npm install --save @angular/compiler
    $ meteor npm install --save @angular/compiler-cli
    $ meteor npm install --save @angular/core
    $ meteor npm install --save @angular/forms
    $ meteor npm install --save @angular/http
    $ meteor npm install --save @angular/platform-browser
    $ meteor npm install --save @angular/platform-browser-dynamic
    $ meteor npm install --save @angular/platform-server
    $ meteor npm install --save meteor-rxjs
    $ meteor npm install --save reflect-metadata
    $ meteor npm install --save rxjs
    $ meteor npm install --save zone.js
    $ meteor npm install --save-dev @types/meteor
    $ meteor npm install --save-dev @types/meteor-accounts-phone
    $ meteor npm install --save-dev @types/underscore
    $ meteor npm install --save-dev meteor-typings

Now that we have all the compilers and their dependencies ready, we will have to transform our project files into their supported extension. `.js` files should be renamed to `.ts` files, and `.css` files should be renamed to `.scss` files.

    $ mv server/main.js server/main.ts
    $ mv client/main.js client/main.ts
    $ mv client/main.css client/main.scss

Last but not least, we will add some basic [Cordova](https://cordova.apache.org/) plugins which will take care of mobile specific features:

    $ meteor add cordova:cordova-plugin-whitelist@1.3.1
    $ meteor add cordova:cordova-plugin-console@1.0.5
    $ meteor add cordova:cordova-plugin-statusbar@2.2.1
    $ meteor add cordova:cordova-plugin-device@1.1.4
    $ meteor add cordova:ionic-plugin-keyboard@1.1.4
    $ meteor add cordova:cordova-plugin-splashscreen@4.0.1

> The least above was determined based on Ionic 2's [app base](https://github.com/driftyco/ionic2-app-base).

Everything is set, and we can start using the `Angular 2` framework. We will start by setting the basis for our app:

[{]: <helper> (diff_step 1.8)
#### Step 1.8: Prepare application basis

##### Added client/imports/app/app.component.ts
```diff
@@ -0,0 +1,8 @@
+┊ ┊1┊import { Component } from '@angular/core';
+┊ ┊2┊import template from "./app.html";
+┊ ┊3┊
+┊ ┊4┊@Component({
+┊ ┊5┊  selector: 'my-app',
+┊ ┊6┊  template
+┊ ┊7┊})
+┊ ┊8┊export class MyApp {}
```

##### Added client/imports/app/app.html
```diff
@@ -0,0 +1 @@
+┊ ┊1┊My App🚫↵
```

##### Added client/imports/app/app.module.ts
```diff
@@ -0,0 +1,15 @@
+┊  ┊ 1┊import { NgModule, ErrorHandler } from '@angular/core';
+┊  ┊ 2┊import { MyApp } from './app.component';
+┊  ┊ 3┊
+┊  ┊ 4┊@NgModule({
+┊  ┊ 5┊  declarations: [
+┊  ┊ 6┊    MyApp
+┊  ┊ 7┊  ],
+┊  ┊ 8┊  entryComponents: [
+┊  ┊ 9┊    MyApp
+┊  ┊10┊  ],
+┊  ┊11┊  providers: [
+┊  ┊12┊    { provide: ErrorHandler }
+┊  ┊13┊  ]
+┊  ┊14┊})
+┊  ┊15┊export class AppModule {}🚫↵
```

##### Added client/imports/app/app.scss
```diff
@@ -0,0 +1,6 @@
+┊ ┊1┊// App Global Sass
+┊ ┊2┊// --------------------------------------------------
+┊ ┊3┊// Put style rules here that you want to apply globally. These
+┊ ┊4┊// styles are for the entire app and not just one component.
+┊ ┊5┊// Additionally, this file can be also used as an entry point
+┊ ┊6┊// to import other Sass files to be included in the output CSS.🚫↵
```

##### Changed client/main.html
```diff
@@ -3,23 +3,5 @@
 ┊ 3┊ 3┊</head>
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊<body>
-┊ 6┊  ┊  <h1>Welcome to Meteor!</h1>
-┊ 7┊  ┊
-┊ 8┊  ┊  {{> hello}}
-┊ 9┊  ┊  {{> info}}
-┊10┊  ┊</body>
-┊11┊  ┊
-┊12┊  ┊<template name="hello">
-┊13┊  ┊  <button>Click Me</button>
-┊14┊  ┊  <p>You've pressed the button {{counter}} times.</p>
-┊15┊  ┊</template>
-┊16┊  ┊
-┊17┊  ┊<template name="info">
-┊18┊  ┊  <h2>Learn Meteor!</h2>
-┊19┊  ┊  <ul>
-┊20┊  ┊    <li><a href="https://www.meteor.com/try" target="_blank">Do the Tutorial</a></li>
-┊21┊  ┊    <li><a href="http://guide.meteor.com" target="_blank">Follow the Guide</a></li>
-┊22┊  ┊    <li><a href="https://docs.meteor.com" target="_blank">Read the Docs</a></li>
-┊23┊  ┊    <li><a href="https://forums.meteor.com" target="_blank">Discussions</a></li>
-┊24┊  ┊  </ul>
-┊25┊  ┊</template>
+┊  ┊ 6┊  <my-app></my-app>
+┊  ┊ 7┊</body>🚫↵
```

##### Changed client/main.scss
```diff
@@ -1 +1,2 @@
-┊1┊ ┊/* CSS declarations go here */
+┊ ┊1┊// App
+┊ ┊2┊@import "imports/app/app";🚫↵
```

##### Changed client/main.ts
```diff
@@ -1,22 +1,10 @@
-┊ 1┊  ┊import { Template } from 'meteor/templating';
-┊ 2┊  ┊import { ReactiveVar } from 'meteor/reactive-var';
+┊  ┊ 1┊import 'zone.js';
+┊  ┊ 2┊import 'reflect-metadata';
 ┊ 3┊ 3┊
-┊ 4┊  ┊import './main.html';
+┊  ┊ 4┊import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
+┊  ┊ 5┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 6┊import { AppModule } from './imports/app/app.module';
 ┊ 5┊ 7┊
-┊ 6┊  ┊Template.hello.onCreated(function helloOnCreated() {
-┊ 7┊  ┊  // counter starts at 0
-┊ 8┊  ┊  this.counter = new ReactiveVar(0);
-┊ 9┊  ┊});
-┊10┊  ┊
-┊11┊  ┊Template.hello.helpers({
-┊12┊  ┊  counter() {
-┊13┊  ┊    return Template.instance().counter.get();
-┊14┊  ┊  },
-┊15┊  ┊});
-┊16┊  ┊
-┊17┊  ┊Template.hello.events({
-┊18┊  ┊  'click button'(event, instance) {
-┊19┊  ┊    // increment the counter when button is clicked
-┊20┊  ┊    instance.counter.set(instance.counter.get() + 1);
-┊21┊  ┊  },
+┊  ┊ 8┊Meteor.startup(() => {
+┊  ┊ 9┊  platformBrowserDynamic().bootstrapModule(AppModule);
 ┊22┊10┊});
```

##### Changed declarations.d.ts
```diff
@@ -1 +1,5 @@
+┊ ┊1┊/*
+┊ ┊2┊  A wildcard module is declared below to allow third party libraries to be used in an app even if they don't
+┊ ┊3┊  provide their own type declarations.
+┊ ┊4┊ */
 ┊1┊5┊declare module '*';🚫↵
```
[}]: #

In the step above, we simply created the entry module and component for our application, so as we go further in this tutorial and add more features, we can simply easily extend our module and app main component.

## Ionic 2

[Ionic](http://ionicframework.com/docs/) is a free and open source mobile SDK for developing native and progressive web apps with ease. When using `Ionic`CLI, it comes with a boilerplate, just like `Meteor` does, but since we're not using `Meteor` CLI and not `Ionic`'s, we will have to set it up manually.

The first thing we're going to do in order to integrate `Ionic 2` in our app would be installing its `NPM` dependencies:

    $ meteor npm install --save @ionic/storage
    $ meteor npm install --save ionic-angular
    $ meteor npm install --save ionic-native
    $ meteor npm install --save ionicons

`Ionic` build system comes with a built-in theming system which helps its users design their app. It's a powerful tool which we wanna take advantage of. In-order to do that, we will define the following `SCSS` file, and we will import it:

[{]: <helper> (diff_step 1.1)
#### Step 1.1: Uninstall blaze-html-templates

##### Changed .meteor/packages
```diff
@@ -7,7 +7,6 @@
 ┊ 7┊ 7┊meteor-base@1.0.4             # Packages every Meteor app needs to have
 ┊ 8┊ 8┊mobile-experience@1.0.4       # Packages for a great mobile UX
 ┊ 9┊ 9┊mongo@1.1.14                   # The database Meteor supports right now
-┊10┊  ┊blaze-html-templates@1.0.4 # Compile .html files into Meteor Blaze views
 ┊11┊10┊reactive-var@1.0.11            # Reactive variable for tracker
 ┊12┊11┊jquery@1.11.10                  # Helpful client-side library
 ┊13┊12┊tracker@1.1.1                 # Meteor's client-side reactive programming library
```

##### Changed .meteor/versions
```diff
@@ -6,11 +6,8 @@
 ┊ 6┊ 6┊base64@1.0.10
 ┊ 7┊ 7┊binary-heap@1.0.10
 ┊ 8┊ 8┊blaze@2.3.0
-┊ 9┊  ┊blaze-html-templates@1.1.0
 ┊10┊ 9┊blaze-tools@1.0.10
 ┊11┊10┊boilerplate-generator@1.0.11
-┊12┊  ┊caching-compiler@1.1.9
-┊13┊  ┊caching-html-compiler@1.1.0
 ┊14┊11┊callback-hook@1.0.10
 ┊15┊12┊check@1.2.4
 ┊16┊13┊ddp@1.2.5
```
```diff
@@ -60,10 +57,6 @@
 ┊60┊57┊spacebars-compiler@1.1.0
 ┊61┊58┊standard-minifier-css@1.3.2
 ┊62┊59┊standard-minifier-js@1.2.1
-┊63┊  ┊templating@1.3.0
-┊64┊  ┊templating-compiler@1.3.0
-┊65┊  ┊templating-runtime@1.3.0
-┊66┊  ┊templating-tools@1.1.0
 ┊67┊60┊tracker@1.1.1
 ┊68┊61┊ui@1.0.12
 ┊69┊62┊underscore@1.0.10
```
[}]: #

> The `variables.scss` file is hooked to different `Ionic` packages located in the `node_modules` dir. It means that the logic already existed, we only bound all the necessary modules together in order to emulate `Ionic`'s theming system.

`Ionic` looks for fonts in directory we can't access. To fix it, we will use the `mys:font` package to teach `Meteor` how to put them there.

    $ meteor add mys:fonts

That plugin needs to know which font we want to use and where it should be available.

Configuration is pretty easy, you will catch it by just looking on an example:

[{]: <helper> (diff_step 1.12)
#### Step 1.12: Add fonts mapping file

##### Added fonts.json
```diff
@@ -0,0 +1,20 @@
+┊  ┊ 1┊{
+┊  ┊ 2┊  "extensions": ["eot", "ttf", "woff", "woff2"],
+┊  ┊ 3┊  "map": {
+┊  ┊ 4┊    "node_modules/ionic-angular/fonts/ionicons.eot": "fonts/ionicons.eot",
+┊  ┊ 5┊    "node_modules/ionic-angular/fonts/ionicons.ttf": "fonts/ionicons.ttf",
+┊  ┊ 6┊    "node_modules/ionic-angular/fonts/ionicons.woff": "fonts/ionicons.woff",
+┊  ┊ 7┊    "node_modules/ionic-angular/fonts/ionicons.woff2": "fonts/ionicons.woff2",
+┊  ┊ 8┊    "node_modules/ionic-angular/fonts/noto-sans-bold.ttf": "fonts/noto-sans-bold.ttf",
+┊  ┊ 9┊    "node_modules/ionic-angular/fonts/noto-sans-regular.ttf": "fonts/noto-sans-regular.ttf",
+┊  ┊10┊    "node_modules/ionic-angular/fonts/noto-sans.scss": "fonts/noto-sans.scss",
+┊  ┊11┊    "node_modules/ionic-angular/fonts/roboto-bold.ttf": "fonts/roboto-bold.ttf",
+┊  ┊12┊    "node_modules/ionic-angular/fonts/roboto-bold.woff": "fonts/roboto-bold.woff",
+┊  ┊13┊    "node_modules/ionic-angular/fonts/roboto-light.ttf": "fonts/roboto-light.ttf",
+┊  ┊14┊    "node_modules/ionic-angular/fonts/roboto-light.woff": "fonts/roboto-light.woff",
+┊  ┊15┊    "node_modules/ionic-angular/fonts/roboto-medium.ttf": "fonts/roboto-medium.ttf",
+┊  ┊16┊    "node_modules/ionic-angular/fonts/roboto-medium.woff": "fonts/roboto-medium.woff",
+┊  ┊17┊    "node_modules/ionic-angular/fonts/roboto-regular.ttf": "fonts/roboto-regular.ttf",
+┊  ┊18┊    "node_modules/ionic-angular/fonts/roboto-regular.woff": "fonts/roboto-regular.woff"
+┊  ┊19┊  }
+┊  ┊20┊}🚫↵
```
[}]: #

`Ionic` is set. We will have to make few adjustments in our app in order to use `Ionic`, mostly importing its modules and using its components:

[{]: <helper> (diff_step 1.13)
#### Step 1.13: Add Ionic to application basis

##### Changed client/imports/app/app.component.ts
```diff
@@ -1,8 +1,20 @@
 ┊ 1┊ 1┊import { Component } from '@angular/core';
+┊  ┊ 2┊import { Platform } from 'ionic-angular';
+┊  ┊ 3┊import { StatusBar, Splashscreen } from 'ionic-native';
 ┊ 2┊ 4┊import template from "./app.html";
 ┊ 3┊ 5┊
 ┊ 4┊ 6┊@Component({
-┊ 5┊  ┊  selector: 'my-app',
 ┊ 6┊ 7┊  template
 ┊ 7┊ 8┊})
-┊ 8┊  ┊export class MyApp {}
+┊  ┊ 9┊export class MyApp {
+┊  ┊10┊  constructor(platform: Platform) {
+┊  ┊11┊    platform.ready().then(() => {
+┊  ┊12┊      // Okay, so the platform is ready and our plugins are available.
+┊  ┊13┊      // Here you can do any higher level native things you might need.
+┊  ┊14┊      if (platform.is('cordova')) {
+┊  ┊15┊        StatusBar.styleDefault();
+┊  ┊16┊        Splashscreen.hide();
+┊  ┊17┊      }
+┊  ┊18┊    });
+┊  ┊19┊  }
+┊  ┊20┊}🚫↵
```

##### Changed client/imports/app/app.module.ts
```diff
@@ -1,15 +1,20 @@
 ┊ 1┊ 1┊import { NgModule, ErrorHandler } from '@angular/core';
+┊  ┊ 2┊import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
 ┊ 2┊ 3┊import { MyApp } from './app.component';
 ┊ 3┊ 4┊
 ┊ 4┊ 5┊@NgModule({
 ┊ 5┊ 6┊  declarations: [
 ┊ 6┊ 7┊    MyApp
 ┊ 7┊ 8┊  ],
+┊  ┊ 9┊  imports: [
+┊  ┊10┊    IonicModule.forRoot(MyApp),
+┊  ┊11┊  ],
+┊  ┊12┊  bootstrap: [IonicApp],
 ┊ 8┊13┊  entryComponents: [
 ┊ 9┊14┊    MyApp
 ┊10┊15┊  ],
 ┊11┊16┊  providers: [
-┊12┊  ┊    { provide: ErrorHandler }
+┊  ┊17┊    { provide: ErrorHandler, useClass: IonicErrorHandler }
 ┊13┊18┊  ]
 ┊14┊19┊})
 ┊15┊20┊export class AppModule {}🚫↵
```

##### Changed client/main.html
```diff
@@ -1,7 +1,11 @@
 ┊ 1┊ 1┊<head>
 ┊ 2┊ 2┊  <title>Ionic2-MeteorCLI-WhatsApp</title>
+┊  ┊ 3┊  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
+┊  ┊ 4┊  <meta name="format-detection" content="telephone=no">
+┊  ┊ 5┊  <meta name="msapplication-tap-highlight" content="no">
+┊  ┊ 6┊  <meta name="theme-color" content="#4e8ef7">
 ┊ 3┊ 7┊</head>
 ┊ 4┊ 8┊
 ┊ 5┊ 9┊<body>
-┊ 6┊  ┊  <my-app></my-app>
+┊  ┊10┊  <ion-app></ion-app>
 ┊ 7┊11┊</body>🚫↵
```
[}]: #

## Running on Mobile

To add mobile support, select the platform(s) you want and run the following command:

    $ meteor add-platform ios
    # OR / AND
    $ meteor add-platform android

To run an app in the emulator use:

    $ meteor run ios
    # OR
    $ meteor run android

To learn more about **Mobile** in `Meteor` read the [*"Mobile"* chapter](https://guide.meteor.com/mobile.html) of the Meteor Guide.

`Meteor` projects come with a package called `mobile-experience` by default, which is a bundle of `fastclick`, `mobile-status-bar` and `launch-screen`. The `fastclick` package might cause some conflicts between `Meteor` and `Ionic`'s functionality, something which will probably cause some unexpected behavior. To fix it, we're going to remove `mobile-experience` and install the rest of its packages explicitly:

    $ meteor remove mobile-experience
    $ meteor add mobile-status-bar
    $ meteor add launch-screen

### Web

`Ionic` apps are still usable in the browser. You can run them using the command:

    $ meteor run
    # OR
    $ npm start

The app should be running on port `3000`, and can be changed by specifying a `--port` option.

[{]: <helper> (nav_step next_ref="https://angular-meteor.com/tutorials/whatsapp2/meteor/chats-page" prev_ref="https://angular-meteor.com/tutorials/whatsapp2-tutorial")
| [< Intro](https://angular-meteor.com/tutorials/whatsapp2-tutorial) | [Next Step >](https://angular-meteor.com/tutorials/whatsapp2/meteor/chats-page) |
|:--------------------------------|--------------------------------:|
[}]: #

