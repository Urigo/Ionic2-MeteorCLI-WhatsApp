import {Component, OnInit, OnDestroy} from "@angular/core";
import {NavParams, PopoverController} from "ionic-angular";
import {Meteor} from 'meteor/meteor';
import {Chat} from "../../../../both/models/chat.model";
import {Messages} from "../../../../both/collections/messages.collection";
import {Observable} from "rxjs";
import {Message} from "../../../../both/models/message.model";
import template from "./messages-page.component.html";
import style from "./messages-page.component.scss";
import {MessagesOptionsComponent} from './messages-options.component';
import {MeteorObservable} from "meteor-rxjs";

@Component({
  selector: "messages-page",
  template,
  styles: [
    style
  ]
})
export class MessagesPage implements OnInit, OnDestroy {
  private selectedChat: Chat;
  private title: string;
  private picture: string;
  private messages: Observable<Message[]>;
  private senderId: string;
  private message = "";
  private autoScroller: MutationObserver;

  constructor(
    navParams: NavParams,
    private popoverCtrl: PopoverController
  ) {
    this.selectedChat = <Chat>navParams.get('chat');
    this.title = this.selectedChat.title;
    this.picture = this.selectedChat.picture;
    this.senderId = Meteor.userId();
  }

  ngOnInit() {
    this.messages = Messages.find(
      {chatId: this.selectedChat._id},
      {sort: {createdAt: 1}}
    ).map((messages: Message[]) => {
      messages.forEach((message: Message) => {
        message.ownership = this.senderId == message.senderId ? 'mine' : 'other';
      });

      return messages;
    });

    this.autoScroller = this.autoScroll();
  }

  ngOnDestroy() {
    this.autoScroller.disconnect();
  }

  private get messagesPageContent(): Element {
    return document.querySelector('.messages-page-content');
  }

  private get messagesPageFooter(): Element {
    return document.querySelector('.messages-page-footer');
  }

  private get messagesList(): Element {
    return this.messagesPageContent.querySelector('.messages');
  }

  private get messageEditor(): HTMLInputElement {
    return <HTMLInputElement>this.messagesPageFooter.querySelector('.message-editor');
  }

  private get scroller(): Element {
    return this.messagesList.querySelector('.scroll-content');
  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(MessagesOptionsComponent, {
      chat: this.selectedChat
    }, {
      cssClass: 'options-popover'
    });

    popover.present();
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

  autoScroll(): MutationObserver {
    const autoScroller = new MutationObserver(this.scrollDown.bind(this));

    autoScroller.observe(this.messagesList, {
      childList: true,
      subtree: true
    });

    return autoScroller;
  }

  scrollDown(): void {
    this.scroller.scrollTop = this.scroller.scrollHeight;
    this.messageEditor.focus();
  }
}