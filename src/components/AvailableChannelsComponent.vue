<template>
  <q-list style="height: 90%">
    <q-scroll-area class="fit">
      <ChatChannelComponent
        v-for="conversation in conversations"
        :key="conversation.id"
        :conversation="conversation"
      />
    </q-scroll-area>
  </q-list>
</template>

<script setup lang="ts">
import ChatChannelComponent from './ChatChannelComponent.vue';
const { conversations } = defineProps(['conversations']);
</script>
