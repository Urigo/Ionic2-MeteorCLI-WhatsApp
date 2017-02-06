[{]: <region> (header)
# Step 4: Realtime Meteor server
[}]: #
[{]: <region> (body)
Now that we have the initial chats layout and its component, we will take it a step further by providing the chats data from a server instead of having it locally.

## Collections

Collections in `Meteor` are actually references to [MongoDB](http://mongodb.com) collections. This functionality is provided to us by a `Meteor` package called [Minimongo](https://guide.meteor.com/collections.html), and it shares almost the same API as a native `MongoDB` collection. In this tutorial we will be wrapping our collections using `RxJS`'s `Observables`, which is available for us thanks to [meteor-rxjs](http://npmjs.com/package/meteor-rxjs).

Our initial collections are gonna be the chats and messages collections; One is going to store chats-models, and the other is going to store messages-models:

[{]: <helper> (diff_step 4.1)
#### Step 4.1: Add chats and messages collections

##### Added imports/collections/chats.ts
```diff
@@ -0,0 +1,4 @@
+┊ ┊1┊import { MongoObservable } from 'meteor-rxjs';
+┊ ┊2┊import { Chat } from '../models';
+┊ ┊3┊
+┊ ┊4┊export const Chats = new MongoObservable.Collection<Chat>('chats');🚫↵
```

##### Added imports/collections/messages.ts
```diff
@@ -0,0 +1,4 @@
+┊ ┊1┊import { MongoObservable } from 'meteor-rxjs';
+┊ ┊2┊import { Message } from '../models';
+┊ ┊3┊
+┊ ┊4┊export const Messages = new MongoObservable.Collection<Message>('messages');🚫↵
```
[}]: #

We chose to create a dedicated module for each collection, because in the near future there might be more logic added into each one of them. To make importation convenient, we will export all collections from a single file:

[{]: <helper> (diff_step 4.2)
#### Step 4.2: Added main export file

##### Added imports/collections/index.ts
```diff
@@ -0,0 +1,2 @@
+┊ ┊1┊export * from './chats';
+┊ ┊2┊export * from './messages';🚫↵
```
[}]: #

Now instead of requiring each collection individually, we can just require them from the `index.ts` file.

## Data fixtures

Since we have real collections now, and not dummy ones, we will need to fill them up with some data in case they are empty, so we can test our application properly. Let's create our data fixtures in the server:

[{]: <helper> (diff_step 4.3)
#### Step 4.3: Move stubs data to the server side

##### Changed server/main.ts
```diff
@@ -1,5 +1,70 @@
 ┊ 1┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import * as Moment from 'moment';
+┊  ┊ 3┊import { Chats, Messages } from '../imports/collections';
+┊  ┊ 4┊import { MessageType } from '../imports/models';
 ┊ 2┊ 5┊
 ┊ 3┊ 6┊Meteor.startup(() => {
-┊ 4┊  ┊  // code to run on server at startup
-┊ 5┊  ┊});
+┊  ┊ 7┊  if (Chats.find({}).cursor.count() === 0) {
+┊  ┊ 8┊    let chatId;
+┊  ┊ 9┊
+┊  ┊10┊    chatId = Chats.collection.insert({
+┊  ┊11┊      title: 'Ethan Gonzalez',
+┊  ┊12┊      picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
+┊  ┊13┊    });
+┊  ┊14┊
+┊  ┊15┊    Messages.collection.insert({
+┊  ┊16┊      chatId: chatId,
+┊  ┊17┊      content: 'You on your way?',
+┊  ┊18┊      createdAt: Moment().subtract(1, 'hours').toDate(),
+┊  ┊19┊      type: MessageType.TEXT
+┊  ┊20┊    });
+┊  ┊21┊
+┊  ┊22┊    chatId = Chats.collection.insert({
+┊  ┊23┊      title: 'Bryan Wallace',
+┊  ┊24┊      picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg'
+┊  ┊25┊    });
+┊  ┊26┊
+┊  ┊27┊    Messages.collection.insert({
+┊  ┊28┊      chatId: chatId,
+┊  ┊29┊      content: 'Hey, it\'s me',
+┊  ┊30┊      createdAt: Moment().subtract(2, 'hours').toDate(),
+┊  ┊31┊      type: MessageType.TEXT
+┊  ┊32┊    });
+┊  ┊33┊
+┊  ┊34┊    chatId = Chats.collection.insert({
+┊  ┊35┊      title: 'Avery Stewart',
+┊  ┊36┊      picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'
+┊  ┊37┊    });
+┊  ┊38┊
+┊  ┊39┊    Messages.collection.insert({
+┊  ┊40┊      chatId: chatId,
+┊  ┊41┊      content: 'I should buy a boat',
+┊  ┊42┊      createdAt: Moment().subtract(1, 'days').toDate(),
+┊  ┊43┊      type: MessageType.TEXT
+┊  ┊44┊    });
+┊  ┊45┊
+┊  ┊46┊    chatId = Chats.collection.insert({
+┊  ┊47┊      title: 'Katie Peterson',
+┊  ┊48┊      picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
+┊  ┊49┊    });
+┊  ┊50┊
+┊  ┊51┊    Messages.collection.insert({
+┊  ┊52┊      chatId: chatId,
+┊  ┊53┊      content: 'Look at my mukluks!',
+┊  ┊54┊      createdAt: Moment().subtract(4, 'days').toDate(),
+┊  ┊55┊      type: MessageType.TEXT
+┊  ┊56┊    });
+┊  ┊57┊
+┊  ┊58┊    chatId = Chats.collection.insert({
+┊  ┊59┊      title: 'Ray Edwards',
+┊  ┊60┊      picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
+┊  ┊61┊    });
+┊  ┊62┊
+┊  ┊63┊    Messages.collection.insert({
+┊  ┊64┊      chatId: chatId,
+┊  ┊65┊      content: 'This is wicked good ice cream.',
+┊  ┊66┊      createdAt: Moment().subtract(2, 'weeks').toDate(),
+┊  ┊67┊      type: MessageType.TEXT
+┊  ┊68┊    });
+┊  ┊69┊  }
+┊  ┊70┊});🚫↵
```
[}]: #

> This behavior is **not** recommended and should be removed once we're ready for production. A conditioned environment variable might be an appropriate solution.

Note how we use the `.collection` property to get the actual `Mongo.Collection` instance. In the `Meteor` server we want to avoid the usage of observables since it uses `fibers`. More information about fibers can be fond [here](https://www.npmjs.com/package/fibers).

## Preparing Our Client

Now that we have some real data stored in our database, we can replace it with the data fabricated in the `ChatsPage`. This way the client can stay correlated with the server:

[{]: <helper> (diff_step 4.4)
#### Step 4.4: Use server side data

##### Changed client/imports/pages/chats/chats.ts
```diff
@@ -1,76 +1,39 @@
-┊ 1┊  ┊import { Component } from '@angular/core';
+┊  ┊ 1┊import { Component, OnInit } from '@angular/core';
 ┊ 2┊ 2┊import * as Moment from 'moment';
 ┊ 3┊ 3┊import { Observable } from 'rxjs';
+┊  ┊ 4┊import { Chats, Messages } from '../../../../imports/collections';
 ┊ 4┊ 5┊import { Chat, MessageType } from '../../../../imports/models';
 ┊ 5┊ 6┊import template from './chats.html';
 ┊ 6┊ 7┊
 ┊ 7┊ 8┊@Component({
 ┊ 8┊ 9┊  template
 ┊ 9┊10┊})
-┊10┊  ┊export class ChatsPage {
-┊11┊  ┊  chats: Observable<Chat[]>;
+┊  ┊11┊export class ChatsPage implements OnInit {
+┊  ┊12┊  chats;
 ┊12┊13┊
 ┊13┊14┊  constructor() {
-┊14┊  ┊    this.chats = this.findChats();
 ┊15┊15┊  }
 ┊16┊16┊
-┊17┊  ┊  private findChats(): Observable<Chat[]> {
-┊18┊  ┊    return Observable.of([
-┊19┊  ┊      {
-┊20┊  ┊        _id: '0',
-┊21┊  ┊        title: 'Ethan Gonzalez',
-┊22┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
-┊23┊  ┊        lastMessage: {
-┊24┊  ┊          content: 'You on your way?',
-┊25┊  ┊          createdAt: Moment().subtract(1, 'hours').toDate(),
-┊26┊  ┊          type: MessageType.TEXT
-┊27┊  ┊        }
-┊28┊  ┊      },
-┊29┊  ┊      {
-┊30┊  ┊        _id: '1',
-┊31┊  ┊        title: 'Bryan Wallace',
-┊32┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
-┊33┊  ┊        lastMessage: {
-┊34┊  ┊          content: 'Hey, it\'s me',
-┊35┊  ┊          createdAt: Moment().subtract(2, 'hours').toDate(),
-┊36┊  ┊          type: MessageType.TEXT
-┊37┊  ┊        }
-┊38┊  ┊      },
-┊39┊  ┊      {
-┊40┊  ┊        _id: '2',
-┊41┊  ┊        title: 'Avery Stewart',
-┊42┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
-┊43┊  ┊        lastMessage: {
-┊44┊  ┊          content: 'I should buy a boat',
-┊45┊  ┊          createdAt: Moment().subtract(1, 'days').toDate(),
-┊46┊  ┊          type: MessageType.TEXT
-┊47┊  ┊        }
-┊48┊  ┊      },
-┊49┊  ┊      {
-┊50┊  ┊        _id: '3',
-┊51┊  ┊        title: 'Katie Peterson',
-┊52┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
-┊53┊  ┊        lastMessage: {
-┊54┊  ┊          content: 'Look at my mukluks!',
-┊55┊  ┊          createdAt: Moment().subtract(4, 'days').toDate(),
-┊56┊  ┊          type: MessageType.TEXT
-┊57┊  ┊        }
-┊58┊  ┊      },
-┊59┊  ┊      {
-┊60┊  ┊        _id: '4',
-┊61┊  ┊        title: 'Ray Edwards',
-┊62┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
-┊63┊  ┊        lastMessage: {
-┊64┊  ┊          content: 'This is wicked good ice cream.',
-┊65┊  ┊          createdAt: Moment().subtract(2, 'weeks').toDate(),
-┊66┊  ┊          type: MessageType.TEXT
-┊67┊  ┊        }
-┊68┊  ┊      }
-┊69┊  ┊    ]);
+┊  ┊17┊  ngOnInit() {
+┊  ┊18┊    this.chats = Chats
+┊  ┊19┊      .find({})
+┊  ┊20┊      .mergeMap((chats: Chat[]) =>
+┊  ┊21┊        Observable.combineLatest(
+┊  ┊22┊          ...chats.map((chat: Chat) =>
+┊  ┊23┊            Messages
+┊  ┊24┊              .find({chatId: chat._id})
+┊  ┊25┊              .startWith(null)
+┊  ┊26┊              .map(messages => {
+┊  ┊27┊                if (messages) chat.lastMessage = messages[0];
+┊  ┊28┊                return chat;
+┊  ┊29┊              })
+┊  ┊30┊          )
+┊  ┊31┊        )
+┊  ┊32┊      ).zone();
 ┊70┊33┊  }
 ┊71┊34┊
 ┊72┊35┊  removeChat(chat: Chat): void {
-┊73┊  ┊    this.chats = this.chats.map<Chat[]>(chatsArray => {
+┊  ┊36┊    this.chats = this.chats.map(chatsArray => {
 ┊74┊37┊      const chatIndex = chatsArray.indexOf(chat);
 ┊75┊38┊      chatsArray.splice(chatIndex, 1);
```
[}]: #

We will also re-implement the `removeChat` method using an actual `Meteor` collection:

[{]: <helper> (diff_step 4.5)
#### Step 4.5: Implement remove chat with the Collection

##### Changed client/imports/pages/chats/chats.ts
```diff
@@ -33,11 +33,6 @@
 ┊33┊33┊  }
 ┊34┊34┊
 ┊35┊35┊  removeChat(chat: Chat): void {
-┊36┊  ┊    this.chats = this.chats.map(chatsArray => {
-┊37┊  ┊      const chatIndex = chatsArray.indexOf(chat);
-┊38┊  ┊      chatsArray.splice(chatIndex, 1);
-┊39┊  ┊
-┊40┊  ┊      return chatsArray;
-┊41┊  ┊    });
+┊  ┊36┊    Chats.remove({_id: chat._id}).subscribe(() => {});
 ┊42┊37┊  }
 ┊43┊38┊}🚫↵
```
[}]: #
[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step3.md) | [Next Step >](step5.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #