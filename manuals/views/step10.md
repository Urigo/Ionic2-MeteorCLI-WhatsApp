[{]: <region> (header)
# Step 10: Filter & Pagination
[}]: #
[{]: <region> (body)
## Lazy-Loading

In this step, we will implement a lazy-loading mechanism in the `MessagesPage`. Lazy loading means that only the necessary data will be loaded once we're promoted to the corresponding view, and it will keep loading, but gradually. In the `MessagesPage` case, we will only be provided with several messages once we enter the view, enough messages to fill all of it, and as we scroll up, we will provided with more messages. This way we can have a smooth experience, without the cost of fetching the entire messages collection. We will start by limiting our `messages` subscription into 30 documents:

[{]: <helper> (diff_step 10.1)
#### Step 10.1: Added counter for messages publication

##### Changed server/publications.ts
```diff
@@ -15,7 +15,9 @@
 ┊15┊15┊  });
 ┊16┊16┊});
 ┊17┊17┊
-┊18┊  ┊Meteor.publish('messages', function(chatId: string): Mongo.Cursor<Message> {
+┊  ┊18┊Meteor.publish('messages', function(
+┊  ┊19┊  chatId: string,
+┊  ┊20┊  messagesBatchCounter: number): Mongo.Cursor<Message> {
 ┊19┊21┊  if (!this.userId || !chatId) {
 ┊20┊22┊    return;
 ┊21┊23┊  }
```
```diff
@@ -23,7 +25,8 @@
 ┊23┊25┊  return Messages.collection.find({
 ┊24┊26┊    chatId
 ┊25┊27┊  }, {
-┊26┊  ┊    sort: { createdAt: -1 }
+┊  ┊28┊    sort: { createdAt: -1 },
+┊  ┊29┊    limit: 30 * messagesBatchCounter
 ┊27┊30┊  });
 ┊28┊31┊});
```
[}]: #

As we said, we will be fetching more and more messages gradually, so we will need to have a counter in the component which will tell us the number of the batch we would like to fetch in our next scroll:

[{]: <helper> (diff_step 10.2)
#### Step 10.2: Add counter to client side

##### Changed client/imports/pages/messages/messages.ts
```diff
@@ -23,6 +23,7 @@
 ┊23┊23┊  senderId: string;
 ┊24┊24┊  loadingMessages: boolean;
 ┊25┊25┊  messagesComputation: Subscription;
+┊  ┊26┊  messagesBatchCounter: number = 0;
 ┊26┊27┊
 ┊27┊28┊  constructor(
 ┊28┊29┊    navParams: NavParams,
```
```diff
@@ -65,7 +66,8 @@
 ┊65┊66┊    this.scrollOffset = this.scroller.scrollHeight;
 ┊66┊67┊
 ┊67┊68┊    MeteorObservable.subscribe('messages',
-┊68┊  ┊      this.selectedChat._id
+┊  ┊69┊      this.selectedChat._id,
+┊  ┊70┊      ++this.messagesBatchCounter
 ┊69┊71┊    ).subscribe(() => {
 ┊70┊72┊      // Keep tracking changes in the dataset and re-render the view
 ┊71┊73┊      if (!this.messagesComputation) {
```
[}]: #

By now, whether you noticed or not, we have some sort of a limitation which we have to solve. Let's say we've fetched all the messages available for the current chat, and we keep scrolling up, the component will keep attempting to fetch more messages, but it doesn't know that it reached the limit. Because of that, we will need to know the total number of messages so we will know when to stop the lazy-loading mechanism. To solve this issue, we will begin with implementing a method which will retrieve the number of total messages for a provided chat:

[{]: <helper> (diff_step 10.3)
#### Step 10.3: Implement countMessages method on server side

##### Changed server/methods.ts
```diff
@@ -93,5 +93,8 @@
 ┊ 93┊ 93┊        type: type
 ┊ 94┊ 94┊      })
 ┊ 95┊ 95┊    };
+┊   ┊ 96┊  },
+┊   ┊ 97┊  countMessages(): number {
+┊   ┊ 98┊    return Messages.collection.find().count();
 ┊ 96┊ 99┊  }
 ┊ 97┊100┊});🚫↵
```
[}]: #

Now, whenever we fetch a new messages-batch we will check if we reached the total messages limit, and if so, we will stop listening to the scroll event:

[{]: <helper> (diff_step 10.4)
#### Step 10.4: Implement actual load more logic

##### Changed client/imports/pages/messages/messages.ts
```diff
@@ -3,7 +3,7 @@
 ┊3┊3┊import { MeteorObservable } from 'meteor-rxjs';
 ┊4┊4┊import { _ } from 'meteor/underscore';
 ┊5┊5┊import * as Moment from 'moment';
-┊6┊ ┊import { Observable, Subscription } from 'rxjs';
+┊ ┊6┊import { Observable, Subscription, Subscriber } from 'rxjs';
 ┊7┊7┊import { Messages } from '../../../../imports/collections';
 ┊8┊8┊import { Chat, Message, MessageType } from '../../../../imports/models';
 ┊9┊9┊import { MessagesOptionsComponent } from './messages-options';
```
```diff
@@ -51,6 +51,22 @@
 ┊51┊51┊  ngOnInit() {
 ┊52┊52┊    this.autoScroller = this.autoScroll();
 ┊53┊53┊    this.subscribeMessages();
+┊  ┊54┊
+┊  ┊55┊    // Get total messages count in database so we can have an indication of when to
+┊  ┊56┊    // stop the auto-subscriber
+┊  ┊57┊    MeteorObservable.call('countMessages').subscribe((messagesCount: number) => {
+┊  ┊58┊      Observable
+┊  ┊59┊      // Chain every scroll event
+┊  ┊60┊        .fromEvent(this.scroller, 'scroll')
+┊  ┊61┊        // Remove the scroll listener once all messages have been fetched
+┊  ┊62┊        .takeUntil(this.autoRemoveScrollListener(messagesCount))
+┊  ┊63┊        // Filter event handling unless we're at the top of the page
+┊  ┊64┊        .filter(() => !this.scroller.scrollTop)
+┊  ┊65┊        // Prohibit parallel subscriptions
+┊  ┊66┊        .filter(() => !this.loadingMessages)
+┊  ┊67┊        // Invoke the messages subscription once all the requirements have been met
+┊  ┊68┊        .forEach(() => this.subscribeMessages());
+┊  ┊69┊    });
 ┊54┊70┊  }
 ┊55┊71┊
 ┊56┊72┊  ngOnDestroy() {
```
```diff
@@ -86,6 +102,29 @@
 ┊ 86┊102┊    });
 ┊ 87┊103┊  }
 ┊ 88┊104┊
+┊   ┊105┊  // Removes the scroll listener once all messages from the past were fetched
+┊   ┊106┊  autoRemoveScrollListener<T>(messagesCount: number): Observable<T> {
+┊   ┊107┊    return Observable.create((observer: Subscriber<T>) => {
+┊   ┊108┊      Messages.find().subscribe({
+┊   ┊109┊        next: (messages) => {
+┊   ┊110┊          // Once all messages have been fetched
+┊   ┊111┊          if (messagesCount !== messages.length) {
+┊   ┊112┊            return;
+┊   ┊113┊          }
+┊   ┊114┊
+┊   ┊115┊          // Signal to stop listening to the scroll event
+┊   ┊116┊          observer.next();
+┊   ┊117┊
+┊   ┊118┊          // Finish the observation to prevent unnecessary calculations
+┊   ┊119┊          observer.complete();
+┊   ┊120┊        },
+┊   ┊121┊        error: (e) => {
+┊   ┊122┊          observer.error(e);
+┊   ┊123┊        }
+┊   ┊124┊      });
+┊   ┊125┊    });
+┊   ┊126┊  }
+┊   ┊127┊
 ┊ 89┊128┊  showOptions(): void {
 ┊ 90┊129┊    const popover = this.popoverCtrl.create(MessagesOptionsComponent, {
 ┊ 91┊130┊      chat: this.selectedChat
```
[}]: #

## Filter

Now we're gonna implement the a search-bar, in the `NewChatComponent`.

Let's start by implementing the logic using `RxJS`. We will use a `BehaviorSubject` which will store the search pattern entered in the search bar, and we will be able to detect changes in its value using the `Observable` API; So whenever the search pattern is being changed, we will update the users list by re-subscribing to the `users` subscription:

[{]: <helper> (diff_step 10.5)
#### Step 10.5: Implement the search bar logic with RxJS

##### Changed client/imports/pages/chats/new-chat.ts
```diff
@@ -2,7 +2,7 @@
 ┊2┊2┊import { AlertController, ViewController } from 'ionic-angular';
 ┊3┊3┊import { MeteorObservable } from 'meteor-rxjs';
 ┊4┊4┊import { _ } from 'meteor/underscore';
-┊5┊ ┊import { Observable, Subscription } from 'rxjs';
+┊ ┊5┊import { Observable, Subscription, BehaviorSubject } from 'rxjs';
 ┊6┊6┊import { Chats, Users } from '../../../../imports/collections';
 ┊7┊7┊import { User } from '../../../../imports/models';
 ┊8┊8┊import template from './new-chat.html';
```
```diff
@@ -11,6 +11,7 @@
 ┊11┊11┊  template
 ┊12┊12┊})
 ┊13┊13┊export class NewChatComponent implements OnInit {
+┊  ┊14┊  searchPattern: BehaviorSubject<any>;
 ┊14┊15┊  senderId: string;
 ┊15┊16┊  users: Observable<User[]>;
 ┊16┊17┊  usersSubscription: Subscription;
```
```diff
@@ -20,10 +21,28 @@
 ┊20┊21┊    private viewCtrl: ViewController
 ┊21┊22┊  ) {
 ┊22┊23┊    this.senderId = Meteor.userId();
+┊  ┊24┊    this.searchPattern = new BehaviorSubject(undefined);
 ┊23┊25┊  }
 ┊24┊26┊
 ┊25┊27┊  ngOnInit() {
-┊26┊  ┊    this.loadUsers();
+┊  ┊28┊    this.observeSearchBar();
+┊  ┊29┊  }
+┊  ┊30┊
+┊  ┊31┊  updateSubscription(newValue) {
+┊  ┊32┊    this.searchPattern.next(newValue);
+┊  ┊33┊  }
+┊  ┊34┊
+┊  ┊35┊  observeSearchBar(): void {
+┊  ┊36┊    this.searchPattern.asObservable()
+┊  ┊37┊    // Prevents the search bar from being spammed
+┊  ┊38┊      .debounce(() => Observable.timer(1000))
+┊  ┊39┊      .forEach(() => {
+┊  ┊40┊        if (this.usersSubscription) {
+┊  ┊41┊          this.usersSubscription.unsubscribe();
+┊  ┊42┊        }
+┊  ┊43┊
+┊  ┊44┊        this.usersSubscription = this.subscribeUsers();
+┊  ┊45┊      });
 ┊27┊46┊  }
 ┊28┊47┊
 ┊29┊48┊  addChat(user): void {
```
```diff
@@ -39,12 +58,12 @@
 ┊39┊58┊    });
 ┊40┊59┊  }
 ┊41┊60┊
-┊42┊  ┊  loadUsers(): void {
+┊  ┊61┊  subscribeUsers(): Subscription {
 ┊43┊62┊    // Fetch all users matching search pattern
-┊44┊  ┊    const subscription = MeteorObservable.subscribe('users');
+┊  ┊63┊    const subscription = MeteorObservable.subscribe('users', this.searchPattern.getValue());
 ┊45┊64┊    const autorun = MeteorObservable.autorun();
 ┊46┊65┊
-┊47┊  ┊    Observable.merge(subscription, autorun).subscribe(() => {
+┊  ┊66┊    return Observable.merge(subscription, autorun).subscribe(() => {
 ┊48┊67┊      this.users = this.findUsers();
 ┊49┊68┊    });
 ┊50┊69┊  }
```
[}]: #

Note how we used the `debounce` method to prevent subscription spamming. Let's add the template for the search-bar in the `NewChat` view, and bind it to the corresponding data-models and methods in the component:

[{]: <helper> (diff_step 10.6)
#### Step 10.6: Update usage

##### Changed client/imports/pages/chats/new-chat.html
```diff
@@ -1,5 +1,16 @@
 ┊ 1┊ 1┊<ion-header>
-┊ 2┊  ┊  <ion-toolbar color="whatsapp">
+┊  ┊ 2┊  <ion-toolbar *ngIf="searching" color="whatsapp">
+┊  ┊ 3┊    <ion-searchbar
+┊  ┊ 4┊      autofocus
+┊  ┊ 5┊      class="seach-bar"
+┊  ┊ 6┊      color="whatsapp"
+┊  ┊ 7┊      [showCancelButton]="true"
+┊  ┊ 8┊      (ionInput)="updateSubscription($event.target.value); searching = true;"
+┊  ┊ 9┊      (ionClear)="updateSubscription(undefined); searching = false;">
+┊  ┊10┊      </ion-searchbar>
+┊  ┊11┊  </ion-toolbar>
+┊  ┊12┊
+┊  ┊13┊  <ion-toolbar *ngIf="!searching" color="whatsapp">
 ┊ 3┊14┊    <ion-title>New Chat</ion-title>
 ┊ 4┊15┊
 ┊ 5┊16┊    <ion-buttons left>
```
```diff
@@ -7,7 +18,7 @@
 ┊ 7┊18┊    </ion-buttons>
 ┊ 8┊19┊
 ┊ 9┊20┊    <ion-buttons end>
-┊10┊  ┊      <button ion-button class="search-button"><ion-icon name="search"></ion-icon></button>
+┊  ┊21┊      <button ion-button class="search-button" (click)="searching = true"><ion-icon name="search"></ion-icon></button>
 ┊11┊22┊    </ion-buttons>
 ┊12┊23┊  </ion-toolbar>
 ┊13┊24┊</ion-header>
```
[}]: #

Now we will modify the `users` subscription to accept the search-pattern, which will be used as a filter for the result-set;

[{]: <helper> (diff_step 10.7)
#### Step 10.7: Add search pattern to the publication

##### Changed server/publications.ts
```diff
@@ -3,16 +3,29 @@
 ┊ 3┊ 3┊import { Chats, Messages, Users } from '../imports/collections';
 ┊ 4┊ 4┊import { Chat, Message, User } from '../imports/models';
 ┊ 5┊ 5┊
-┊ 6┊  ┊Meteor.publish('users', function(): Mongo.Cursor<User> {
+┊  ┊ 6┊Meteor.publishComposite('users', function(
+┊  ┊ 7┊  pattern: string
+┊  ┊ 8┊): PublishCompositeConfig<User> {
 ┊ 7┊ 9┊  if (!this.userId) {
 ┊ 8┊10┊    return;
 ┊ 9┊11┊  }
 ┊10┊12┊
-┊11┊  ┊  return Users.collection.find({}, {
-┊12┊  ┊    fields: {
-┊13┊  ┊      profile: 1
+┊  ┊13┊  let selector = {};
+┊  ┊14┊
+┊  ┊15┊  if (pattern) {
+┊  ┊16┊    selector = {
+┊  ┊17┊      'profile.name': { $regex: pattern, $options: 'i' }
+┊  ┊18┊    };
+┊  ┊19┊  }
+┊  ┊20┊
+┊  ┊21┊  return {
+┊  ┊22┊    find: () => {
+┊  ┊23┊      return Users.collection.find(selector, {
+┊  ┊24┊        fields: { profile: 1 },
+┊  ┊25┊        limit: 15
+┊  ┊26┊      });
 ┊14┊27┊    }
-┊15┊  ┊  });
+┊  ┊28┊  };
 ┊16┊29┊});
 ┊17┊30┊
 ┊18┊31┊Meteor.publish('messages', function(
```
[}]: #
[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step9.md) | [Next Step >](step11.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #