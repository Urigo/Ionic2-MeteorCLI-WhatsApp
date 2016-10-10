import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { IonicApp, IonicModule } from "ionic-angular";
import {TabsContainerComponent} from "../pages/tabs-container/tabs-container.component";
import {ChatsComponent} from "../pages/chats/chats.component";
import {MomentModule} from "angular2-moment";
import {MessagesPage} from "../pages/chat/messages-page.component";
import {LoginComponent} from '../pages/auth/login.component';
import {VerificationComponent} from '../pages/auth/verification.component';
import {ProfileComponent} from '../pages/auth/profile.component';
import {ChatsOptionsComponent} from '../pages/chats/chats-options.component';
import {NewChatComponent} from '../pages/chats/new-chat.component';

@NgModule({
  // Components, Pipes, Directive
  declarations: [
    AppComponent,
    TabsContainerComponent,
    ChatsComponent,
    MessagesPage,
    LoginComponent,
    VerificationComponent,
    ProfileComponent,
    ChatsOptionsComponent,
    NewChatComponent
  ],
  // Entry Components
  entryComponents: [
    AppComponent,
    TabsContainerComponent,
    ChatsComponent,
    MessagesPage,
    LoginComponent,
    VerificationComponent,
    ProfileComponent,
    ChatsOptionsComponent,
    NewChatComponent
  ],
  // Providers
  providers: [

  ],
  // Modules
  imports: [
    IonicModule.forRoot(AppComponent),
    MomentModule
  ],
  // Main Component
  bootstrap: [ IonicApp ]
})
export class AppModule {}
