import { defineStore } from 'pinia';
import { channelsMock } from 'src/mocks/chatChannelMock';

export const useChannelStore = defineStore('channel', {
  state: () => channelsMock,
  actions: {
    addChannel(channel: object) {
      this.channels.push(channel);
    },
  },
});
