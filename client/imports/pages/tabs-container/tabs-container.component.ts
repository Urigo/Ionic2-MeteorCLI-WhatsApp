import {Component} from "@angular/core";

@Component({
  selector: "tabs-container",
  template: `
  <ion-tabs>
    <ion-tab tabIcon="chatboxes"></ion-tab>
    <ion-tab tabIcon="contacts"></ion-tab>
    <ion-tab tabIcon="star"></ion-tab>
    <ion-tab tabIcon="clock"></ion-tab>
  </ion-tabs>
  `
})
export class TabsContainerComponent {
  constructor() {

  }
}