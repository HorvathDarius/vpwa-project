<template>
  <q-page-container class="col">
    <q-page class="column">
      <q-scroll-area style="height: 300px">
        <q-infinite-scroll
          reverse
          :offset="200"
          class="q-px-lg"
          @load="loadMoreMessages"
        >
          <q-chat-message
            v-for="message in channelStore.channelConversation"
            :key="message.id"
            :name="message.name"
            :avatar="message.avatar"
            :text="message.text"
            :stamp="message.stamp"
            :sent="message.sent"
            :bg-color="message.bgColor"
          />
          <q-chat-message
            name="Martin"
            avatar="/blankProfile.jpg"
            bg-color="primary"
          >
            <q-spinner-dots size="2rem" />
          </q-chat-message>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </q-scroll-area>
      <ChatFooter />

      <q-page-scroller reverse position="top" :scroll-offset="100">
        <q-btn elevated rounded color="primary" label="Scroll back down..." />
      </q-page-scroller>
    </q-page>
  </q-page-container>
</template>

<script setup lang="ts">
import ChatFooter from './ChatFooter.vue';
import { useChannelStore } from '../stores/channel-store';

const channelStore = useChannelStore();

const loadMoreMessages = () => {
  console.log('Loading more messages...');
};
</script>
