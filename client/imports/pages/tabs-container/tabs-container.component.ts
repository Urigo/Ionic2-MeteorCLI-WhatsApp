import {Component} from "@angular/core";

@Component({
  selector: "tabs-container",
  template: `
  <ion-tabs>
    <ion-tab tabTitle="Chats" tabIcon="chatboxes"></ion-tab>
    <ion-tab tabTitle="Contacts" tabIcon="contacts"></ion-tab>
    <ion-tab tabTitle="Favorites" tabIcon="star"></ion-tab>
  </ion-tabs>
  `
})
export class TabsContainerComponent {
  constructor() {

  }
}