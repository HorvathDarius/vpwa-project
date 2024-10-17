import { defineStore } from 'pinia';
import { conversationMock } from 'src/mocks/channelMessageMock';

export const useConversationStore = defineStore('conversation', {
  state: () => conversationMock[0],
  actions: {
    addUser(newUser: object) {
      this.members.push(newUser);
    },
    addMessage(newMessage: object) {
      this.conversation.push(newMessage);
    },
  },
});
