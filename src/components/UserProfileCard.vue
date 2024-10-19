<template>
  <div class="user-menu-container">
    <q-card-section class="q-pt-none">
      <q-input
        standout
        class="q-mt-md text-black"
        bg-color="white"
        style="min-width: 100%"
        input-style="color: black;"
        v-model="user.fullName"
        label="Full Name"
      />
      <q-input
        standout
        class="q-mt-md text-black"
        bg-color="white"
        style="min-width: 100%"
        input-style="color: black;"
        v-model="user.email"
        label="Email"
        type="email"
        @input="console.log('email', user.email)"
      />
      <q-input
        standout
        class="q-mt-md text-black"
        bg-color="white"
        style="min-width: 100%"
        input-style="color: black;"
        v-model="user.username"
        label="Username"
        @input="console.log('username', user.username)"
      />
      <q-select
        standout
        class="q-mt-md text-black"
        bg-color="white"
        style="min-width: 100%"
        input-style="color: black;"
        v-model="user.status"
        :options="statusOptions"
        label="Status"
        @input="console.log('status', user.status)"
      />
      <q-select
        standout
        class="q-mt-md text-black"
        bg-color="white"
        style="min-width: 100%"
        input-style="color: black;"
        v-model="user.notificationSetting"
        :options="notificationOptions"
        label="Notification Setting"
        @input="console.log('notificationSetting', user.notificationSetting)"
      />
    </q-card-section>

    <q-card-section
      ><q-btn color="white" text-color="black" label="Cancel" class="q-mr-md" />
      <q-btn color="primary" label="Save"
    /></q-card-section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from 'src/stores/user-store';

const userStore = useUserStore();

defineProps({
  statusOptions: {
    type: Array,
    required: true,
  },
  notificationOptions: {
    type: Array,
    required: true,
  },
});

// Local state for user data
const user = ref({
  fullName: userStore.currentUserData?.fullName,
  email: userStore.currentUserData?.email,
  username: userStore.currentUserData?.nickName,
  passwordHash: userStore.currentUserData?.passwordHash,
  status: userStore.currentUserData?.status,
  notificationSetting: userStore.currentUserData?.notificationSetting,
});
</script>

<style scoped>
.user-menu-container {
  width: 100%;
  max-width: 24rem;
  padding: 2rem;
  overflow-y: auto; /* Enable vertical scrolling */
}

@media (max-width: 768px) {
  .user-menu-container {
    max-width: 20rem;
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .user-menu-container {
    max-width: 16rem;
    padding: 0.25rem;
  }
}
</style>
