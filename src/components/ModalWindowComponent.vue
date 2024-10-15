<template>
  <q-dialog v-model="showDialog as any">
    <slot></slot>
  </q-dialog>
</template>

<script setup lang="ts">
const showDialog = defineModel();
</script>
