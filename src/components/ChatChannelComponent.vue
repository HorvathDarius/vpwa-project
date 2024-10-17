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
        <q-icon v-if="channel?.private" name="lock_person" class="q-ml-xs" />
      </q-item-label>
      <q-item-label class="conversation__summary" caption>
        {{ channel?.caption }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-btn round icon="more_vert" flat dense />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
const { channel } = defineProps({
  channel: Object,
});
</script>
