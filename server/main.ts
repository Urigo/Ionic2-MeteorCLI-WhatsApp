import { Main } from './imports/server-main/main';
import './imports/methods/methods';
import './imports/api/sms';

const mainInstance = new Main();
mainInstance.start();
