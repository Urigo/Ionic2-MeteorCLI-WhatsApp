import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Users } from '../imports/collections';
import { User } from '../imports/models';

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