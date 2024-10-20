<template>
  <div class="transparent see-through-style">
    <div class="row transparent">
      <ChatHeader :channels="channelStore.availableChannels" />

      <ChatDrawer :channels="channelStore.availableChannels" />

      <ChatMessageSpace />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatHeader from 'src/components/ChatHeader.vue';
import ChatDrawer from 'src/components/ChatDrawer.vue';
import ChatMessageSpace from 'src/components/ChatMessageSpace.vue';
import { useChannelStore } from 'src/stores/channel-store';
import { useUserStore } from 'src/stores/user-store';
import { useNotifications } from 'src/utils/useNotifications';
import { useQuasar } from 'quasar';
import { onBeforeMount, watch } from 'vue';
import { trimMessage } from 'src/utils/trimMessage';
import { useMessageStore } from 'src/stores/message-store';

const channelStore = useChannelStore();
const userStore = useUserStore();
const messageStore = useMessageStore();
const $q = useQuasar();

let displayNotification = false;

watch(
  () => $q.appVisible,
  (value) => {
    // console.log('App visible:', value);
    if (value) {
      displayNotification = false;
    } else {
      displayNotification = true;
    }
  }
);

if (userStore.currentUserData) {
  const handleCheckChannelInactive = () => {
    let intervalId = 0;
    setInterval(() => {
      intervalId++;
      console.log(`Timing message - ${intervalId}`);
      channelStore.checkChannelsInactive();
    }, 5000);
  };
  handleCheckChannelInactive();

  // These are mock functions used to simulate app behavior
  // They will likely not be used in the final implementaiton, or they will be replaced by other functions
  const handleTimingMessage = () => {
    setInterval(() => {
      if (userStore.currentUserData!.status === 'Do not disturb') {
        return;
      }
      if (displayNotification) {
        useNotifications('mention', 'Martin mentioned you', '');
        useNotifications(
          'message',
          'Martin messagged you',
          trimMessage(
            'This is a very very VERY long message that surely will not be displayed all'
          )
        );
      }
    }, 1000);
  };
  const handleAutomaticMessage = () => {
    let intervalId = 100;
    setInterval(() => {
      const message = 'This is an automatic message - ' + intervalId;
      console.log('Adding automatic message:', intervalId);
      intervalId++;
      messageStore.addMessage('2', '1', message, '');
    }, 3000);
  };

  handleTimingMessage();
  handleAutomaticMessage();

  onBeforeMount(() => {
    channelStore.loadChannels(userStore.currentUserData!.id);
  });
}
</script>
