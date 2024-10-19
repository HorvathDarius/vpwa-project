<template>
  <q-page-container class="col">
    <q-page class="column">
      <div class="position-relative full-height">
        <div class="absolute-full">
          <q-scroll-area
            style="height: 85%"
            v-if="channelStore.currentActiveChannel"
          >
            <q-infinite-scroll
              v-if="messageStore.messages.length > 0"
              reverse
              :offset="200"
              class="q-px-lg"
              @load="loadMoreMessages"
            >
              <q-chat-message
                v-for="message in messageStore.messages"
                :class="message.userID == '1' ? 'text-blue-3' : 'text-grey-1'"
                :key="message.id"
                :name="message.userID"
                :avatar="
                  message.userID == '1'
                    ? '/blankProfileReverse.jpg'
                    : '/blankProfile.jpg'
                "
                :text="[message.content as any]"
                :stamp="message.sentAt"
                :bg-color="message.userID == 'me' ? 'blue-4' : 'grey-5'"
              />
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

            <div
              v-else
              style="height: 100%"
              class="column q-pa-lg justify-center items-center text-center"
            >
              <p class="text-h5 text-white text-weight-bold">
                Oh no... Looks like this channel is empty
              </p>
              <p class="text-h6 text-blue-grey-5">
                Start typing to send a message...
              </p>
            </div>
          </q-scroll-area>

          <div
            v-else
            style="height: 85%"
            class="column q-pa-md justify-center items-center text-center"
          >
            <p class="text-h5 text-white text-weight-bold">
              WELCOME TO OUR CHATTING APPLICATION
            </p>

            <p class="text-h6 text-blue-grey-5">
              Select a channel to start chatting...
            </p>
            <p class="text-h6 text-blue-grey-5">
              Or type '/' to see available commands...
            </p>
          </div>

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
import { useMessageStore } from '../stores/message-store';
import { useChannelStore } from 'src/stores/channel-store';

const showTypingMessage = ref(false);
const messageStore = useMessageStore();
const channelStore = useChannelStore();

const loadMoreMessages = () => {
  console.log('Loading more messages...');
};

const handleMouseHover = () => {
  showTypingMessage.value = !showTypingMessage.value;
};
</script>
