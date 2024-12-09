<template>
  <div class="">
    <h1 class="text-weight-regular text-center text-white text-h3 text-h5-xs">
      {{ heading }}
    </h1>
    <q-form @submit="submitHandler" class="q-pa-md q-mx-auto q-ma-sm q-ma-lg">
      <p class="text-white text-h6">Personal Information</p>

      <!-- Name Field -->
      <q-input
        v-if="isRegister"
        standout
        class="q-mt-md"
        bg-color="white"
        style="min-width: 100%"
        input-style="color: black;"
        v-model="fullName"
        label="Full Name"
        type="text"
        lazy-rules
        :rules="[(val) => !!val || 'Username is required']"
      />

      <!-- Email Field -->
      <q-input
        standout
        class="q-mt-md"
        bg-color="white"
        style="min-width: 100%"
        input-style="color: black;"
        v-model="email"
        label="Email"
        type="email"
        lazy-rules
        :rules="[(val) => !!val || 'Email is required']"
      />

      <!-- Username Field -->
      <q-input
        v-if="isRegister"
        standout
        class="q-mt-md"
        bg-color="white"
        style="min-width: 100%"
        input-style="color: black;"
        v-model="username"
        label="Username"
        type="text"
        lazy-rules
        :rules="[(val) => !!val || 'Username is required']"
      />

      <p class="text-white text-h6 q-mt-md">Password</p>
      <!-- Password Field -->
      <q-input
        standout
        bg-color="white"
        style="min-width: 100%"
        input-style="color: black;"
        v-model="password"
        label="Password"
        type="password"
        lazy-rules
        :rules="[(val) => !!val || 'Password is required']"
        class="q-mt-lg"
      />

      <!-- Password Repeat Field -->
      <q-input
        v-if="isRegister"
        standout
        bg-color="white"
        style="min-width: 100%"
        input-style="color: black;"
        v-model="passwordRepeat"
        label="Repeat Password"
        type="password"
        lazy-rules
        :rules="[
          (val) => !!val || 'Password is required',
          (val) => val === password || 'Passwords must match',
        ]"
        class="q-mt-md"
      />

      <!-- Submit Button -->
      <q-btn
        padding="0.75rem 2rem"
        size="md"
        :label="ctaLabel"
        type="submit"
        color="primary"
        class="q-mt-md g-pa-md"
      />

      <div v-if="!isRegister && failLogin" class="text-red-5 q-mt-sm">
        Incorrect credentials!
      </div>

      <div class="full-width q-pb-md">
        <p v-if="!isRegister" class="text-left text-grey-1 q-mt-md">
          Don't have an account?
          <router-link to="/auth/register" class="text-blue-2">
            Register here
          </router-link>
        </p>

        <p v-else class="text-left text-grey-1 q-mt-md">
          Already have an account?
          <router-link to="/auth/login" class="text-blue-2">
            Login here
          </router-link>
        </p>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/user-store';
import { LoginCredentials, RegisterData } from 'src/contracts';

const userStore = useUserStore();

const props = defineProps({
  heading: {
    type: String,
    required: false,
    default: 'Login',
  },
  ctaLabel: {
    type: String,
    required: false,
    default: 'Login',
  },
  isRegister: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const router = useRouter();
const failLogin = ref(false);

const email = ref('');
const fullName = ref('');
const username = ref('');
const password = ref('');
const passwordRepeat = ref('');

// Function to submit form
const submitHandler = (): void => {
  // Check if registering
  if (props.isRegister === true) {
    const credentials: RegisterData = {
      email: email.value,
      fullName: fullName.value,
      nickName: username.value,
      password: password.value,
      passwordConfirmation: password.value,
    };

    userStore.register(credentials).then(() => router.push('/'));
    return;
  }

  // If login, perform login action
  const credentials: LoginCredentials = {
    email: email.value,
    password: password.value,
    remember: true,
  };
  // userStore.login(email.value, password.value);
  userStore.login(credentials).then(() => router.push('/'));
  return;
};
</script>

<style scoped lang="sass">

.q-form
  max-width: 400px
  width: 20rem

  @media (max-width: 600px)
    max-width: 100%
    width: 15rem
</style>
