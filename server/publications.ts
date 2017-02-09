import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Messages, Users } from '../imports/collections';
import { Message, User } from '../imports/models';

Meteor.publish('users', function(): Mongo.Cursor<User> {
  if (!this.userId) {
    return;
  }

  return Users.collection.find({}, {
    fields: {
      profile: 1
    }
  });
});

Meteor.publish('messages', function(chatId: string): Mongo.Cursor<Message> {
  if (!this.userId || !chatId) {
    return;
  }

  return Messages.collection.find({
    chatId
  }, {
    sort: { createdAt: -1 }
  });
});