<template>
  <q-layout>
    <q-page-container>
      <q-page class="WAL position-relative">
        <div class="absolute-full bg-gradient"></div>
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

.see-through-style
  background: rgba(255,255,255, 0.05)
  backdrop-filter: blur(50px)
  -webkit-backdrop-filter: blur(50px)
</style>
