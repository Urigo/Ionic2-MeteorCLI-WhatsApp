import { Meteor } from 'meteor/meteor';

export const DEFAULT_PICTURE_URL = '/assets/default-profile-pic.svg';

export interface Profile {
  name?: string;
  picture?: string;
}

export enum MessageType {
  TEXT = <any>'text',
  LOCATION = <any>'location'
}

export interface Chat {
  _id?: string;
  title?: string;
  picture?: string;
  lastMessage?: Message;
  memberIds?: string[];
}

export interface Message {
  _id?: string;
  chatId?: string;
  senderId?: string;
  content?: string;
  createdAt?: Date;
  ownership?: string;
  type?: MessageType;
}

export interface User extends Meteor.User {
  profile?: Profile;
}

export interface Location {
  lat: number;
  lng: number;
  zoom: number;
}
