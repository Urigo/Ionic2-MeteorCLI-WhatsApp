import {Meteor} from 'meteor/meteor';
import {MongoObservable} from "meteor-rxjs";
import {User} from "../models/user.model";

export const Users = MongoObservable.fromExisting<User>(Meteor.users);
