import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { IonicApp, IonicModule } from "ionic-angular";
import {TabsContainerComponent} from "../pages/tabs-container/tabs-container.component";

@NgModule({
  // Components, Pipes, Directive
  declarations: [
    AppComponent,
    TabsContainerComponent
  ],
  // Entry Components
  entryComponents: [
    AppComponent,
    TabsContainerComponent
  ],
  // Providers
  providers: [

  ],
  // Modules
  imports: [
    IonicModule.forRoot(AppComponent)
  ],
  // Main Component
  bootstrap: [ IonicApp ]
})
export class AppModule {}
