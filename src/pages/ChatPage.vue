<template>
  <div class="transparent see-through-style">
    <div class="row">
      <ChatHeader />

      <ChatDrawer :conversations="conversations" />

      <q-separator
        vertical
        inset
        style="
          width: 2px;
          background-color: rgba(255, 255, 255, 0.4);
          border-radius: 1rem;
        "
      />

      <ChatMessageSpace />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatHeader from 'src/components/ChatHeader.vue';
import ChatDrawer from 'src/components/ChatDrawer.vue';
import ChatMessageSpace from 'src/components/ChatMessageSpace.vue';
import { conversations } from 'src/mocks/chatChannelMock';
</script>
