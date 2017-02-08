import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Chat } from '../../../../imports/models';
import template from './messages.html';

@Component({
  template
})
export class MessagesPage implements OnInit {
  selectedChat: Chat;

  constructor(navParams: NavParams) {
    this.selectedChat = <Chat>navParams.get('chat');

    console.log('Selected chat is: ', this.selectedChat);
  }

  ngOnInit() {

  }
}