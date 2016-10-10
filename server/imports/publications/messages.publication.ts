import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Messages } from '../../../both/collections/messages.collection';
import { Message } from '../../../both/models/message.model';

Meteor.publish('messages', function(chatId: string): Mongo.Cursor<Message> {
  if (!this.userId) return;
  if (!chatId) return;
 
  return Messages.collection.find({chatId});
});
