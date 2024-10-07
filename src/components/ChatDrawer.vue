<template>
  <q-drawer bordered show-if-above :breakpoint="640" class="bg-blue-3">
    <q-toolbar>
      <span> SLACK TEXT APP </span>

      <q-space />

      <q-btn round flat icon="more_vert">
        <q-menu auto-close :offset="[110, 8]">
          <q-list style="min-width: 150px">
            <q-item clickable>
              <q-item-section>New group</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <q-toolbar>
      <q-input
        rounded
        outlined
        dense
        class="WAL__field full-width"
        bg-color="white"
        v-model="searchProp"
        placeholder="Search or start a new conversation"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-toolbar>

    <q-scroll-area style="height: calc(100% - 100px)">
      <q-list>
        <q-item
          v-for="(conversation, index) in conversations"
          :key="conversation.id"
          clickable
          v-ripple
          @click="handleSetConversation(index)"
        >
          <q-item-section avatar>
            <q-avatar>
              <img :src="conversation.avatar" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">
              {{ conversation.person }}
            </q-item-label>
            <q-item-label class="conversation__summary" caption>
              <q-icon name="check" v-if="conversation.sent" />
              <q-icon name="not_interested" />
              {{ conversation.caption }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label caption>
              {{ conversation.time }}
            </q-item-label>
            <q-icon name="keyboard_arrow_down" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue';
const { conversations, search, handleSetConversation } = defineProps([
  'conversations',
  'search',
  'handleSetConversation',
]);
const searchProp = ref(search);
</script>
