import { defineStore } from 'pinia';
import { messageDataMock } from 'src/mocks/channelMessageMock';

export const useChannelStore = defineStore('channel', {
  state: () => messageDataMock,
  actions: {
    addUser(newUser: object) {
      this.members.push(newUser);
    },
    addMessage(newMessage: object) {
      this.channelConversation.push(newMessage);
    },
  },
});
