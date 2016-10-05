import {Chat} from "../models/chat.model";
import {MongoObservable} from "meteor-rxjs";

export const Chats = new MongoObservable.Collection<Chat>('chats');
