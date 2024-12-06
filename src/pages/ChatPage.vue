<template>
  <div class="transparent see-through-style">
    <div class="row transparent">
      <ChatHeader :channels="channelStore.channelState.active" />

      <ChatDrawer />

      <ChatMessageSpace />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatHeader from 'src/components/ChatHeader.vue';
import ChatDrawer from 'src/components/ChatDrawer.vue';
import ChatMessageSpace from 'src/components/ChatMessageSpace.vue';
import { useChannelStore } from 'src/stores/channel-store';
import { useQuasar } from 'quasar';
import { watch } from 'vue';

const channelStore = useChannelStore();
const $q = useQuasar();

watch(
  () => $q.appVisible,
  (value) => {
    // console.log('App visible:', value);
    if (value) {
    }
  }
);
</script>
