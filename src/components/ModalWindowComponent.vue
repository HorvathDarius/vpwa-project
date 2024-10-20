<template>
  <q-dialog v-model="(showDialog as any) " backdrop-filter="blur(4px)">
    <q-card class="bg-gradient text-white">
      <q-card-section class="row items-center full-width">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <slot></slot>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
const showDialog = defineModel();

const { title } = defineProps({
  title: {
    type: String,
    required: false,
    default: 'Modal',
  },
});
</script>

<style scoped>
.q-card {
  border: 1px solid #777;
  @media screen and (min-width: 600px) {
    width: 90%;
    max-width: 600px;
  }
}
</style>
