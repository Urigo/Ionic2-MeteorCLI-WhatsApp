import { Meteor } from 'meteor/meteor';
import { Chats, Messages } from '../imports/collections';
import { MessageType } from '../imports/models';

Meteor.methods({
  addMessage(type: MessageType, chatId: string, content: string) {
    const chatExists = !!Chats.collection.find(chatId).count();

    if (!chatExists) {
      throw new Meteor.Error('chat-not-exists',
        'Chat doesn\'t exist');
    }

    return {
      messageId: Messages.collection.insert({
        chatId: chatId,
        content: content,
        createdAt: new Date(),
        type: type
      })
    };
  }
});