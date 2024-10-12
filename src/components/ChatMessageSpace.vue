<template>
  <q-page-container class="col overflow: auto;">
    <q-page>
      <div id="scroll-target-id" style="max-height: 779px; overflow: auto">
        <q-infinite-scroll
          reverse
          :offset="200"
          class="q-px-lg"
          @load="loadMoreMessages"
          :scroll-target="'#scroll-target-id'"
        >
          <q-chat-message
            v-for="message in channelConversation"
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
      </div>

      <q-page-scroller reverse position="top" :scroll-offset="100">
        <q-btn elevated rounded color="primary" label="Scroll back down..." />
      </q-page-scroller>

      <ChatFooter />
    </q-page>
  </q-page-container>
</template>

<script setup>
import { messageDataMock } from '../mocks/channelMessageMock';
import ChatFooter from './ChatFooter.vue';

const { channelConversation } = messageDataMock;

const loadMoreMessages = () => {
  console.log('Loading more messages...');
};
</script>
