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

  &__layout
    margin: 0 auto
    height: 100%

.background-style
  background-image: url(/image.webp)
  background-size: cover

.see-through-style
  background: rgba(255,255,255, 0.05)
  backdrop-filter: blur(50px)
  -webkit-backdrop-filter: blur(50px)

.bg-gradient
  background: linear-gradient(90deg, rgba(2,2,14,1) 0%, rgba(1,6,20,1) 100%)
</style>
