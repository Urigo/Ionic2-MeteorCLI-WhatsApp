import 'angular2-meteor-polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { Meteor } from "meteor/meteor";
import { MeteorObservable } from 'meteor-rxjs';
import { AppModule } from './imports/app/app.module';

enableProdMode();

Meteor.startup(() => {
  const sub = MeteorObservable.autorun().subscribe(() => {
    if (Meteor.loggingIn()) return;
    
    setTimeout(() => {
      sub.unsubscribe();
    });
    
    platformBrowserDynamic().bootstrapModule(AppModule);
  });
});
