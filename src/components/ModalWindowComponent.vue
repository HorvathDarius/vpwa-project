<template>
  <q-dialog v-model="(showDialog as any) " backdrop-filter="blur(4px)">
    <q-card class="bg-gradient text-white" style="border: 1px solid #777">
      <q-card-section class="row items-center">
        <div class="text-h6">title</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <slot></slot>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
const showDialog = defineModel();

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: 'Title',
  },
});
</script>
