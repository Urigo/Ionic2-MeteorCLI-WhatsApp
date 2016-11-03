import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
 
 
if (Meteor.settings) {
  Object.assign(Accounts._options, Meteor.settings['accounts-phone']);
  SMS.twilio = Meteor.settings['twilio'];
}