<template>
  <q-header elevated class="transparent see-trhrough-style">
    <q-toolbar class="text-black">
      <q-btn round flat icon="keyboard_arrow_left" />

      <q-btn round flat>
        <q-avatar>
          <img :src="currentConversation.avatar" />
        </q-avatar>
      </q-btn>

      <span class="q-subtitle-1 q-pl-md text-white text-bold">
        {{ currentConversation.person }}
      </span>

      <q-space />

      <q-btn round flat icon="more_vert">
        <q-menu auto-close :offset="[110, 0]">
          <q-list style="min-width: 150px">
            <q-item clickable>
              <q-item-section></q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script setup>
const { currentConversation } = defineProps({
  currentConversation: Object,
});

</script>
