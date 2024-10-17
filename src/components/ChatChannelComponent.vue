<template>
  <q-item dark clickable v-ripple>
    <q-item-section avatar>
      <q-avatar>
        <img :src="channel?.avatar" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">
        {{ channel?.name }}
      </q-item-label>
      <q-item-label class="conversation__summary" caption>
        {{ channel?.caption }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-item-label caption>
        {{ channel?.time }}
      </q-item-label>
      <q-icon name="keyboard_arrow_down" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
const { channel } = defineProps({
  channel: Object,
});
</script>
