<template>
  <div class="user-menu-container">
    <q-form @submit="onSubmit">
      <q-card-section class="q-pt-none">
        <q-input
          standout
          disable
          class="q-mt-md text-black"
          bg-color="grey"
          style="min-width: 100%"
          input-style="color: black;"
          v-model="user.fullName"
          label="Full Name"
        />
        <q-input
          standout
          disable
          class="q-mt-md text-black"
          bg-color="grey"
          style="min-width: 100%"
          input-style="color: black;"
          v-model="user.email"
          label="Email"
          type="email"
        />
        <q-input
          standout
          disable
          class="q-mt-md text-black"
          bg-color="grey"
          style="min-width: 100%"
          input-style="color: black;"
          v-model="user.nickName"
          label="Username"
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
        />
      </q-card-section>

      <q-card-section>
        <q-btn
          color="white"
          text-color="black"
          label="Cancel"
          class="q-mr-md"
          v-close-popup
        />
        <q-btn color="primary" label="Save" type="submit" v-close-popup />
      </q-card-section>

      <q-card-section
        ><q-btn
          style="background-color: rgba(255, 0, 0, 0.7)"
          label="Log out"
          @click="handleLogout"
        ></q-btn
      ></q-card-section>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/user-store';
import { UpdateStatus } from 'src/contracts';

const userStore = useUserStore();
const router = useRouter();

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
  fullName: userStore.authInfo.user!.fullName,
  email: userStore.authInfo.user!.email,
  nickName: userStore.authInfo.user!.nickName,
  status: userStore.authInfo.user!.status,
  notificationSetting: userStore.authInfo.user!.notificationSetting,
});

const onSubmit = async () => {
  await userStore.updateUserSettings({
    status: user.value.status,
    notificationSetting: user.value.notificationSetting,
  } as UpdateStatus);

  //console.log('User status', user.value.status);
};

const handleLogout = () => {
  userStore.logout();
  router.push('/auth/login');
};
</script>

<style scoped>
.user-menu-container {
  width: 100%;
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
