<template>
  <q-list style="height: 85%; border-right: 1px solid #777">
    <q-scroll-area class="fit">
      <ChatChannelComponent
        v-for="channel in channelStore.pendingChannels"
        :key="channel.id"
        :channel="channel"
        :pending="true"
      />
      <ChatChannelComponent
        v-for="channel in channelStore.availableChannels"
        :key="channel.id"
        :channel="channel"
        :pending="false"
      />
    </q-scroll-area>
  </q-list>
</template>

<script setup lang="ts">
import ChatChannelComponent from './ChatChannelComponent.vue';
import { useChannelStore } from 'src/stores/channel-store';

const channelStore = useChannelStore();
</script>
