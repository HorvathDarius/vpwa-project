import { defineStore } from 'pinia';
import { channelsMock } from 'src/mocks/chatChannelMock';

/* 
Store
*/
export const useChannelStore = defineStore('channel', {
  state: () => channelsMock,
  actions: {
    addChannel(channel: object) {
      this.channels.push(channel);
    },
  },
});

/* 
Controller
*/
