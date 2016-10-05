import {Component} from "@angular/core";
import {ChatsComponent} from "../chats/chats.component";

@Component({
  selector: "tabs-container",
  template: `
  <ion-tabs>
    <ion-tab [root]="chatsRoot" tabTitle="Chats" tabIcon="chatboxes"></ion-tab>
    <ion-tab tabTitle="Contacts" tabIcon="contacts"></ion-tab>
    <ion-tab tabTitle="Favorites" tabIcon="star"></ion-tab>
  </ion-tabs>
  `
})
export class TabsContainerComponent {
  chatsRoot = ChatsComponent;

  constructor() {

  }
}