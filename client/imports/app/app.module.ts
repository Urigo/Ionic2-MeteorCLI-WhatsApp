import { NgModule, ErrorHandler } from '@angular/core';
import { MyApp } from './app.component';

@NgModule({
  declarations: [
    MyApp
  ],
  entryComponents: [
    MyApp
  ],
  providers: [
    { provide: ErrorHandler }
  ]
})
export class AppModule {}