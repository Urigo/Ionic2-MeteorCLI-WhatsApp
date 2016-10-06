import {Meteor} from 'meteor/meteor';
import {Chats} from "../../../both/collections/chats.collection";
import {Messages} from "../../../both/collections/messages.collection";

Meteor.methods({
  addMessage(chatId: string, content: string): void {
    const chatExists = !!Chats.collection.find(chatId).count();

    if (!chatExists) throw new Meteor.Error('chat-not-exists',
      'Chat doesn\'t exist');

    Messages.collection.insert({
      chatId: chatId,
      content: content,
      createdAt: new Date()
    });
  }
});