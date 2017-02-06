[{]: <region> (header)
# Step 1: Bootstraping
[}]: #
[{]: <region> (body)
Both [Meteor](meteor.com) and [Ionic](ionicframework.com) took their platform to the next level in tooling.
Both provide CLI interface instead of bringing bunch of dependencies and configure build tools.
There are also differences between those tools. in this post we will focus on the `Meteor` CLI.

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

[{]: <helper> (diff_step 1.10)
#### Step 1.10: Add theme variables

##### Added client/imports/theme/components.scss
```diff
@@ -0,0 +1,245 @@
+┊   ┊  1┊// Components
+┊   ┊  2┊// --------------------------------------------------
+┊   ┊  3┊
+┊   ┊  4┊@import
+┊   ┊  5┊"{}/node_modules/ionic-angular/components/action-sheet/action-sheet",
+┊   ┊  6┊"{}/node_modules/ionic-angular/components/action-sheet/action-sheet.ios",
+┊   ┊  7┊"{}/node_modules/ionic-angular/components/action-sheet/action-sheet.md",
+┊   ┊  8┊"{}/node_modules/ionic-angular/components/action-sheet/action-sheet.wp";
+┊   ┊  9┊
+┊   ┊ 10┊@import
+┊   ┊ 11┊"{}/node_modules/ionic-angular/components/alert/alert",
+┊   ┊ 12┊"{}/node_modules/ionic-angular/components/alert/alert.ios",
+┊   ┊ 13┊"{}/node_modules/ionic-angular/components/alert/alert.md",
+┊   ┊ 14┊"{}/node_modules/ionic-angular/components/alert/alert.wp";
+┊   ┊ 15┊
+┊   ┊ 16┊@import
+┊   ┊ 17┊"{}/node_modules/ionic-angular/components/app/app",
+┊   ┊ 18┊"{}/node_modules/ionic-angular/components/app/app.ios",
+┊   ┊ 19┊"{}/node_modules/ionic-angular/components/app/app.md",
+┊   ┊ 20┊"{}/node_modules/ionic-angular/components/app/app.wp";
+┊   ┊ 21┊
+┊   ┊ 22┊@import
+┊   ┊ 23┊"{}/node_modules/ionic-angular/components/backdrop/backdrop";
+┊   ┊ 24┊
+┊   ┊ 25┊@import
+┊   ┊ 26┊"{}/node_modules/ionic-angular/components/badge/badge",
+┊   ┊ 27┊"{}/node_modules/ionic-angular/components/badge/badge.ios",
+┊   ┊ 28┊"{}/node_modules/ionic-angular/components/badge/badge.md",
+┊   ┊ 29┊"{}/node_modules/ionic-angular/components/badge/badge.wp";
+┊   ┊ 30┊
+┊   ┊ 31┊@import
+┊   ┊ 32┊"{}/node_modules/ionic-angular/components/button/button",
+┊   ┊ 33┊"{}/node_modules/ionic-angular/components/button/button-icon",
+┊   ┊ 34┊"{}/node_modules/ionic-angular/components/button/button.ios",
+┊   ┊ 35┊"{}/node_modules/ionic-angular/components/button/button.md",
+┊   ┊ 36┊"{}/node_modules/ionic-angular/components/button/button.wp";
+┊   ┊ 37┊
+┊   ┊ 38┊@import
+┊   ┊ 39┊"{}/node_modules/ionic-angular/components/card/card",
+┊   ┊ 40┊"{}/node_modules/ionic-angular/components/card/card.ios",
+┊   ┊ 41┊"{}/node_modules/ionic-angular/components/card/card.md",
+┊   ┊ 42┊"{}/node_modules/ionic-angular/components/card/card.wp";
+┊   ┊ 43┊
+┊   ┊ 44┊@import
+┊   ┊ 45┊"{}/node_modules/ionic-angular/components/checkbox/checkbox.ios",
+┊   ┊ 46┊"{}/node_modules/ionic-angular/components/checkbox/checkbox.md",
+┊   ┊ 47┊"{}/node_modules/ionic-angular/components/checkbox/checkbox.wp";
+┊   ┊ 48┊
+┊   ┊ 49┊@import
+┊   ┊ 50┊"{}/node_modules/ionic-angular/components/chip/chip",
+┊   ┊ 51┊"{}/node_modules/ionic-angular/components/chip/chip.ios",
+┊   ┊ 52┊"{}/node_modules/ionic-angular/components/chip/chip.md",
+┊   ┊ 53┊"{}/node_modules/ionic-angular/components/chip/chip.wp";
+┊   ┊ 54┊
+┊   ┊ 55┊@import
+┊   ┊ 56┊"{}/node_modules/ionic-angular/components/content/content",
+┊   ┊ 57┊"{}/node_modules/ionic-angular/components/content/content.ios",
+┊   ┊ 58┊"{}/node_modules/ionic-angular/components/content/content.md",
+┊   ┊ 59┊"{}/node_modules/ionic-angular/components/content/content.wp";
+┊   ┊ 60┊
+┊   ┊ 61┊@import
+┊   ┊ 62┊"{}/node_modules/ionic-angular/components/datetime/datetime",
+┊   ┊ 63┊"{}/node_modules/ionic-angular/components/datetime/datetime.ios",
+┊   ┊ 64┊"{}/node_modules/ionic-angular/components/datetime/datetime.md",
+┊   ┊ 65┊"{}/node_modules/ionic-angular/components/datetime/datetime.wp";
+┊   ┊ 66┊
+┊   ┊ 67┊@import
+┊   ┊ 68┊"{}/node_modules/ionic-angular/components/fab/fab",
+┊   ┊ 69┊"{}/node_modules/ionic-angular/components/fab/fab.ios",
+┊   ┊ 70┊"{}/node_modules/ionic-angular/components/fab/fab.md",
+┊   ┊ 71┊"{}/node_modules/ionic-angular/components/fab/fab.wp";
+┊   ┊ 72┊
+┊   ┊ 73┊@import
+┊   ┊ 74┊"{}/node_modules/ionic-angular/components/grid/grid";
+┊   ┊ 75┊
+┊   ┊ 76┊@import
+┊   ┊ 77┊"{}/node_modules/ionic-angular/components/icon/icon",
+┊   ┊ 78┊"{}/node_modules/ionic-angular/components/icon/icon.ios",
+┊   ┊ 79┊"{}/node_modules/ionic-angular/components/icon/icon.md",
+┊   ┊ 80┊"{}/node_modules/ionic-angular/components/icon/icon.wp";
+┊   ┊ 81┊
+┊   ┊ 82┊@import
+┊   ┊ 83┊"{}/node_modules/ionic-angular/components/img/img";
+┊   ┊ 84┊
+┊   ┊ 85┊@import
+┊   ┊ 86┊"{}/node_modules/ionic-angular/components/infinite-scroll/infinite-scroll";
+┊   ┊ 87┊
+┊   ┊ 88┊@import
+┊   ┊ 89┊"{}/node_modules/ionic-angular/components/input/input",
+┊   ┊ 90┊"{}/node_modules/ionic-angular/components/input/input.ios",
+┊   ┊ 91┊"{}/node_modules/ionic-angular/components/input/input.md",
+┊   ┊ 92┊"{}/node_modules/ionic-angular/components/input/input.wp";
+┊   ┊ 93┊
+┊   ┊ 94┊@import
+┊   ┊ 95┊"{}/node_modules/ionic-angular/components/item/item",
+┊   ┊ 96┊"{}/node_modules/ionic-angular/components/item/item-media",
+┊   ┊ 97┊"{}/node_modules/ionic-angular/components/item/item-reorder",
+┊   ┊ 98┊"{}/node_modules/ionic-angular/components/item/item-sliding",
+┊   ┊ 99┊"{}/node_modules/ionic-angular/components/item/item.ios",
+┊   ┊100┊"{}/node_modules/ionic-angular/components/item/item.md",
+┊   ┊101┊"{}/node_modules/ionic-angular/components/item/item.wp";
+┊   ┊102┊
+┊   ┊103┊@import
+┊   ┊104┊"{}/node_modules/ionic-angular/components/label/label",
+┊   ┊105┊"{}/node_modules/ionic-angular/components/label/label.ios",
+┊   ┊106┊"{}/node_modules/ionic-angular/components/label/label.md",
+┊   ┊107┊"{}/node_modules/ionic-angular/components/label/label.wp";
+┊   ┊108┊
+┊   ┊109┊@import
+┊   ┊110┊"{}/node_modules/ionic-angular/components/list/list",
+┊   ┊111┊"{}/node_modules/ionic-angular/components/list/list.ios",
+┊   ┊112┊"{}/node_modules/ionic-angular/components/list/list.md",
+┊   ┊113┊"{}/node_modules/ionic-angular/components/list/list.wp";
+┊   ┊114┊
+┊   ┊115┊@import
+┊   ┊116┊"{}/node_modules/ionic-angular/components/loading/loading",
+┊   ┊117┊"{}/node_modules/ionic-angular/components/loading/loading.ios",
+┊   ┊118┊"{}/node_modules/ionic-angular/components/loading/loading.md",
+┊   ┊119┊"{}/node_modules/ionic-angular/components/loading/loading.wp";
+┊   ┊120┊
+┊   ┊121┊@import
+┊   ┊122┊"{}/node_modules/ionic-angular/components/menu/menu",
+┊   ┊123┊"{}/node_modules/ionic-angular/components/menu/menu.ios",
+┊   ┊124┊"{}/node_modules/ionic-angular/components/menu/menu.md",
+┊   ┊125┊"{}/node_modules/ionic-angular/components/menu/menu.wp";
+┊   ┊126┊
+┊   ┊127┊@import
+┊   ┊128┊"{}/node_modules/ionic-angular/components/modal/modal",
+┊   ┊129┊"{}/node_modules/ionic-angular/components/modal/modal.ios",
+┊   ┊130┊"{}/node_modules/ionic-angular/components/modal/modal.md",
+┊   ┊131┊"{}/node_modules/ionic-angular/components/modal/modal.wp";
+┊   ┊132┊
+┊   ┊133┊@import
+┊   ┊134┊"{}/node_modules/ionic-angular/components/note/note.ios",
+┊   ┊135┊"{}/node_modules/ionic-angular/components/note/note.md",
+┊   ┊136┊"{}/node_modules/ionic-angular/components/note/note.wp";
+┊   ┊137┊
+┊   ┊138┊@import
+┊   ┊139┊"{}/node_modules/ionic-angular/components/picker/picker",
+┊   ┊140┊"{}/node_modules/ionic-angular/components/picker/picker.ios",
+┊   ┊141┊"{}/node_modules/ionic-angular/components/picker/picker.md",
+┊   ┊142┊"{}/node_modules/ionic-angular/components/picker/picker.wp";
+┊   ┊143┊
+┊   ┊144┊@import
+┊   ┊145┊"{}/node_modules/ionic-angular/components/popover/popover",
+┊   ┊146┊"{}/node_modules/ionic-angular/components/popover/popover.ios",
+┊   ┊147┊"{}/node_modules/ionic-angular/components/popover/popover.md",
+┊   ┊148┊"{}/node_modules/ionic-angular/components/popover/popover.wp";
+┊   ┊149┊
+┊   ┊150┊@import
+┊   ┊151┊"{}/node_modules/ionic-angular/components/radio/radio.ios",
+┊   ┊152┊"{}/node_modules/ionic-angular/components/radio/radio.md",
+┊   ┊153┊"{}/node_modules/ionic-angular/components/radio/radio.wp";
+┊   ┊154┊
+┊   ┊155┊@import
+┊   ┊156┊"{}/node_modules/ionic-angular/components/range/range",
+┊   ┊157┊"{}/node_modules/ionic-angular/components/range/range.ios",
+┊   ┊158┊"{}/node_modules/ionic-angular/components/range/range.md",
+┊   ┊159┊"{}/node_modules/ionic-angular/components/range/range.wp";
+┊   ┊160┊
+┊   ┊161┊@import
+┊   ┊162┊"{}/node_modules/ionic-angular/components/refresher/refresher";
+┊   ┊163┊
+┊   ┊164┊@import
+┊   ┊165┊"{}/node_modules/ionic-angular/components/scroll/scroll";
+┊   ┊166┊
+┊   ┊167┊@import
+┊   ┊168┊"{}/node_modules/ionic-angular/components/searchbar/searchbar",
+┊   ┊169┊"{}/node_modules/ionic-angular/components/searchbar/searchbar.ios",
+┊   ┊170┊"{}/node_modules/ionic-angular/components/searchbar/searchbar.md",
+┊   ┊171┊"{}/node_modules/ionic-angular/components/searchbar/searchbar.wp";
+┊   ┊172┊
+┊   ┊173┊@import
+┊   ┊174┊"{}/node_modules/ionic-angular/components/segment/segment",
+┊   ┊175┊"{}/node_modules/ionic-angular/components/segment/segment.ios",
+┊   ┊176┊"{}/node_modules/ionic-angular/components/segment/segment.md",
+┊   ┊177┊"{}/node_modules/ionic-angular/components/segment/segment.wp";
+┊   ┊178┊
+┊   ┊179┊@import
+┊   ┊180┊"{}/node_modules/ionic-angular/components/select/select",
+┊   ┊181┊"{}/node_modules/ionic-angular/components/select/select.ios",
+┊   ┊182┊"{}/node_modules/ionic-angular/components/select/select.md",
+┊   ┊183┊"{}/node_modules/ionic-angular/components/select/select.wp";
+┊   ┊184┊
+┊   ┊185┊@import
+┊   ┊186┊"{}/node_modules/ionic-angular/components/show-hide-when/show-hide-when";
+┊   ┊187┊
+┊   ┊188┊@import
+┊   ┊189┊"{}/node_modules/ionic-angular/components/slides/slides";
+┊   ┊190┊
+┊   ┊191┊@import
+┊   ┊192┊"{}/node_modules/ionic-angular/components/spinner/spinner",
+┊   ┊193┊"{}/node_modules/ionic-angular/components/spinner/spinner.ios",
+┊   ┊194┊"{}/node_modules/ionic-angular/components/spinner/spinner.md",
+┊   ┊195┊"{}/node_modules/ionic-angular/components/spinner/spinner.wp";
+┊   ┊196┊
+┊   ┊197┊@import
+┊   ┊198┊"{}/node_modules/ionic-angular/components/tabs/tabs",
+┊   ┊199┊"{}/node_modules/ionic-angular/components/tabs/tabs.ios",
+┊   ┊200┊"{}/node_modules/ionic-angular/components/tabs/tabs.md",
+┊   ┊201┊"{}/node_modules/ionic-angular/components/tabs/tabs.wp";
+┊   ┊202┊
+┊   ┊203┊@import
+┊   ┊204┊"{}/node_modules/ionic-angular/components/toast/toast",
+┊   ┊205┊"{}/node_modules/ionic-angular/components/toast/toast.ios",
+┊   ┊206┊"{}/node_modules/ionic-angular/components/toast/toast.md",
+┊   ┊207┊"{}/node_modules/ionic-angular/components/toast/toast.wp";
+┊   ┊208┊
+┊   ┊209┊@import
+┊   ┊210┊"{}/node_modules/ionic-angular/components/toggle/toggle.ios",
+┊   ┊211┊"{}/node_modules/ionic-angular/components/toggle/toggle.md",
+┊   ┊212┊"{}/node_modules/ionic-angular/components/toggle/toggle.wp";
+┊   ┊213┊
+┊   ┊214┊@import
+┊   ┊215┊"{}/node_modules/ionic-angular/components/toolbar/toolbar",
+┊   ┊216┊"{}/node_modules/ionic-angular/components/toolbar/toolbar-button",
+┊   ┊217┊"{}/node_modules/ionic-angular/components/toolbar/toolbar.ios",
+┊   ┊218┊"{}/node_modules/ionic-angular/components/toolbar/toolbar.md",
+┊   ┊219┊"{}/node_modules/ionic-angular/components/toolbar/toolbar.wp";
+┊   ┊220┊
+┊   ┊221┊@import
+┊   ┊222┊"{}/node_modules/ionic-angular/components/typography/typography",
+┊   ┊223┊"{}/node_modules/ionic-angular/components/typography/typography.ios",
+┊   ┊224┊"{}/node_modules/ionic-angular/components/typography/typography.md",
+┊   ┊225┊"{}/node_modules/ionic-angular/components/typography/typography.wp";
+┊   ┊226┊
+┊   ┊227┊@import
+┊   ┊228┊"{}/node_modules/ionic-angular/components/virtual-scroll/virtual-scroll";
+┊   ┊229┊
+┊   ┊230┊
+┊   ┊231┊// Platforms
+┊   ┊232┊// --------------------------------------------------
+┊   ┊233┊@import
+┊   ┊234┊"{}/node_modules/ionic-angular/platform/cordova",
+┊   ┊235┊"{}/node_modules/ionic-angular/platform/cordova.ios",
+┊   ┊236┊"{}/node_modules/ionic-angular/platform/cordova.md",
+┊   ┊237┊"{}/node_modules/ionic-angular/platform/cordova.wp";
+┊   ┊238┊
+┊   ┊239┊
+┊   ┊240┊// Fonts
+┊   ┊241┊// --------------------------------------------------
+┊   ┊242┊@import
+┊   ┊243┊"ionicons",
+┊   ┊244┊"{}/node_modules/ionic-angular/fonts/noto-sans",
+┊   ┊245┊"{}/node_modules/ionic-angular/fonts/roboto";
```

##### Added client/imports/theme/ionicons.scss
```diff
@@ -0,0 +1,34 @@
+┊  ┊ 1┊// Ionicons Icon Font CSS
+┊  ┊ 2┊// --------------------------
+┊  ┊ 3┊// Ionicons CSS for Ionic's <ion-icon> element
+┊  ┊ 4┊// ionicons-icons.scss has the icons and their unicode characters
+┊  ┊ 5┊
+┊  ┊ 6┊$ionicons-font-path: $font-path !default;
+┊  ┊ 7┊
+┊  ┊ 8┊@import "{}/node_modules/ionicons/dist/scss/ionicons-icons";
+┊  ┊ 9┊@import "{}/node_modules/ionicons/dist/scss/ionicons-variables";
+┊  ┊10┊
+┊  ┊11┊
+┊  ┊12┊@font-face {
+┊  ┊13┊  font-family: "Ionicons";
+┊  ┊14┊  src: url("#{$ionicons-font-path}/ionicons.woff2?v=#{$ionicons-version}") format("woff2"),
+┊  ┊15┊    url("#{$ionicons-font-path}/ionicons.woff?v=#{$ionicons-version}") format("woff"),
+┊  ┊16┊    url("#{$ionicons-font-path}/ionicons.ttf?v=#{$ionicons-version}") format("truetype");
+┊  ┊17┊  font-weight: normal;
+┊  ┊18┊  font-style: normal;
+┊  ┊19┊}
+┊  ┊20┊
+┊  ┊21┊ion-icon {
+┊  ┊22┊  display: inline-block;
+┊  ┊23┊
+┊  ┊24┊  font-family: "Ionicons";
+┊  ┊25┊  -moz-osx-font-smoothing: grayscale;
+┊  ┊26┊  -webkit-font-smoothing: antialiased;
+┊  ┊27┊  font-style: normal;
+┊  ┊28┊  font-variant: normal;
+┊  ┊29┊  font-weight: normal;
+┊  ┊30┊  line-height: 1;
+┊  ┊31┊  text-rendering: auto;
+┊  ┊32┊  text-transform: none;
+┊  ┊33┊  speak: none;
+┊  ┊34┊}
```

##### Added client/imports/theme/variables.scss
```diff
@@ -0,0 +1,30 @@
+┊  ┊ 1┊// Named Color Variables
+┊  ┊ 2┊// --------------------------------------------------
+┊  ┊ 3┊// Named colors makes it easy to reuse colors on various components.
+┊  ┊ 4┊// It's highly recommended to change the default colors
+┊  ┊ 5┊// to match your app's branding. Ionic uses a Sass map of
+┊  ┊ 6┊// colors so you can add, rename and remove colors as needed.
+┊  ┊ 7┊// The "primary" color is the only required color in the map.
+┊  ┊ 8┊
+┊  ┊ 9┊$colors: (
+┊  ┊10┊  primary:    #387ef5,
+┊  ┊11┊  secondary:  #32db64,
+┊  ┊12┊  danger:     #f53d3d,
+┊  ┊13┊  light:      #f4f4f4,
+┊  ┊14┊  dark:       #222
+┊  ┊15┊);
+┊  ┊16┊
+┊  ┊17┊// Components
+┊  ┊18┊// --------------------------------------------------
+┊  ┊19┊
+┊  ┊20┊@import "components";
+┊  ┊21┊
+┊  ┊22┊
+┊  ┊23┊// App Theme
+┊  ┊24┊// --------------------------------------------------
+┊  ┊25┊// Ionic apps can have different themes applied, which can
+┊  ┊26┊// then be future customized. This import comes last
+┊  ┊27┊// so that the above variables are used and Ionic's
+┊  ┊28┊// default are overridden.
+┊  ┊29┊
+┊  ┊30┊@import "{}/node_modules/ionic-angular/themes/ionic.theme.default";
```

##### Changed client/main.scss
```diff
@@ -1,2 +1,5 @@
+┊ ┊1┊// Theme
+┊ ┊2┊@import "imports/theme/variables";
+┊ ┊3┊
 ┊1┊4┊// App
 ┊2┊5┊@import "imports/app/app";🚫↵
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

    $ meteor start
    # OR
    $ npm start

The app should be running on port `3000`, and can be changed by specifying a `--port` option.
[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Intro](../../README.md) | [Next Step >](step2.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #