<template>
  <q-footer class="transparent see-trhrough-style">
    <q-toolbar class="text-white row">
      <q-input
        rounded
        outlined
        dense
        class="col-grow q-mr-sm text-white"
        v-model="messageData"
        placeholder="Type a message"
      />
    </q-toolbar>
  </q-footer>
</template>

<script setup>
import { ref } from 'vue';

const { message } = defineProps(['message']);
const messageData = ref(message);
</script>
