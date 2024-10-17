<template>
  <div class="transparent see-through-style">
    <div class="row transparent">
      <ChatHeader :channels="channels" />

      <ChatDrawer :channels="channels" />

      <ChatMessageSpace />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatHeader from 'src/components/ChatHeader.vue';
import ChatDrawer from 'src/components/ChatDrawer.vue';
import ChatMessageSpace from 'src/components/ChatMessageSpace.vue';

import { useChannelStore } from 'src/stores/channel-store';
const channelStore = useChannelStore();
const channels = channelStore.channels;
</script>
