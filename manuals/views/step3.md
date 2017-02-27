# Step 3: Realtime Meteor server

Now that we have the initial chats layout and its component, we will take it a step further by providing the chats data from a server instead of having it locally. In this step we will be implementing the API server and we will do so using Meteor with Mongo.

## Collections

In Meteor, we keep data inside `Mongo.Collections`.

This collection is actually a reference to a [MongoDB](http://mongodb.com) collection, and it is provided to us by a Meteor package called [Minimongo](https://guide.meteor.com/collections.html), and it shares almost the same API as a native MongoDB collection.

We can also wrap it with RxJS' `Observables` using [`meteor-rxjs`](http://npmjs.com/package/meteor-rxjs).

That package has been already installed, it's a part of the boilerplate.

Let's create a Collection of Chats:

[{]: <helper> (diff_step 3.1)
#### Step 3.1: Add the Chats collection

##### Added both/collections/chats.collection.ts
```diff
@@ -0,0 +1,4 @@
+┊ ┊1┊import {Chat} from "../models/chat.model";
+┊ ┊2┊import {MongoObservable} from "meteor-rxjs";
+┊ ┊3┊
+┊ ┊4┊export const Chats = new MongoObservable.Collection<Chat>('chats');
```
[}]: #

And also for Messages:

[{]: <helper> (diff_step 3.2)
#### Step 3.2: Add the Messages collection

##### Added both/collections/messages.collection.ts
```diff
@@ -0,0 +1,4 @@
+┊ ┊1┊import {MongoObservable} from "meteor-rxjs";
+┊ ┊2┊import {Message} from "../models/message.model";
+┊ ┊3┊
+┊ ┊4┊export const Messages = new MongoObservable.Collection<Message>('messages');
```
[}]: #


## Data fixtures

Since we have Collections, we can now move on to fill them with data.

[{]: <helper> (diff_step 3.3)
#### Step 3.3: Added the stub data to the server

##### Changed server/imports/server-main/main.ts
```diff
@@ -1,5 +1,66 @@
+┊  ┊ 1┊import {Chats} from "../../../both/collections/chats.collection";
+┊  ┊ 2┊import {Messages} from "../../../both/collections/messages.collection";
+┊  ┊ 3┊import * as moment from "moment";
+┊  ┊ 4┊
 ┊ 1┊ 5┊export class Main {
 ┊ 2┊ 6┊  start(): void {
+┊  ┊ 7┊    if (Chats.collection.find().count()) return;
+┊  ┊ 8┊
+┊  ┊ 9┊    let chatId;
+┊  ┊10┊
+┊  ┊11┊    chatId = Chats.collection.insert({
+┊  ┊12┊      title: 'Ethan Gonzalez',
+┊  ┊13┊      picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
+┊  ┊14┊    });
+┊  ┊15┊
+┊  ┊16┊    Messages.collection.insert({
+┊  ┊17┊      chatId: chatId,
+┊  ┊18┊      content: 'You on your way?',
+┊  ┊19┊      createdAt: moment().subtract(1, 'hours').toDate()
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
+┊  ┊30┊      createdAt: moment().subtract(2, 'hours').toDate()
+┊  ┊31┊    });
+┊  ┊32┊
+┊  ┊33┊    chatId = Chats.collection.insert({
+┊  ┊34┊      title: 'Avery Stewart',
+┊  ┊35┊      picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'
+┊  ┊36┊    });
+┊  ┊37┊
+┊  ┊38┊    Messages.collection.insert({
+┊  ┊39┊      chatId: chatId,
+┊  ┊40┊      content: 'I should buy a boat',
+┊  ┊41┊      createdAt: moment().subtract(1, 'days').toDate()
+┊  ┊42┊    });
+┊  ┊43┊
+┊  ┊44┊    chatId = Chats.collection.insert({
+┊  ┊45┊      title: 'Katie Peterson',
+┊  ┊46┊      picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
+┊  ┊47┊    });
+┊  ┊48┊
+┊  ┊49┊    Messages.collection.insert({
+┊  ┊50┊      chatId: chatId,
+┊  ┊51┊      content: 'Look at my mukluks!',
+┊  ┊52┊      createdAt: moment().subtract(4, 'days').toDate()
+┊  ┊53┊    });
+┊  ┊54┊
+┊  ┊55┊    chatId = Chats.collection.insert({
+┊  ┊56┊      title: 'Ray Edwards',
+┊  ┊57┊      picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
+┊  ┊58┊    });
 ┊ 3┊59┊
+┊  ┊60┊    Messages.collection.insert({
+┊  ┊61┊      chatId: chatId,
+┊  ┊62┊      content: 'This is wicked good ice cream.',
+┊  ┊63┊      createdAt: moment().subtract(2, 'weeks').toDate()
+┊  ┊64┊    });
 ┊ 4┊65┊  }
 ┊ 5┊66┊}
```
[}]: #

Quick overview.
We use `.collection` to get the actual `Mongo.Collection` instance, this way we avoid using Observables.
At the beginning we check if Chats Collection is empty by using `.count()` operator.
Then we provide few chats with one message each.

We also bundled Message with a Chat using `chatId` property.

This requires a small change in the model:

[{]: <helper> (diff_step 3.4)
#### Step 3.4: Add 'chatId' property to message model

##### Changed both/models/message.model.ts
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊export interface Message {
 ┊2┊2┊  _id?: string;
+┊ ┊3┊  chatId?: string;
 ┊3┊4┊  content?: string;
 ┊4┊5┊  createdAt?: Date;
 ┊5┊6┊}🚫↵
```
[}]: #

## UI

Since Meteor's API requires us to share some of the code in both client and server, we have to import all the collections on the client-side too.

We also want to provide that data to the component:

[{]: <helper> (diff_step 3.5)
#### Step 3.5: Added the chats with the last message using RxJS operators

##### Changed client/imports/pages/chats/chats.component.ts
```diff
@@ -1,10 +1,12 @@
-┊ 1┊  ┊import {Component} from "@angular/core";
+┊  ┊ 1┊import {Component, OnInit} from "@angular/core";
 ┊ 2┊ 2┊import template from "./chats.component.html"
 ┊ 3┊ 3┊import {Observable} from "rxjs";
 ┊ 4┊ 4┊import {Chat} from "../../../../both/models/chat.model";
 ┊ 5┊ 5┊import * as moment from "moment";
 ┊ 6┊ 6┊import style from "./chats.component.scss";
-┊ 7┊  ┊
+┊  ┊ 7┊import {Chats} from "../../../../both/collections/chats.collection";
+┊  ┊ 8┊import {Message} from "../../../../both/models/message.model";
+┊  ┊ 9┊import {Messages} from "../../../../both/collections/messages.collection";
 ┊ 8┊10┊
 ┊ 9┊11┊@Component({
 ┊10┊12┊  selector: "chats",
```
```diff
@@ -13,56 +15,29 @@
 ┊13┊15┊    style
 ┊14┊16┊  ]
 ┊15┊17┊})
-┊16┊  ┊export class ChatsComponent {
+┊  ┊18┊export class ChatsComponent implements OnInit {
 ┊17┊19┊  chats: Observable<Chat[]>;
 ┊18┊20┊
 ┊19┊21┊  constructor() {
-┊20┊  ┊    this.chats = Observable.of([
-┊21┊  ┊      {
-┊22┊  ┊        _id: '0',
-┊23┊  ┊        title: 'Ethan Gonzalez',
-┊24┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
-┊25┊  ┊        lastMessage: {
-┊26┊  ┊          content: 'You on your way?',
-┊27┊  ┊          createdAt: moment().subtract(1, 'hours').toDate()
-┊28┊  ┊        }
-┊29┊  ┊      },
-┊30┊  ┊      {
-┊31┊  ┊        _id: '1',
-┊32┊  ┊        title: 'Bryan Wallace',
-┊33┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
-┊34┊  ┊        lastMessage: {
-┊35┊  ┊          content: 'Hey, it\'s me',
-┊36┊  ┊          createdAt: moment().subtract(2, 'hours').toDate()
-┊37┊  ┊        }
-┊38┊  ┊      },
-┊39┊  ┊      {
-┊40┊  ┊        _id: '2',
-┊41┊  ┊        title: 'Avery Stewart',
-┊42┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
-┊43┊  ┊        lastMessage: {
-┊44┊  ┊          content: 'I should buy a boat',
-┊45┊  ┊          createdAt: moment().subtract(1, 'days').toDate()
-┊46┊  ┊        }
-┊47┊  ┊      },
-┊48┊  ┊      {
-┊49┊  ┊        _id: '3',
-┊50┊  ┊        title: 'Katie Peterson',
-┊51┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
-┊52┊  ┊        lastMessage: {
-┊53┊  ┊          content: 'Look at my mukluks!',
-┊54┊  ┊          createdAt: moment().subtract(4, 'days').toDate()
-┊55┊  ┊        }
-┊56┊  ┊      },
-┊57┊  ┊      {
-┊58┊  ┊        _id: '4',
-┊59┊  ┊        title: 'Ray Edwards',
-┊60┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
-┊61┊  ┊        lastMessage: {
-┊62┊  ┊          content: 'This is wicked good ice cream.',
-┊63┊  ┊          createdAt: moment().subtract(2, 'weeks').toDate()
-┊64┊  ┊        }
-┊65┊  ┊      }
-┊66┊  ┊    ])
+┊  ┊22┊
+┊  ┊23┊  }
+┊  ┊24┊
+┊  ┊25┊  ngOnInit() {
+┊  ┊26┊    this.chats = Chats
+┊  ┊27┊      .find({})
+┊  ┊28┊      .mergeMap<Chat[]>(chats =>
+┊  ┊29┊        Observable.combineLatest(
+┊  ┊30┊          ...chats.map(chat =>
+┊  ┊31┊
+┊  ┊32┊            Messages.find({ chatId: chat._id }, { sort: { createdAt: -1 }, limit: 1 })
+┊  ┊33┊              .startWith(null)
+┊  ┊34┊              .map(messages => {
+┊  ┊35┊                if (messages) chat.lastMessage = messages[0];
+┊  ┊36┊                return chat;
+┊  ┊37┊              })
+┊  ┊38┊
+┊  ┊39┊          )
+┊  ┊40┊        )
+┊  ┊41┊      ).zone();
 ┊67┊42┊  }
-┊68┊  ┊}🚫↵
+┊  ┊43┊}
```
[}]: #

As you can see, we moved `chats` property initialization to `ngOnInit`,  one of the Angular's lifehooks.
It's being called when Component is initalized.

Here comes a quick lesson of RxJS.

Since `Chats.find()` returns an `Observable` we can take advantage of that and bundle it with `Messages.find()` to look for last messages of each chat. This way everything will work as a one body, one Observable.

So what's really going on there?

#### Find chats

First thing is to get all the chats by using `Chats.find({})`.

The result of it will be an array of `Chat` objects.

Let's use `map` operator to make a space for adding the last messages.

```js
Chats.find({})
    .map(chats => {
        const chatsWithMessages = chats.map(chat => {
            chat.lastMessage = undefined;
            return chat;
        });
        
        return chatsWithMessages;
    })
```

#### Look for the last message

For each chat we need to find the last message.
We can achieve this by calling `Messages.find` with proper selector and options.

Let's go through each element of the `chats` property to call `Messages.find`.

```js
const chatsWithMessages = chats.map(chat => Chats.find(/* selector, options*/));
```

That returns an array of Observables.

We need to create a selector.
We have to look for a message that is a part of required chat:

```js
{
    chatId: chat._id
}
```

Okay, but we need only one, last message. Let's sort them by `createdAt`:

```js
{
    sort: {
        createdAt: -1
    }
}
```

This way we get them sorted from newest to oldest.

We look for just one, so selector will look like this:

```js
{
    sort: {
        createdAt: -1
    },
    limit: 1
}
```

Now we can add the last message to the chat.

```js
Messages.find(/*...*/)
    .map(messages => {
        if (messages) chat.lastMessage = messages[0];
        return chat;
    })
```

Great! But what if there are no messages? Wouldn't it emit a value at all?

RxJS contains a operator called `startWith`. It allows to emit some value before Messages.find beings to emit messages.
This way we avoid the waiting for non existing message.

The result:

```js
const chatsWithMessages = chats.map(chat => {
    return Messages.find(/*...*/)
        .startWith(null)
        .map(messages => {
            if (messages) chat.lastMessage = messages[0];
            return chat;
        })
})
```

#### Combine those two

Last thing to do is to handle the array of Observables we created (`chatsWithMessages`).

Yet again, RxJS comes with a rescue. We will use `combineLatest` which takes few Observables and combines them into one Observable.

It works like this:

```js
const source1 = /* an Observable */
const source2 = /* an Observable */

Observable.combineLatest(source1, source2);
```

This combination returns an array of both results (`result`). So the first item of that array will come from `source1` (`result[0]`), second from `source2` (`result[1]`).

Let's see how it applies to our example:

```js
Observable.combineLatest(...chatsWithMessages);
```

We used `...array` because `Observable.combineLatest` expects arguments, not a single one that with an array of Observables.

To merge that observable into `Chats.find({})` we need to use `mergeMap` operator instead of `map`:

```js
Chats.find({})
    .mergeMap(chats => Observable.combineLatest(...chatsWithMessages));
```

In Whatsapp we used `chats.map(/*...*/)` directly instead of creating another variables like we did with `chatsWithMessages`.

With all this, we have now Chats with their last messages available in the UI view.

[{]: <helper> (nav_step next_ref="https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/messages-page" prev_ref="https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/chats-page")
| [< Previous Step](https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/chats-page) | [Next Step >](https://angular-meteor.com/tutorials/whatsapp2/meteor/1.0.0/messages-page) |
|:--------------------------------|--------------------------------:|
[}]: #

