<template>
  <q-page class="background-style WAL position-relative" :style="style">
    <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container>
      <ChatHeader :currentConversation="currentConversation" />

      <ChatDrawer
        :search="search"
        :conversations="conversations"
        :handleSetConversation="setCurrentConversation"
      />

      <q-page-container
        class="transparent see-trhrough-style"
        style="height: 1000px"
      >
        <span>TEST TEST</span>
        <router-view />
      </q-page-container>

      <ChatFooter :message="message" />
    </q-layout>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import ChatFooter from 'src/components/ChatFooter.vue';
import ChatHeader from 'src/components/ChatHeader.vue';
import ChatDrawer from 'src/components/ChatDrawer.vue';
import { ref, computed } from 'vue';

const conversations = [
  {
    id: 1,
    person: 'Darius Test',
    avatar:
      'https://static-00.iconduck.com/assets.00/vue-icon-2048x1766-ntogpmti.png',
    caption: 'dev test',
    time: '15:00',
    sent: true,
  },
  {
    id: 2,
    person: 'Martin Test',
    avatar:
      'https://static-00.iconduck.com/assets.00/vue-icon-2048x1766-ntogpmti.png',
    caption: 'dev test 2',
    time: '16:00',
    sent: true,
  },
];

const $q = useQuasar();

const search = ref('');
const message = ref('');
const currentConversationIndex = ref(0);

const currentConversation = computed(() => {
  return conversations[currentConversationIndex.value];
});

const style = computed(() => ({
  height: $q.screen.height + 'px',
}));

function setCurrentConversation(index) {
  currentConversationIndex.value = index;
}
</script>

<style lang="sass">
.WAL
  width: 100%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px

  &__layout
    margin: 0 auto
    z-index: 4000
    height: 100%
    width: 90%
    max-width: 950px

.background-style
  background-image: url(/OceanBlue.jpg)
  background-size: cover

.see-trhrough-style
  backdrop-filter: blur(10px)
</style>
