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
import { useNotifications } from 'src/utils/useNotifications';
import { useQuasar } from 'quasar';
import { watch } from 'vue';
import { trimMessage } from 'src/utils/trimMessage';

const channelStore = useChannelStore();
const $q = useQuasar();
let displayNotification = false;

watch(
  () => $q.appVisible,
  (value) => {
    console.log('App visible:', value);
    if (value) {
      displayNotification = false;
    } else {
      displayNotification = true;
    }
  }
);

const handleTimingMessage = () => {
  let intervalId = 0;
  setInterval(() => {
    intervalId++;
    console.log(`Timing message - ${intervalId}`);
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
  }, 3000);
};

// handleTimingMessage();
</script>
