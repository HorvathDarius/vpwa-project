<template>
  <q-layout
    view="lHh Lpr lFf"
    class="WAL__layout shadow-3 overflow-hidden"
    container
  >
    <ChatHeader :currentConversation="currentConversation" />

    <q-page
      class="transparent see-through-style fit row wrap justify-start items-start content-start"
    >
      <ChatDrawer
        :conversations="conversations"
        :handleSetConversation="setCurrentConversation"
      />

      <q-separator vertical inset style="width: 2px" />

      <!-- <q-page-container class="transparent see-through-style"> -->
      <ChatMessageSpace />
    </q-page>
  </q-layout>
</template>

<script setup>
import ChatHeader from 'src/components/ChatHeader.vue';
import ChatDrawer from 'src/components/ChatDrawer.vue';
import { ref, computed } from 'vue';
import ChatMessageSpace from 'src/components/ChatMessageSpace.vue';
import { conversations } from 'src/mocks/chatChannelMock';

const currentConversationIndex = ref(0);

const currentConversation = computed(() => {
  return conversations[currentConversationIndex.value];
});

function setCurrentConversation(index) {
  currentConversationIndex.value = index;
}
</script>
