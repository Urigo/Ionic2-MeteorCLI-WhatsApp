import {Meteor} from 'meteor/meteor';
import {Chats} from "../../../both/collections/chats.collection";
import {Messages} from "../../../both/collections/messages.collection";
import {check, Match} from 'meteor/check';
import {Profile} from '../../../both/models/profile.model';

const nonEmptyString = Match.Where((str) => {
  check(str, String);
  return str.length > 0;
});

Meteor.methods({
  updateProfile(profile: Profile): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');
 
    check(profile, {
      name: nonEmptyString,
      picture: nonEmptyString
    });
 
    Meteor.users.update(this.userId, {
      $set: {profile}
    });
  },
  addChat(receiverId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');
 
    check(receiverId, nonEmptyString);
 
    if (receiverId == this.userId) throw new Meteor.Error('illegal-receiver',
      'Receiver must be different than the current logged in user');
 
    const chatExists = !!Chats.collection.find({
      memberIds: {$all: [this.userId, receiverId]}
    }).count();
 
    if (chatExists) throw new Meteor.Error('chat-exists',
      'Chat already exists');
 
    const chat = {
      memberIds: [this.userId, receiverId]
    };
 
    Chats.insert(chat);
  },
  removeChat(chatId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to remove chat');
 
    check(chatId, nonEmptyString);
 
    const chatExists = !!Chats.collection.find(chatId).count();
 
    if (!chatExists) throw new Meteor.Error('chat-not-exists',
      'Chat doesn\'t exist');
 
    Messages.remove({chatId});
    Chats.remove(chatId);
  },
  addMessage(chatId: string, content: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');

    check(chatId, nonEmptyString);
    check(content, nonEmptyString);

    const chatExists = !!Chats.collection.find(chatId).count();

    if (!chatExists) throw new Meteor.Error('chat-not-exists',
      'Chat doesn\'t exist');

    Messages.collection.insert({
      chatId: chatId,
      senderId: this.userId,
      content: content,
      createdAt: new Date()
    });
  }
});