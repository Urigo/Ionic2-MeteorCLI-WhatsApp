import {Component, OnInit} from "@angular/core";
import {NavParams} from "ionic-angular";
import {Chat} from "../../../../both/models/chat.model";
import {Messages} from "../../../../both/collections/messages.collection";
import {Observable} from "rxjs";
import {Message} from "../../../../both/models/message.model";
import template from "./messages-page.component.html";
import * as style from "./messages-page.component.scss";
import {MeteorObservable} from "meteor-rxjs";

@Component({
  selector: "messages-page",
  template,
  styles: [
    style.innerHTML
  ]
})
export class MessagesPage implements OnInit {
  private selectedChat: Chat;
  private title: string;
  private picture: string;
  private messages: Observable<Message[]>;
  private message = "";

  constructor(navParams: NavParams) {
    this.selectedChat = <Chat>navParams.get('chat');
    this.title = this.selectedChat.title;
    this.picture = this.selectedChat.picture;
  }

  ngOnInit() {
    let isEven = false;

    this.messages = Messages.find(
      {chatId: this.selectedChat._id},
      {sort: {createdAt: 1}}
    ).map((messages: Message[]) => {
      messages.forEach((message: Message) => {
        message.ownership = isEven ? 'mine' : 'other';
        isEven = !isEven;
      });

      return messages;
    });
  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode == 13) {
      this.sendMessage();
    }
  }

  sendMessage(): void {
    MeteorObservable.call('addMessage', this.selectedChat._id, this.message).zone().subscribe(() => {
      this.message = '';
    });
  }
}