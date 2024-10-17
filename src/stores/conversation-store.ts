import { defineStore } from 'pinia';
import { conversationMock } from 'src/mocks/channelMessageMock';

/* 
Store
*/
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

/* 
Controller
*/
const fetchConversationData = () => {
  return {
    // returns mock data for now
  };
};
