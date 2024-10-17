<template>
  <q-list style="height: 85%; border-right: 1px solid #777">
    <q-scroll-area class="fit">
      <ChatChannelComponent
        v-for="channel in channels"
        :key="channel.id"
        :channel="channel"
      />
    </q-scroll-area>
  </q-list>
</template>

<script setup lang="ts">
import ChatChannelComponent from './ChatChannelComponent.vue';
const { channels } = defineProps(['channels']);
</script>
