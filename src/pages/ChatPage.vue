<template>
  <q-layout
    view="lHh Lpr lFf"
    class="WAL__layout shadow-3 overflow-hidden"
    container
  >
    <ChatHeader :currentConversation="currentConversation" />

    <ChatDrawer
      :search="search"
      :conversations="conversations"
      :handleSetConversation="setCurrentConversation"
    />

    <q-page-container class="fit transparent see-through-style">
      <q-page>
        <ChatMessageSpace />
      </q-page>
    </q-page-container>

    <ChatFooter :message="message" />
  </q-layout>
</template>

<script setup>
import ChatFooter from 'src/components/ChatFooter.vue';
import ChatHeader from 'src/components/ChatHeader.vue';
import ChatDrawer from 'src/components/ChatDrawer.vue';
import { ref, computed } from 'vue';
import ChatMessageSpace from 'src/components/ChatMessageSpace.vue';
import { conversations } from 'src/mocks/chatChannelMock';

const search = ref('');
const message = ref('');
const currentConversationIndex = ref(0);

const currentConversation = computed(() => {
  return conversations[currentConversationIndex.value];
});

function setCurrentConversation(index) {
  currentConversationIndex.value = index;
}
</script>
