import {Component} from "@angular/core";
import template from "./chats.component.html"
import {Observable} from "rxjs";
import {Chat} from "../../../../both/models/chat.model";
import * as moment from "moment";
import * as style from "./chats.component.scss";


@Component({
  selector: "chats",
  template,
  styles: [
    style.innerHTML
  ]
})
export class ChatsComponent {
  chats: Observable<Chat[]>;

  constructor() {
    this.chats = Observable.of([
      {
        _id: '0',
        title: 'Ethan Gonzalez',
        picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
        lastMessage: {
          content: 'You on your way?',
          createdAt: moment().subtract(1, 'hours').toDate()
        }
      },
      {
        _id: '1',
        title: 'Bryan Wallace',
        picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
        lastMessage: {
          content: 'Hey, it\'s me',
          createdAt: moment().subtract(2, 'hours').toDate()
        }
      },
      {
        _id: '2',
        title: 'Avery Stewart',
        picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
        lastMessage: {
          content: 'I should buy a boat',
          createdAt: moment().subtract(1, 'days').toDate()
        }
      },
      {
        _id: '3',
        title: 'Katie Peterson',
        picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
        lastMessage: {
          content: 'Look at my mukluks!',
          createdAt: moment().subtract(4, 'days').toDate()
        }
      },
      {
        _id: '4',
        title: 'Ray Edwards',
        picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
        lastMessage: {
          content: 'This is wicked good ice cream.',
          createdAt: moment().subtract(2, 'weeks').toDate()
        }
      }
    ])
  }
}