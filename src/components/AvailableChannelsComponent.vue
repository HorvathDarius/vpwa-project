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
        v-for="channel in userStore.authInfo.user?.channels"
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
import { useUserStore } from 'src/stores/user-store';

const channelStore = useChannelStore();
const userStore = useUserStore();
</script>
