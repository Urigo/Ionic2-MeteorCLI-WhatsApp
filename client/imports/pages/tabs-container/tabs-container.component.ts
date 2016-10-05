import {Component} from "@angular/core";
import {ChatsComponent} from "../chats/chats.component";

@Component({
  selector: "tabs-container",
  template: `
  <ion-tabs>
    <ion-tab [root]="chatsRoot" tabIcon="chatboxes"></ion-tab>
    <ion-tab tabIcon="contacts"></ion-tab>
    <ion-tab tabIcon="star"></ion-tab>
    <ion-tab tabIcon="clock"></ion-tab>
  </ion-tabs>
  `
})
export class TabsContainerComponent {
  chatsRoot = ChatsComponent;

  constructor() {

  }
}