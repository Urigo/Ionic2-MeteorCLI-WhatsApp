import {Component, OnInit} from "@angular/core";
import template from "./chats.component.html"
import {Observable} from "rxjs";
import {Meteor} from 'meteor/meteor';
import {Chat} from "../../../../both/models/chat.model";
import * as style from "./chats.component.scss";
import {Chats} from "../../../../both/collections/chats.collection";
import {Message} from "../../../../both/models/message.model";
import {Messages} from "../../../../both/collections/messages.collection";
import {NavController, PopoverController, ModalController} from "ionic-angular";
import {MessagesPage} from "../chat/messages-page.component";
import {ChatsOptionsComponent} from '../chats/chats-options.component';
import {NewChatComponent} from './new-chat.component';

@Component({
  selector: "chats",
  template,
  styles: [
    style.innerHTML
  ]
})
export class ChatsComponent implements OnInit {
  chats: Observable<Chat[]>;
  senderId: string;

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController
    ) {}

  ngOnInit() {
    this.senderId = Meteor.userId();
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
      ).map(chats => {
        chats.forEach(chat => {
          const receiver = Meteor.users.findOne(chat.memberIds.find(memberId => memberId !== this.senderId))

          chat.title = receiver.profile.name;
          chat.picture = receiver.profile.picture;
        });

        return chats;
      }).zone();
  }

  addChat(): void {
    const modal = this.modalCtrl.create(NewChatComponent);
    modal.present();
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(ChatsOptionsComponent, {}, {
      cssClass: 'options-popover'
    });
 
    popover.present();
  }

  showMessages(chat): void {
    this.navCtrl.push(MessagesPage, {chat});
  }
}
