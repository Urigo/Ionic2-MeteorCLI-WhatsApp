import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ModalController } from 'ionic-angular';
import * as Moment from 'moment';
import { Observable } from 'rxjs';
import { Chats, Messages } from '../../../../imports/collections';
import { Chat, MessageType } from '../../../../imports/models';
import { ChatsOptionsComponent } from './chats-options';
import { MessagesPage } from '../messages/messages';
import template from './chats.html';
import { NewChatComponent } from './new-chat';

@Component({
  template
})
export class ChatsPage implements OnInit {
  chats;

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController) {
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

  addChat(): void {
    const modal = this.modalCtrl.create(NewChatComponent);
    modal.present();
  }

  showMessages(chat): void {
    this.navCtrl.push(MessagesPage, {chat});
  }

  removeChat(chat: Chat): void {
    Chats.remove({_id: chat._id}).subscribe(() => {
    });
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(ChatsOptionsComponent, {}, {
      cssClass: 'options-popover chats-options-popover'
    });

    popover.present();
  }
}