import { Meteor } from 'meteor/meteor';

import { Profile } from '../models/profile.model';

export interface User extends Meteor.User {
  profile?: Profile;
}
