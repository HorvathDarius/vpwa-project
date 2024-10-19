<template>
  <q-list style="height: 85%; border-right: 1px solid #777">
    <q-scroll-area class="fit">
      <ChatChannelComponent
        v-for="channel in channelStore.availableChannels"
        :key="channel.id"
        :channel="channel"
        @click="() => channelStore.setCurrentActiveChannel(channel)"
      />
    </q-scroll-area>
  </q-list>
</template>

<script setup lang="ts">
import ChatChannelComponent from './ChatChannelComponent.vue';
import { useChannelStore } from 'src/stores/channel-store';

const channelStore = useChannelStore();
</script>
