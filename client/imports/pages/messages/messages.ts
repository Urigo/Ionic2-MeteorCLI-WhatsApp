import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Messages } from '../../../../imports/collections';
import { Chat, Message } from '../../../../imports/models';
import template from './messages.html';

@Component({
  template
})
export class MessagesPage implements OnInit {
  selectedChat: Chat;

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
}