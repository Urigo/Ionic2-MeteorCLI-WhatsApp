export interface Message {
  _id?: string;
  chatId?: string;
  senderId?: string;
  content?: string;
  ownership?: string;
  createdAt?: Date;
}