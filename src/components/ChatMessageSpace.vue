<template>
  <q-infinite-scroll reverse :offset="150">
    <div class="q-pa-md col">
      <div>
        <div v-for="message in messageDataMock" :key="message.id">
          <q-chat-message
            :name="message.name"
            :avatar="message.avatar"
            :text="message.text"
            :stamp="message.stamp"
            :sent="message.sent"
            :bg-color="message.bgColor"
          />
        </div>
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          bg-color="primary"
        >
          <q-spinner-dots size="2rem" />
        </q-chat-message>
      </div>
    </div>
  </q-infinite-scroll>

  <q-page-scroller reverse position="top" :scroll-offset="20">
    <q-btn elevated rounded color="primary" label="Scroll back down..." />
  </q-page-scroller>
</template>

<script setup lang="ts">
import { messageDataMock } from '../mocks/channelMessageMock';
</script>
