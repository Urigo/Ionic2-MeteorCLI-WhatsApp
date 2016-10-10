import { Meteor } from 'meteor/meteor';

import { Chats } from '../../../both/collections/chats.collection';
import { Chat } from '../../../both/models/chat.model';
import { Messages } from '../../../both/collections/messages.collection';
import { Message } from '../../../both/models/message.model';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';

Meteor.publishComposite('chats', function(): PublishCompositeConfig<Chat> {
  if (!this.userId) return;
 
  return {
    find: () => {
      return Chats.collection.find({memberIds: this.userId});
    },
 
    children: [
      <PublishCompositeConfig1<Chat, Message>> {
        find: (chat) => {
          return Messages.collection.find({chatId: chat._id}, {
            sort: {createdAt: -1},
            limit: 1
          });
        }
      },
      <PublishCompositeConfig1<Chat, User>> {
        find: (chat) => {
          return Users.collection.find({
            _id: {$in: chat.memberIds}
          }, {
            fields: {profile: 1}
          });
        }
      }
    ]
  };
});
