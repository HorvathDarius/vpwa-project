<template>
  <q-layout>
    <q-page-container>
      <q-page class="background-style WAL position-relative">
        <q-layout class="WAL__layout shadow-3 see-through-style" container>
          <router-view />
        </q-layout>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MainLayout',
});
</script>

<style lang="sass">
.WAL
  width: 100vw
  height: 100vh

  &__layout
    margin: 0 auto
    height: 100%

.background-style
  background-image: url(/OceanBlue.jpg)
  background-size: cover

.see-through-style
  backdrop-filter: blur(10px)
  -webkit-backdrop-filter: blur(10px)
</style>
