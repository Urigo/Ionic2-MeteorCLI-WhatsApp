# Step 1: Initial setup

Both [Meteor](meteor.com) and [Ionic](ionicframework.com) took their platform to the next level in tooling.
Both provide CLI interface instead of bringing bunch of dependencies and configure build tools.
There are also differences between those tools. in this post we will focus on the Meteor CLI.

Start by installing Meteor if you haven't already (See [reference](https://www.meteor.com/install)).

Now let's create our app -- write this in the command line:

    $ meteor create --example angular2-boilerplate whatsapp

> Alternatively, use your web browser to access the link:
> https://github.com/bsliran/angular2-meteor-base
> Download the template application, and unzip the files inside. Rename the folder to "whatsapp" and place it into the default directory.
> Or just use clone the repository.

Now let's see what we've got. Go into the new folder:

    $ cd whatsapp

It's a boilerplate that you can use anytime you want to create a project based on `angular2-meteor`.

We are going to add our own files for this tutorial. So let's start by deleting most of the contents in these three folders:

    - /client       (delete)
    - /server       (delete)
    - /both         (delete)

Leave only those files:

    - /client/index.html
    - /client/main.ts
    - /client/imports/app/app.component.ts
    - /client/imports/app/app.component.html
    - /client/imports/app/app.component.scss
    - /client/imports/app/app.module.ts
    - /server/imports/server-main/main.ts
    - /server/main.ts

Let's now update those files:

- `client/index.html` - stays exactly the same

- `client/main.ts` - one small change

- `client/imports/app/app.component.ts` - stays the same

- `client/imports/app/app.component.html` - remove `<demo></demo>`

- `client/imports/app/app.component.scss` - leave it empty

- `client/imports/app/app.module.ts` - remove Providers and Components

- `server/main.ts` - without any change

- `server/imports/server-main/main.ts` - leave only Main class with empty `start()` method

[{]: <helper> (diff_step 1.1)
#### Step 1.1: Remove boilerplate example files

##### Deleted both/collections/demo-collection.ts
```diff
@@ -1,4 +0,0 @@
-┊1┊ ┊import { MongoObservable } from 'meteor-rxjs';
-┊2┊ ┊import { DemoDataObject } from '../models/demo-data-object';
-┊3┊ ┊
-┊4┊ ┊export const DemoCollection = new MongoObservable.Collection<DemoDataObject>('demo-collection');🚫↵
```

##### Deleted both/models/demo-data-object.ts
```diff
@@ -1,4 +0,0 @@
-┊1┊ ┊export interface DemoDataObject {
-┊2┊ ┊  name: string;
-┊3┊ ┊  age: number;
-┊4┊ ┊}🚫↵
```

##### Changed client/imports/app/app.component.html
```diff
@@ -1,4 +1,3 @@
 ┊1┊1┊<div>
 ┊2┊2┊    <h1>Hello Angular2-Meteor!</h1>
-┊3┊ ┊    <demo></demo>
 ┊4┊3┊</div>
```

##### Changed client/imports/app/app.component.scss
```diff
@@ -1,5 +0,0 @@
-┊1┊ ┊body {
-┊2┊ ┊
-┊3┊ ┊}
-┊4┊ ┊
-┊5┊ ┊@import "./imports/demo/demo.component";
```

##### Changed client/imports/app/app.module.ts
```diff
@@ -1,16 +1,11 @@
 ┊ 1┊ 1┊import { NgModule } from '@angular/core';
 ┊ 2┊ 2┊import { BrowserModule } from '@angular/platform-browser';
-┊ 3┊  ┊import { METEOR_PROVIDERS } from 'angular2-meteor';
-┊ 4┊  ┊
 ┊ 5┊ 3┊import { AppComponent } from './app.component';
-┊ 6┊  ┊import { DemoComponent } from './demo/demo.component';
-┊ 7┊  ┊import { DemoDataService } from './demo/demo-data.service';
 ┊ 8┊ 4┊
 ┊ 9┊ 5┊@NgModule({
 ┊10┊ 6┊  // Components, Pipes, Directive
 ┊11┊ 7┊  declarations: [
-┊12┊  ┊    AppComponent,
-┊13┊  ┊    DemoComponent
+┊  ┊ 8┊    AppComponent
 ┊14┊ 9┊  ],
 ┊15┊10┊  // Entry Components
 ┊16┊11┊  entryComponents: [
```
```diff
@@ -18,7 +13,7 @@
 ┊18┊13┊  ],
 ┊19┊14┊  // Providers
 ┊20┊15┊  providers: [
-┊21┊  ┊    DemoDataService
+┊  ┊16┊
 ┊22┊17┊  ],
 ┊23┊18┊  // Modules
 ┊24┊19┊  imports: [
```

##### Deleted client/imports/app/demo/demo-data.service.test.ts
```diff
@@ -1,19 +0,0 @@
-┊ 1┊  ┊// chai uses as asset library
-┊ 2┊  ┊import { assert } from 'chai';
-┊ 3┊  ┊import { Mongo } from 'meteor/mongo';
-┊ 4┊  ┊
-┊ 5┊  ┊// Project imports
-┊ 6┊  ┊import { DemoDataService } from './demo-data.service';
-┊ 7┊  ┊
-┊ 8┊  ┊describe('DemoDataService', () => {
-┊ 9┊  ┊  let demoDataService:DemoDataService;
-┊10┊  ┊
-┊11┊  ┊  beforeEach(() => {
-┊12┊  ┊    // Create the service instance
-┊13┊  ┊    demoDataService = new DemoDataService();
-┊14┊  ┊  });
-┊15┊  ┊
-┊16┊  ┊  it('Should return MongoDB Cursor when requesting the data', () => {
-┊17┊  ┊    assert.isTrue(demoDataService.getData() instanceof Mongo.Cursor);
-┊18┊  ┊  });
-┊19┊  ┊});
```

##### Deleted client/imports/app/demo/demo-data.service.ts
```diff
@@ -1,18 +0,0 @@
-┊ 1┊  ┊import { Injectable } from '@angular/core';
-┊ 2┊  ┊import { ObservableCursor } from 'meteor-rxjs';
-┊ 3┊  ┊
-┊ 4┊  ┊import { DemoDataObject } from '../../../../both/models/demo-data-object';
-┊ 5┊  ┊import { DemoCollection } from '../../../../both/collections/demo-collection';
-┊ 6┊  ┊
-┊ 7┊  ┊@Injectable()
-┊ 8┊  ┊export class DemoDataService {
-┊ 9┊  ┊  private data : ObservableCursor<DemoDataObject>;
-┊10┊  ┊
-┊11┊  ┊  constructor() {
-┊12┊  ┊    this.data = DemoCollection.find({});
-┊13┊  ┊  }
-┊14┊  ┊
-┊15┊  ┊  public getData() : ObservableCursor<DemoDataObject> {
-┊16┊  ┊    return this.data;
-┊17┊  ┊  }
-┊18┊  ┊}
```

##### Deleted client/imports/app/demo/demo.component.html
```diff
@@ -1,8 +0,0 @@
-┊1┊ ┊<h2>{{greeting}}</h2>
-┊2┊ ┊
-┊3┊ ┊This is the available data:
-┊4┊ ┊<ul>
-┊5┊ ┊    <li *ngFor="let item of data | async">
-┊6┊ ┊        {{item.name}} ({{item.age}})
-┊7┊ ┊    </li>
-┊8┊ ┊</ul>
```

##### Deleted client/imports/app/demo/demo.component.scss
```diff
@@ -1,3 +0,0 @@
-┊1┊ ┊demo {
-┊2┊ ┊
-┊3┊ ┊}
```

##### Deleted client/imports/app/demo/demo.component.test.ts
```diff
@@ -1,95 +0,0 @@
-┊ 1┊  ┊// chai uses as asset library
-┊ 2┊  ┊import { assert } from 'chai';
-┊ 3┊  ┊
-┊ 4┊  ┊// Angular 2 tests imports
-┊ 5┊  ┊import { inject } from '@angular/core';
-┊ 6┊  ┊import { provide } from '@angular/core';
-┊ 7┊  ┊import { TestComponentBuilder } from '@angular/compiler';
-┊ 8┊  ┊
-┊ 9┊  ┊// Project imports
-┊10┊  ┊import { DemoComponent } from './demo.component';
-┊11┊  ┊import { DemoDataService } from './demo-data.service';
-┊12┊  ┊import { DemoDataObject } from '../../../../both/models/demo-data-object';
-┊13┊  ┊
-┊14┊  ┊describe('DemoComponent', () => {
-┊15┊  ┊  let demoComponentInstance:DemoComponent;
-┊16┊  ┊  let demoComponentElement;
-┊17┊  ┊  let componentFixture;
-┊18┊  ┊
-┊19┊  ┊  let mockDataArray = [
-┊20┊  ┊    <DemoDataObject>{
-┊21┊  ┊      name: 'Test',
-┊22┊  ┊      age: 10
-┊23┊  ┊    }
-┊24┊  ┊  ];
-┊25┊  ┊
-┊26┊  ┊  let mockDataService = {
-┊27┊  ┊    getData: () => mockDataArray
-┊28┊  ┊  };
-┊29┊  ┊
-┊30┊  ┊  beforeEach(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
-┊31┊  ┊    // We inject TestComponentBuilder that provides use the ability to control the injections of the component
-┊32┊  ┊    // Then we will request to get DemoComponent with a mock service instead of the real DemoDataService
-┊33┊  ┊    // The fixture created contain the element and the instance of the Component class
-┊34┊  ┊    // Finally, we need to save 'detectChanges' and call it to flush the changes into the view.
-┊35┊  ┊    return tcb.overrideProviders(DemoComponent, [
-┊36┊  ┊      provide(DemoDataService, {useValue: mockDataService})
-┊37┊  ┊    ]).createAsync(DemoComponent).then((fixture) => {
-┊38┊  ┊      componentFixture = fixture;
-┊39┊  ┊
-┊40┊  ┊      demoComponentInstance = componentFixture.componentInstance;
-┊41┊  ┊      demoComponentElement = componentFixture.nativeElement;
-┊42┊  ┊
-┊43┊  ┊      componentFixture.detectChanges();
-┊44┊  ┊    });
-┊45┊  ┊  }));
-┊46┊  ┊
-┊47┊  ┊  describe('@Component instance', () => {
-┊48┊  ┊    it('Should have a greeting string on the component', () => {
-┊49┊  ┊      assert.typeOf(demoComponentInstance.greeting, 'string', 'Greeting should be a string!');
-┊50┊  ┊    });
-┊51┊  ┊
-┊52┊  ┊    it('Should say hello to the component on the greeting string', () => {
-┊53┊  ┊      assert.equal(demoComponentInstance.greeting, 'Hello Demo Component!');
-┊54┊  ┊    });
-┊55┊  ┊
-┊56┊  ┊    it('Should have an array (from the mock) of the instance', () => {
-┊57┊  ┊      assert.typeOf(demoComponentInstance.getData(), 'array');
-┊58┊  ┊    });
-┊59┊  ┊
-┊60┊  ┊    it('Should have an items in the array', () => {
-┊61┊  ┊      assert.typeOf(demoComponentInstance.getData(), 'array');
-┊62┊  ┊      assert.equal((<Array>demoComponentInstance.getData()).length, 1);
-┊63┊  ┊    });
-┊64┊  ┊  });
-┊65┊  ┊
-┊66┊  ┊  describe('@Component view', () => {
-┊67┊  ┊    it('Should print the greeting to the screen', () => {
-┊68┊  ┊      assert.include(demoComponentElement.innerHTML, 'Hello Demo Component');
-┊69┊  ┊    });
-┊70┊  ┊
-┊71┊  ┊    it('Should change the greeting when it changes', () => {
-┊72┊  ┊      assert.include(demoComponentElement.innerHTML, 'Hello Demo Component');
-┊73┊  ┊      demoComponentInstance.greeting = 'New Test Greeting';
-┊74┊  ┊      componentFixture.detectChanges();
-┊75┊  ┊      assert.include(demoComponentElement.innerHTML, 'New Test Greeting');
-┊76┊  ┊    });
-┊77┊  ┊
-┊78┊  ┊    it('Should display a list of items in the screen', () => {
-┊79┊  ┊      assert.isNotNull(demoComponentElement.querySelector('ul'));
-┊80┊  ┊    });
-┊81┊  ┊
-┊82┊  ┊    it('Should add item to the list when modifying the data in the service', () => {
-┊83┊  ┊      assert.equal(demoComponentElement.querySelectorAll('li').length, 1);
-┊84┊  ┊
-┊85┊  ┊      mockDataArray.push({
-┊86┊  ┊        name: 'Dotan',
-┊87┊  ┊        age: 20
-┊88┊  ┊      });
-┊89┊  ┊
-┊90┊  ┊      componentFixture.detectChanges();
-┊91┊  ┊
-┊92┊  ┊      assert.equal(demoComponentElement.querySelectorAll('li').length, 2);
-┊93┊  ┊    });
-┊94┊  ┊  });
-┊95┊  ┊});
```

##### Deleted client/imports/app/demo/demo.component.ts
```diff
@@ -1,25 +0,0 @@
-┊ 1┊  ┊import { Component, OnInit } from '@angular/core';
-┊ 2┊  ┊import { ObservableCursor } from 'meteor-rxjs';
-┊ 3┊  ┊import { Observable } from 'rxjs/Observable';
-┊ 4┊  ┊
-┊ 5┊  ┊import { DemoDataService } from './demo-data.service';
-┊ 6┊  ┊import { DemoDataObject } from '../../../../both/models/demo-data-object';
-┊ 7┊  ┊
-┊ 8┊  ┊import template from './demo.component.html';
-┊ 9┊  ┊
-┊10┊  ┊@Component({
-┊11┊  ┊  selector: 'demo',
-┊12┊  ┊  template
-┊13┊  ┊})
-┊14┊  ┊export class DemoComponent implements OnInit {
-┊15┊  ┊  greeting: string;
-┊16┊  ┊  data: Observable<DemoDataObject[]>;
-┊17┊  ┊
-┊18┊  ┊  constructor(private demoDataService: DemoDataService) {
-┊19┊  ┊    this.greeting = 'Hello Demo Component!';
-┊20┊  ┊  }
-┊21┊  ┊
-┊22┊  ┊  ngOnInit() {
-┊23┊  ┊    this.data = this.demoDataService.getData().zone();
-┊24┊  ┊  }
-┊25┊  ┊}
```

##### Deleted client/imports/app/index.ts
```diff
@@ -1,2 +0,0 @@
-┊1┊ ┊export * from './app.component';
-┊2┊ ┊export * from './app.module';
```

##### Deleted client/init.test.ts
```diff
@@ -1,12 +0,0 @@
-┊ 1┊  ┊// angular2-meteor polyfills required for testing
-┊ 2┊  ┊import 'angular2-meteor-tests-polyfills';
-┊ 3┊  ┊
-┊ 4┊  ┊// Angular 2 tests imports
-┊ 5┊  ┊import { platformBrowserDynamicTesting, BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic';
-┊ 6┊  ┊import { TestBed } from '@angular/core';
-┊ 7┊  ┊
-┊ 8┊  ┊// Init the test framework
-┊ 9┊  ┊TestBed.initTestEnvironment(
-┊10┊  ┊  BrowserDynamicTestingModule,
-┊11┊  ┊  platformBrowserDynamicTesting()
-┊12┊  ┊);
```

##### Changed client/main.ts
```diff
@@ -3,7 +3,7 @@
 ┊3┊3┊import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 ┊4┊4┊import { enableProdMode } from '@angular/core';
 ┊5┊5┊import { Meteor } from "meteor/meteor";
-┊6┊ ┊import { AppModule } from './imports/app';
+┊ ┊6┊import { AppModule } from './imports/app/app.module';
 ┊7┊7┊
 ┊8┊8┊enableProdMode();
 ┊9┊9┊
```

##### Changed package.json
```diff
@@ -22,13 +22,17 @@
 ┊22┊22┊    "@angular/compiler": "2.1.1",
 ┊23┊23┊    "@angular/core": "2.1.1",
 ┊24┊24┊    "@angular/forms": "2.1.1",
+┊  ┊25┊    "@angular/http": "2.1.1",
 ┊25┊26┊    "@angular/platform-browser": "2.1.1",
 ┊26┊27┊    "@angular/platform-browser-dynamic": "2.1.1",
+┊  ┊28┊    "@angular/platform-server": "2.1.1",
 ┊27┊29┊    "@angular/router": "3.1.1",
 ┊28┊30┊    "angular2-meteor": "0.7.1",
 ┊29┊31┊    "angular2-meteor-polyfills": "0.1.1",
 ┊30┊32┊    "angular2-meteor-tests-polyfills": "0.0.2",
 ┊31┊33┊    "meteor-node-stubs": "0.2.4",
+┊  ┊34┊    "ionic-angular": "^2.0.0-rc.3",
+┊  ┊35┊    "ionicons": "^3.0.0",
 ┊32┊36┊    "meteor-rxjs": "^0.4.5",
 ┊33┊37┊    "reflect-metadata": "0.1.8",
 ┊34┊38┊    "rxjs": "5.0.0-beta.12",
```

##### Deleted server/imports/server-main/main.test.ts
```diff
@@ -1,40 +0,0 @@
-┊ 1┊  ┊// chai uses as asset library
-┊ 2┊  ┊import * as chai from 'chai';
-┊ 3┊  ┊import * as spies from 'chai-spies';
-┊ 4┊  ┊import StubCollections from 'meteor/hwillson:stub-collections';
-┊ 5┊  ┊
-┊ 6┊  ┊import { DemoCollection } from '../../../both/collections/demo-collection';
-┊ 7┊  ┊import { Main } from './main';
-┊ 8┊  ┊
-┊ 9┊  ┊chai.use(spies);
-┊10┊  ┊
-┊11┊  ┊describe('Server Main', () => {
-┊12┊  ┊  let mainInstance : Main;
-┊13┊  ┊
-┊14┊  ┊  beforeEach(() => {
-┊15┊  ┊    // Creating database mock
-┊16┊  ┊    StubCollections.stub(DemoCollection);
-┊17┊  ┊
-┊18┊  ┊    // Create instance of main class
-┊19┊  ┊    mainInstance = new Main();
-┊20┊  ┊  });
-┊21┊  ┊
-┊22┊  ┊  afterEach(() => {
-┊23┊  ┊    // Restore database
-┊24┊  ┊    StubCollections.restore();
-┊25┊  ┊  });
-┊26┊  ┊
-┊27┊  ┊  it('Should call initFakeData on startup', () => {
-┊28┊  ┊    mainInstance.initFakeData = chai.spy();
-┊29┊  ┊    mainInstance.start();
-┊30┊  ┊
-┊31┊  ┊    chai.expect(mainInstance.initFakeData).to.have.been.called();
-┊32┊  ┊  });
-┊33┊  ┊
-┊34┊  ┊  it('Should call insert 3 times when init fake data', () => {
-┊35┊  ┊    DemoCollection.insert = chai.spy();
-┊36┊  ┊    mainInstance.initFakeData();
-┊37┊  ┊
-┊38┊  ┊    chai.expect(DemoCollection.insert).to.have.been.called.exactly(3);
-┊39┊  ┊  });
-┊40┊  ┊});
```

##### Changed server/imports/server-main/main.ts
```diff
@@ -1,27 +1,5 @@
-┊ 1┊  ┊import { DemoCollection } from '../../../both/collections/demo-collection';
-┊ 2┊  ┊import { DemoDataObject } from '../../../both/models/demo-data-object';
-┊ 3┊  ┊
 ┊ 4┊ 1┊export class Main {
 ┊ 5┊ 2┊  start(): void {
-┊ 6┊  ┊    this.initFakeData();
-┊ 7┊  ┊  }
 ┊ 8┊ 3┊
-┊ 9┊  ┊  initFakeData(): void {
-┊10┊  ┊    if (DemoCollection.find({}).cursor.count() === 0) {
-┊11┊  ┊      const data: DemoDataObject[] = [{
-┊12┊  ┊        name: 'Dotan',
-┊13┊  ┊        age: 25
-┊14┊  ┊      }, {
-┊15┊  ┊        name: 'Liran',
-┊16┊  ┊        age: 26
-┊17┊  ┊      }, {
-┊18┊  ┊        name: 'Uri',
-┊19┊  ┊        age: 30
-┊20┊  ┊      }];
-┊21┊  ┊      
-┊22┊  ┊      data.forEach((obj: DemoDataObject) => {
-┊23┊  ┊        DemoCollection.insert(obj);
-┊24┊  ┊      });
-┊25┊  ┊    }
 ┊26┊ 4┊  }
 ┊27┊ 5┊}
```
[}]: #

## Ionic 2

Our project looks clean now. Since we're going to use Ionic, we have to install a proper package:

    $ npm install ionic-angular@2.0.0-rc.3 --save

It requires few more dependencies:

    $ npm install @angular/{http,platform-server} ionicons --save

Great, we have all packages installed, let's move to the more interesting part.

### IonicModule

As you probably know, with Angular 2.0 comes `NgModule` (see [documentation](https://angular.io/docs/ts/latest/guide/ngmodule.html)).

Ionic provides their own NgModule, called `IonicModule` (see [documentation](http://ionicframework.com/docs/v2/api/IonicModule/)).

Let's use the `AppComponent` as the main component of our app (not the root component):

[{]: <helper> (diff_step 1.3)
#### Step 1.3: Updated the NgModule to use Ionic 2

##### Changed client/imports/app/app.module.ts
```diff
@@ -1,6 +1,6 @@
 ┊1┊1┊import { NgModule } from '@angular/core';
-┊2┊ ┊import { BrowserModule } from '@angular/platform-browser';
 ┊3┊2┊import { AppComponent } from './app.component';
+┊ ┊3┊import { IonicApp, IonicModule } from "ionic-angular";
 ┊4┊4┊
 ┊5┊5┊@NgModule({
 ┊6┊6┊  // Components, Pipes, Directive
```
```diff
@@ -17,9 +17,9 @@
 ┊17┊17┊  ],
 ┊18┊18┊  // Modules
 ┊19┊19┊  imports: [
-┊20┊  ┊    BrowserModule
+┊  ┊20┊    IonicModule.forRoot(AppComponent)
 ┊21┊21┊  ],
 ┊22┊22┊  // Main Component
-┊23┊  ┊  bootstrap: [ AppComponent ]
+┊  ┊23┊  bootstrap: [ IonicApp ]
 ┊24┊24┊})
 ┊25┊25┊export class AppModule {}
```
[}]: #

We removed `BrowserModule` since all the declarations and providers are included in `IonicModule`.

We also added [`IonicApp`](http://ionicframework.com/docs/v2/api/components/app/IonicApp/) component which is a root component that lives on top of our `AppComponent`.

Now we have to change the root component's selector inside `client/index.html`:

[{]: <helper> (diff_step 1.4)
#### Step 1.4: Changed the root Component tag

##### Changed client/index.html
```diff
@@ -2,5 +2,5 @@
 ┊2┊2┊    <base href="/">
 ┊3┊3┊</head>
 ┊4┊4┊<body>
-┊5┊ ┊  <app>Loading...</app>
+┊ ┊5┊  <ion-app>Loading...</ion-app>
 ┊6┊6┊</body>
```
[}]: #

### Styles

We need to create our own Ionic stylesheet based on the source:

[{]: <helper> (diff_step 1.5)
#### Step 1.5: Added import for Ionic 2 stylesheet

##### Added client/styles/ionic.scss
```diff
@@ -0,0 +1,280 @@
+┊   ┊  1┊@charset "UTF-8";
+┊   ┊  2┊
+┊   ┊  3┊@import "{}/node_modules/ionicons/dist/scss/ionicons.scss";
+┊   ┊  4┊
+┊   ┊  5┊// Shared Variables
+┊   ┊  6┊// --------------------------------------------------
+┊   ┊  7┊// To customize the look and feel of this app, you can override
+┊   ┊  8┊// the Sass variables found in Ionic's source scss files.
+┊   ┊  9┊// To view all the possible Ionic variables, see:
+┊   ┊ 10┊// http://ionicframework.com/docs/v2/theming/overriding-ionic-variables/
+┊   ┊ 11┊
+┊   ┊ 12┊$text-color:        #000;
+┊   ┊ 13┊$background-color:  #fff;
+┊   ┊ 14┊
+┊   ┊ 15┊
+┊   ┊ 16┊// Named Color Variables
+┊   ┊ 17┊// --------------------------------------------------
+┊   ┊ 18┊// Named colors makes it easy to reuse colors on various components.
+┊   ┊ 19┊// It's highly recommended to change the default colors
+┊   ┊ 20┊// to match your app's branding. Ionic uses a Sass map of
+┊   ┊ 21┊// colors so you can add, rename and remove colors as needed.
+┊   ┊ 22┊// The "primary" color is the only required color in the map.
+┊   ┊ 23┊
+┊   ┊ 24┊$colors: (
+┊   ┊ 25┊        primary:    #387ef5,
+┊   ┊ 26┊        secondary:  #32db64,
+┊   ┊ 27┊        danger:     #f53d3d,
+┊   ┊ 28┊        light:      #f4f4f4,
+┊   ┊ 29┊        dark:       #222,
+┊   ┊ 30┊        favorite:   #69BB7B
+┊   ┊ 31┊);
+┊   ┊ 32┊
+┊   ┊ 33┊// Components
+┊   ┊ 34┊// --------------------------------------------------
+┊   ┊ 35┊
+┊   ┊ 36┊@import
+┊   ┊ 37┊"{}/node_modules/ionic-angular/components/action-sheet/action-sheet",
+┊   ┊ 38┊"{}/node_modules/ionic-angular/components/action-sheet/action-sheet.ios",
+┊   ┊ 39┊"{}/node_modules/ionic-angular/components/action-sheet/action-sheet.md",
+┊   ┊ 40┊"{}/node_modules/ionic-angular/components/action-sheet/action-sheet.wp";
+┊   ┊ 41┊
+┊   ┊ 42┊@import
+┊   ┊ 43┊"{}/node_modules/ionic-angular/components/alert/alert",
+┊   ┊ 44┊"{}/node_modules/ionic-angular/components/alert/alert.ios",
+┊   ┊ 45┊"{}/node_modules/ionic-angular/components/alert/alert.md",
+┊   ┊ 46┊"{}/node_modules/ionic-angular/components/alert/alert.wp";
+┊   ┊ 47┊
+┊   ┊ 48┊@import
+┊   ┊ 49┊"{}/node_modules/ionic-angular/components/app/app",
+┊   ┊ 50┊"{}/node_modules/ionic-angular/components/app/app.ios",
+┊   ┊ 51┊"{}/node_modules/ionic-angular/components/app/app.md",
+┊   ┊ 52┊"{}/node_modules/ionic-angular/components/app/app.wp";
+┊   ┊ 53┊
+┊   ┊ 54┊@import
+┊   ┊ 55┊"{}/node_modules/ionic-angular/components/backdrop/backdrop";
+┊   ┊ 56┊
+┊   ┊ 57┊@import
+┊   ┊ 58┊"{}/node_modules/ionic-angular/components/badge/badge",
+┊   ┊ 59┊"{}/node_modules/ionic-angular/components/badge/badge.ios",
+┊   ┊ 60┊"{}/node_modules/ionic-angular/components/badge/badge.md",
+┊   ┊ 61┊"{}/node_modules/ionic-angular/components/badge/badge.wp";
+┊   ┊ 62┊
+┊   ┊ 63┊@import
+┊   ┊ 64┊"{}/node_modules/ionic-angular/components/button/button",
+┊   ┊ 65┊"{}/node_modules/ionic-angular/components/button/button-icon",
+┊   ┊ 66┊"{}/node_modules/ionic-angular/components/button/button.ios",
+┊   ┊ 67┊"{}/node_modules/ionic-angular/components/button/button.md",
+┊   ┊ 68┊"{}/node_modules/ionic-angular/components/button/button.wp";
+┊   ┊ 69┊
+┊   ┊ 70┊@import
+┊   ┊ 71┊"{}/node_modules/ionic-angular/components/card/card",
+┊   ┊ 72┊"{}/node_modules/ionic-angular/components/card/card.ios",
+┊   ┊ 73┊"{}/node_modules/ionic-angular/components/card/card.md",
+┊   ┊ 74┊"{}/node_modules/ionic-angular/components/card/card.wp";
+┊   ┊ 75┊
+┊   ┊ 76┊@import
+┊   ┊ 77┊"{}/node_modules/ionic-angular/components/checkbox/checkbox.ios",
+┊   ┊ 78┊"{}/node_modules/ionic-angular/components/checkbox/checkbox.md",
+┊   ┊ 79┊"{}/node_modules/ionic-angular/components/checkbox/checkbox.wp";
+┊   ┊ 80┊
+┊   ┊ 81┊@import
+┊   ┊ 82┊"{}/node_modules/ionic-angular/components/chip/chip",
+┊   ┊ 83┊"{}/node_modules/ionic-angular/components/chip/chip.ios",
+┊   ┊ 84┊"{}/node_modules/ionic-angular/components/chip/chip.md",
+┊   ┊ 85┊"{}/node_modules/ionic-angular/components/chip/chip.wp";
+┊   ┊ 86┊
+┊   ┊ 87┊@import
+┊   ┊ 88┊"{}/node_modules/ionic-angular/components/content/content",
+┊   ┊ 89┊"{}/node_modules/ionic-angular/components/content/content.ios",
+┊   ┊ 90┊"{}/node_modules/ionic-angular/components/content/content.md",
+┊   ┊ 91┊"{}/node_modules/ionic-angular/components/content/content.wp";
+┊   ┊ 92┊
+┊   ┊ 93┊@import
+┊   ┊ 94┊"{}/node_modules/ionic-angular/components/datetime/datetime",
+┊   ┊ 95┊"{}/node_modules/ionic-angular/components/datetime/datetime.ios",
+┊   ┊ 96┊"{}/node_modules/ionic-angular/components/datetime/datetime.md",
+┊   ┊ 97┊"{}/node_modules/ionic-angular/components/datetime/datetime.wp";
+┊   ┊ 98┊
+┊   ┊ 99┊@import
+┊   ┊100┊"{}/node_modules/ionic-angular/components/fab/fab",
+┊   ┊101┊"{}/node_modules/ionic-angular/components/fab/fab.ios",
+┊   ┊102┊"{}/node_modules/ionic-angular/components/fab/fab.md",
+┊   ┊103┊"{}/node_modules/ionic-angular/components/fab/fab.wp";
+┊   ┊104┊
+┊   ┊105┊@import
+┊   ┊106┊"{}/node_modules/ionic-angular/components/grid/grid";
+┊   ┊107┊
+┊   ┊108┊@import
+┊   ┊109┊"{}/node_modules/ionic-angular/components/icon/icon",
+┊   ┊110┊"{}/node_modules/ionic-angular/components/icon/icon.ios",
+┊   ┊111┊"{}/node_modules/ionic-angular/components/icon/icon.md",
+┊   ┊112┊"{}/node_modules/ionic-angular/components/icon/icon.wp";
+┊   ┊113┊
+┊   ┊114┊@import
+┊   ┊115┊"{}/node_modules/ionic-angular/components/img/img";
+┊   ┊116┊
+┊   ┊117┊@import
+┊   ┊118┊"{}/node_modules/ionic-angular/components/infinite-scroll/infinite-scroll";
+┊   ┊119┊
+┊   ┊120┊@import
+┊   ┊121┊"{}/node_modules/ionic-angular/components/input/input",
+┊   ┊122┊"{}/node_modules/ionic-angular/components/input/input.ios",
+┊   ┊123┊"{}/node_modules/ionic-angular/components/input/input.md",
+┊   ┊124┊"{}/node_modules/ionic-angular/components/input/input.wp";
+┊   ┊125┊
+┊   ┊126┊@import
+┊   ┊127┊"{}/node_modules/ionic-angular/components/item/item",
+┊   ┊128┊"{}/node_modules/ionic-angular/components/item/item-media",
+┊   ┊129┊"{}/node_modules/ionic-angular/components/item/item-reorder",
+┊   ┊130┊"{}/node_modules/ionic-angular/components/item/item-sliding",
+┊   ┊131┊"{}/node_modules/ionic-angular/components/item/item.ios",
+┊   ┊132┊"{}/node_modules/ionic-angular/components/item/item.md",
+┊   ┊133┊"{}/node_modules/ionic-angular/components/item/item.wp";
+┊   ┊134┊
+┊   ┊135┊@import
+┊   ┊136┊"{}/node_modules/ionic-angular/components/label/label",
+┊   ┊137┊"{}/node_modules/ionic-angular/components/label/label.ios",
+┊   ┊138┊"{}/node_modules/ionic-angular/components/label/label.md",
+┊   ┊139┊"{}/node_modules/ionic-angular/components/label/label.wp";
+┊   ┊140┊
+┊   ┊141┊@import
+┊   ┊142┊"{}/node_modules/ionic-angular/components/list/list",
+┊   ┊143┊"{}/node_modules/ionic-angular/components/list/list.ios",
+┊   ┊144┊"{}/node_modules/ionic-angular/components/list/list.md",
+┊   ┊145┊"{}/node_modules/ionic-angular/components/list/list.wp";
+┊   ┊146┊
+┊   ┊147┊@import
+┊   ┊148┊"{}/node_modules/ionic-angular/components/loading/loading",
+┊   ┊149┊"{}/node_modules/ionic-angular/components/loading/loading.ios",
+┊   ┊150┊"{}/node_modules/ionic-angular/components/loading/loading.md",
+┊   ┊151┊"{}/node_modules/ionic-angular/components/loading/loading.wp";
+┊   ┊152┊
+┊   ┊153┊@import
+┊   ┊154┊"{}/node_modules/ionic-angular/components/menu/menu",
+┊   ┊155┊"{}/node_modules/ionic-angular/components/menu/menu.ios",
+┊   ┊156┊"{}/node_modules/ionic-angular/components/menu/menu.md",
+┊   ┊157┊"{}/node_modules/ionic-angular/components/menu/menu.wp";
+┊   ┊158┊
+┊   ┊159┊@import
+┊   ┊160┊"{}/node_modules/ionic-angular/components/modal/modal",
+┊   ┊161┊"{}/node_modules/ionic-angular/components/modal/modal.ios",
+┊   ┊162┊"{}/node_modules/ionic-angular/components/modal/modal.md",
+┊   ┊163┊"{}/node_modules/ionic-angular/components/modal/modal.wp";
+┊   ┊164┊
+┊   ┊165┊@import
+┊   ┊166┊"{}/node_modules/ionic-angular/components/picker/picker",
+┊   ┊167┊"{}/node_modules/ionic-angular/components/picker/picker.ios",
+┊   ┊168┊"{}/node_modules/ionic-angular/components/picker/picker.md",
+┊   ┊169┊"{}/node_modules/ionic-angular/components/picker/picker.wp";
+┊   ┊170┊
+┊   ┊171┊@import
+┊   ┊172┊"{}/node_modules/ionic-angular/components/popover/popover",
+┊   ┊173┊"{}/node_modules/ionic-angular/components/popover/popover.ios",
+┊   ┊174┊"{}/node_modules/ionic-angular/components/popover/popover.md",
+┊   ┊175┊"{}/node_modules/ionic-angular/components/popover/popover.wp";
+┊   ┊176┊
+┊   ┊177┊@import
+┊   ┊178┊"{}/node_modules/ionic-angular/components/radio/radio.ios",
+┊   ┊179┊"{}/node_modules/ionic-angular/components/radio/radio.md",
+┊   ┊180┊"{}/node_modules/ionic-angular/components/radio/radio.wp";
+┊   ┊181┊
+┊   ┊182┊@import
+┊   ┊183┊"{}/node_modules/ionic-angular/components/range/range",
+┊   ┊184┊"{}/node_modules/ionic-angular/components/range/range.ios",
+┊   ┊185┊"{}/node_modules/ionic-angular/components/range/range.md",
+┊   ┊186┊"{}/node_modules/ionic-angular/components/range/range.wp";
+┊   ┊187┊
+┊   ┊188┊@import
+┊   ┊189┊"{}/node_modules/ionic-angular/components/refresher/refresher";
+┊   ┊190┊
+┊   ┊191┊@import
+┊   ┊192┊"{}/node_modules/ionic-angular/components/scroll/scroll";
+┊   ┊193┊
+┊   ┊194┊@import
+┊   ┊195┊"{}/node_modules/ionic-angular/components/searchbar/searchbar",
+┊   ┊196┊"{}/node_modules/ionic-angular/components/searchbar/searchbar.ios",
+┊   ┊197┊"{}/node_modules/ionic-angular/components/searchbar/searchbar.md",
+┊   ┊198┊"{}/node_modules/ionic-angular/components/searchbar/searchbar.wp";
+┊   ┊199┊
+┊   ┊200┊@import
+┊   ┊201┊"{}/node_modules/ionic-angular/components/segment/segment",
+┊   ┊202┊"{}/node_modules/ionic-angular/components/segment/segment.ios",
+┊   ┊203┊"{}/node_modules/ionic-angular/components/segment/segment.md",
+┊   ┊204┊"{}/node_modules/ionic-angular/components/segment/segment.wp";
+┊   ┊205┊
+┊   ┊206┊@import
+┊   ┊207┊"{}/node_modules/ionic-angular/components/select/select",
+┊   ┊208┊"{}/node_modules/ionic-angular/components/select/select.ios",
+┊   ┊209┊"{}/node_modules/ionic-angular/components/select/select.md",
+┊   ┊210┊"{}/node_modules/ionic-angular/components/select/select.wp";
+┊   ┊211┊
+┊   ┊212┊@import
+┊   ┊213┊"{}/node_modules/ionic-angular/components/show-hide-when/show-hide-when";
+┊   ┊214┊
+┊   ┊215┊@import
+┊   ┊216┊"{}/node_modules/ionic-angular/components/slides/slides";
+┊   ┊217┊
+┊   ┊218┊@import
+┊   ┊219┊"{}/node_modules/ionic-angular/components/spinner/spinner",
+┊   ┊220┊"{}/node_modules/ionic-angular/components/spinner/spinner.ios",
+┊   ┊221┊"{}/node_modules/ionic-angular/components/spinner/spinner.md",
+┊   ┊222┊"{}/node_modules/ionic-angular/components/spinner/spinner.wp";
+┊   ┊223┊
+┊   ┊224┊@import
+┊   ┊225┊"{}/node_modules/ionic-angular/components/tabs/tabs",
+┊   ┊226┊"{}/node_modules/ionic-angular/components/tabs/tabs.ios",
+┊   ┊227┊"{}/node_modules/ionic-angular/components/tabs/tabs.md",
+┊   ┊228┊"{}/node_modules/ionic-angular/components/tabs/tabs.wp";
+┊   ┊229┊
+┊   ┊230┊@import
+┊   ┊231┊"{}/node_modules/ionic-angular/components/toast/toast",
+┊   ┊232┊"{}/node_modules/ionic-angular/components/toast/toast.ios",
+┊   ┊233┊"{}/node_modules/ionic-angular/components/toast/toast.md",
+┊   ┊234┊"{}/node_modules/ionic-angular/components/toast/toast.wp";
+┊   ┊235┊
+┊   ┊236┊@import
+┊   ┊237┊"{}/node_modules/ionic-angular/components/toggle/toggle.ios",
+┊   ┊238┊"{}/node_modules/ionic-angular/components/toggle/toggle.md",
+┊   ┊239┊"{}/node_modules/ionic-angular/components/toggle/toggle.wp";
+┊   ┊240┊
+┊   ┊241┊@import
+┊   ┊242┊"{}/node_modules/ionic-angular/components/toolbar/toolbar",
+┊   ┊243┊"{}/node_modules/ionic-angular/components/toolbar/toolbar-button",
+┊   ┊244┊"{}/node_modules/ionic-angular/components/toolbar/toolbar.ios",
+┊   ┊245┊"{}/node_modules/ionic-angular/components/toolbar/toolbar.md",
+┊   ┊246┊"{}/node_modules/ionic-angular/components/toolbar/toolbar.wp";
+┊   ┊247┊
+┊   ┊248┊@import
+┊   ┊249┊"{}/node_modules/ionic-angular/components/typography/typography",
+┊   ┊250┊"{}/node_modules/ionic-angular/components/typography/typography.ios",
+┊   ┊251┊"{}/node_modules/ionic-angular/components/typography/typography.md",
+┊   ┊252┊"{}/node_modules/ionic-angular/components/typography/typography.wp";
+┊   ┊253┊
+┊   ┊254┊@import
+┊   ┊255┊"{}/node_modules/ionic-angular/components/virtual-scroll/virtual-scroll";
+┊   ┊256┊
+┊   ┊257┊
+┊   ┊258┊// Platforms
+┊   ┊259┊// --------------------------------------------------
+┊   ┊260┊@import
+┊   ┊261┊"{}/node_modules/ionic-angular/platform/cordova",
+┊   ┊262┊"{}/node_modules/ionic-angular/platform/cordova.ios",
+┊   ┊263┊"{}/node_modules/ionic-angular/platform/cordova.md",
+┊   ┊264┊"{}/node_modules/ionic-angular/platform/cordova.wp";
+┊   ┊265┊
+┊   ┊266┊
+┊   ┊267┊// Ionic Variables and Theming. For more info, please see:
+┊   ┊268┊// http://ionicframework.com/docs/v2/theming/
+┊   ┊269┊@import "{}/node_modules/ionic-angular/themes/ionic.globals.scss";
+┊   ┊270┊
+┊   ┊271┊
+┊   ┊272┊// App Theme
+┊   ┊273┊// --------------------------------------------------
+┊   ┊274┊// Ionic apps can have different themes applied, which can
+┊   ┊275┊// then be future customized. This import comes last
+┊   ┊276┊// so that the above variables are used and Ionic's
+┊   ┊277┊// default are overridden.
+┊   ┊278┊
+┊   ┊279┊@import "{}/node_modules/ionic-angular/themes/ionic.theme.default.scss";
+┊   ┊280┊
```
[}]: #

You can just copy paste it.

### Fonts

Ionic looks for fonts in directory we can't access. To fix it, we will use `mys:font` package to teach Meteor how to put them there.

    $ meteor add mys:fonts

That plugin needs to know which font we want to use and where it should be available.

Configuration is pretty easy, you will catch it by just looking on an example:

[{]: <helper> (diff_step 1.7)
#### Step 1.7: Added fonts file declaration

##### Added fonts.json
```diff
@@ -0,0 +1,11 @@
+┊  ┊ 1┊{
+┊  ┊ 2┊  "map": {
+┊  ┊ 3┊    "node_modules/ionic-angular/fonts/roboto-medium.ttf": "fonts/roboto-medium.ttf",
+┊  ┊ 4┊    "node_modules/ionic-angular/fonts/roboto-regular.ttf": "fonts/roboto-regular.ttf",
+┊  ┊ 5┊    "node_modules/ionic-angular/fonts/roboto-medium.woff": "fonts/roboto-medium.woff",
+┊  ┊ 6┊    "node_modules/ionic-angular/fonts/roboto-regular.woff": "fonts/roboto-regular.woff",
+┊  ┊ 7┊    "node_modules/ionicons/dist/fonts/ionicons.woff": "fonts/ionicons.woff",
+┊  ┊ 8┊    "node_modules/ionicons/dist/fonts/ionicons.woff2": "fonts/ionicons.woff2",
+┊  ┊ 9┊    "node_modules/ionicons/dist/fonts/ionicons.ttf": "fonts/ionicons.ttf"
+┊  ┊10┊  }
+┊  ┊11┊}🚫↵
```
[}]: #

Now `roboto-medium.ttf` is available under `http://localhost:3000/fonts/roboto-medium.ttf`.

### Native

Yes, with Ionic you're able to use any native functionality you need.

    $ npm install ionic-native --save

Now we can use one of those functionalities. Let's work with Status Bar:

[{]: <helper> (diff_step 1.9)
#### Step 1.9: Basic native functionality added

##### Changed client/imports/app/app.component.ts
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import { Component } from '@angular/core';
-┊2┊ ┊
+┊ ┊2┊import { Platform } from "ionic-angular";
+┊ ┊3┊import { StatusBar } from "ionic-native";
 ┊3┊4┊import template from './app.component.html';
 ┊4┊5┊
 ┊5┊6┊@Component({
```
```diff
@@ -7,6 +8,11 @@
 ┊ 7┊ 8┊  template
 ┊ 8┊ 9┊})
 ┊ 9┊10┊export class AppComponent {
-┊10┊  ┊  constructor() {
+┊  ┊11┊  constructor(platform: Platform) {
+┊  ┊12┊    platform.ready().then(() => {
+┊  ┊13┊      // Okay, so the platform is ready and our plugins are available.
+┊  ┊14┊      // Here you can do any higher level native things you might need.
+┊  ┊15┊      StatusBar.styleDefault();
+┊  ┊16┊    });
 ┊11┊17┊  }
 ┊12┊18┊}
```
[}]: #

Do a quick overview:

* `platform.ready` returns a `Promise` and tell us that the platform is ready and our plugins are available
* `StatusBar.styleDefault()` makes the app uses the default statusbar (dark text, for light backgrounds).

### Mobile platform

To add mobile support, select the platform(s) you want and run the following command:

    $ meteor add-platform ios
    # OR / AND
    $ meteor add-platform android

To run an app in the emulator use:

    $ meteor run ios
    # OR
    $ meteor run android


To learn more about **Mobile** in Meteor read the [*"Mobile"* chapter](https://guide.meteor.com/mobile.html) of the Meteor Guide.

We also need to add few meta tags:

[{]: <helper> (diff_step 1.11)
#### Step 1.11: Added missing Ionic 2 meta tags

##### Changed client/index.html
```diff
@@ -1,6 +1,10 @@
 ┊ 1┊ 1┊<head>
-┊ 2┊  ┊    <base href="/">
+┊  ┊ 2┊  <base href="/">
+┊  ┊ 3┊  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
+┊  ┊ 4┊  <meta name="format-detection" content="telephone=no">
+┊  ┊ 5┊  <meta name="msapplication-tap-highlight" content="no">
+┊  ┊ 6┊  <meta name="theme-color" content="#4e8ef7">
 ┊ 3┊ 7┊</head>
 ┊ 4┊ 8┊<body>
-┊ 5┊  ┊  <ion-app>Loading...</ion-app>
+┊  ┊ 9┊<ion-app>Loading...</ion-app>
 ┊ 6┊10┊</body>
```
[}]: #

Now, in order to get smooth mobile experience in Ionic 2, we need to make some modifications to Meteor's default packages. 

Meteor comes with a mobile support package called `mobile-experience` which is a bundle for three packages: `fastclick`, `mobile-status-bar` and `launch-screen`, and we need to remove `fastclick` in order to get better result.

So let's make those changes:

    $ meteor remove mobile-experience
    $ meteor add mobile-status-bar
    $ meteor add launch-screen

### Web

You can still use Ionic app in a browser. Just run:

    $ meteor

Or with usage of npm script we have predefined in the boilerplate at the very beginning:

    $ npm start

Go to `http://localhost:3000` to play with the app.

[{]: <helper> (nav_step next_ref="https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/chats-page" prev_ref="https://angular-meteor.com/tutorials/whatsapp2-tutorial")
| [< Intro](https://angular-meteor.com/tutorials/whatsapp2-tutorial) | [Next Step >](https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/chats-page) |
|:--------------------------------|--------------------------------:|
[}]: #

