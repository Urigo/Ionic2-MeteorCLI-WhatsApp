import {Component, OnInit} from "@angular/core";
import template from "./chats.component.html"
import {Observable} from "rxjs";
import {Chat} from "../../../../both/models/chat.model";
import * as style from "./chats.component.scss";
import {Chats} from "../../../../both/collections/chats.collection";
import {Message} from "../../../../both/models/message.model";
import {Messages} from "../../../../both/collections/messages.collection";

@Component({
  selector: "chats",
  template,
  styles: [
    style.innerHTML
  ]
})
export class ChatsComponent implements OnInit {
  chats: Observable<Chat[]>;

  constructor() {

  }

  ngOnInit() {
    this.chats = Chats
      .find({})
      .mergeMap<Chat[]>(chats =>
        Observable.combineLatest(
          ...chats.map(chat =>
           
            Messages.find({ chatId: chat._id }, { sort: { createdAt: -1 }, limit: 1 })
              .startWith(null)
              .map(messages => {
                if (messages) chat.lastMessage = messages[0];
                return chat;
              })
 
          )
        )
      ).zone();
  }
}
