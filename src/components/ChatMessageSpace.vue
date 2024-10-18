<template>
  <q-page-container class="col">
    <q-page class="column">
      <div class="position-relative full-height">
        <div class="absolute-full">
          <q-scroll-area style="height: 85%">
            <q-infinite-scroll
              reverse
              :offset="200"
              class="q-px-lg"
              @load="loadMoreMessages"
            >
              <q-chat-message
                v-for="message in conversationStore.conversation"
                :class="message.name == 'me' ? 'text-blue-3' : 'text-grey-1'"
                :key="message.id"
                :name="message.name"
                :avatar="message.avatar"
                :text="message.text"
                :stamp="message.stamp"
                :sent="message.sent"
                :bg-color="message.name == 'me' ? 'blue-4' : 'grey-5'"
              />
              <!-- sender.id === user.id -->
              <q-chat-message
                class="text-grey-1"
                name="Martin"
                avatar="/blankProfile.jpg"
                bg-color="grey-5"
              >
                <div @click="handleMouseHover">
                  <q-spinner-dots v-if="!showTypingMessage" size="2rem" />
                  <span v-else>This is a message that is being typed...</span>
                </div>
              </q-chat-message>

              <template v-slot:loading>
                <div class="row justify-center q-my-md">
                  <q-spinner-dots color="primary" size="40px" />
                </div>
              </template>
            </q-infinite-scroll>
          </q-scroll-area>

          <div style="height: 15%; display: flex; align-items: center">
            <ChatFooter />
          </div>
        </div>
      </div>

      <q-page-scroller reverse position="top" :scroll-offset="100">
        <q-btn elevated rounded color="primary" label="Scroll back down..." />
      </q-page-scroller>
    </q-page>
  </q-page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ChatFooter from './ChatFooter.vue';
import { useConversationStore } from '../stores/conversation-store';

const showTypingMessage = ref(false);
const conversationStore = useConversationStore();
console.log(conversationStore);

const loadMoreMessages = () => {
  console.log('Loading more messages...');
};

const handleMouseHover = () => {
  showTypingMessage.value = !showTypingMessage.value;
};
</script>
