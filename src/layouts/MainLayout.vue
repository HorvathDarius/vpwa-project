<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="background-style WAL position-relative" :style="style">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed } from 'vue';

const $q = useQuasar();

defineOptions({
  name: 'MainLayout',
});

const style = computed(() => ({
  height: $q.screen.height + 'px',
}));
</script>

<style lang="sass">
.WAL
  width: 100%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px

  &__layout
    margin: 0 auto
    z-index: 4000
    height: 100%
    width: 90%
    max-width: 950px

.background-style
  background-image: url(/OceanBlue.jpg)
  background-size: cover

.see-through-style
  backdrop-filter: blur(10px)
</style>
