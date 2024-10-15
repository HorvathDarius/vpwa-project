<template>
  <q-item clickable v-ripple @click="!handleOnSetConversation">
    <q-item-section avatar>
      <q-avatar>
        <img :src="conversation?.avatar" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">
        {{ conversation?.person }}
      </q-item-label>
      <q-item-label class="conversation__summary" caption>
        <q-icon name="check" v-if="conversation?.sent" />
        <q-icon name="not_interested" />
        {{ conversation?.caption }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-item-label caption>
        {{ conversation?.time }}
      </q-item-label>
      <q-icon name="keyboard_arrow_down" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
const { conversation } = defineProps({
  conversation: Object,
  handleOnSetConversation: () => {},
});
</script>
