import { Component, OnInit } from '@angular/core';
import * as Moment from 'moment';
import { Observable } from 'rxjs';
import { Chats, Messages } from '../../../../imports/collections';
import { Chat, MessageType } from '../../../../imports/models';
import template from './chats.html';

@Component({
  template
})
export class ChatsPage implements OnInit {
  chats;

  constructor() {
  }

  ngOnInit() {
    this.chats = Chats
      .find({})
      .mergeMap((chats: Chat[]) =>
        Observable.combineLatest(
          ...chats.map((chat: Chat) =>
            Messages
              .find({chatId: chat._id})
              .startWith(null)
              .map(messages => {
                if (messages) chat.lastMessage = messages[0];
                return chat;
              })
          )
        )
      ).zone();
  }

  removeChat(chat: Chat): void {
    this.chats = this.chats.map(chatsArray => {
      const chatIndex = chatsArray.indexOf(chat);
      chatsArray.splice(chatIndex, 1);

      return chatsArray;
    });
  }
}