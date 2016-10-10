import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';

Meteor.publish('users', function(): Mongo.Cursor<User> {
  if (!this.userId) return;
 
  return Users.collection.find({}, {
    fields: {
      profile: 1
    }
  });
});
