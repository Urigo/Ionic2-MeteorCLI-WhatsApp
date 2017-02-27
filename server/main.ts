import { Main } from './imports/server-main/main';
import './imports/methods/methods';
import './imports/publications/chats.publication';
import './imports/publications/messages.publication';
import './imports/publications/users.publication';
import './imports/api/sms';

const mainInstance = new Main();
mainInstance.start();
