<template>
  <q-page class="flex flex-center column" container>
    <h1 class="text-weight-regular text-center text-white text-h2 text-h4-xs">
      Login
    </h1>
    <q-form
      @submit="submitHandler"
      class="q-pa-md q-mx-auto q-ma-sm q-ma-md-sm q-ma-lg"
    >
      <!-- Username Field -->
      <q-input
        standout
        bg-color="white"
        style="min-width: 100%"
        input-style="color: black;"
        v-model="email"
        label="Email"
        type="text"
        lazy-rules
        :rules="[(val) => !!val || 'Email is required']"
      />

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
        class="q-mt-md"
      />

      <!-- Submit Button -->
      <q-btn
        padding="0.75rem 2rem"
        size="md"
        label="Login"
        type="submit"
        color="primary"
        class="q-mt-md g-pa-md"
      />

      <p class="text-left full-width text-grey-1 q-mt-md">
        Don't have an account?
        <router-link to="/register" class="text-blue-2">
          Register here
        </router-link>
      </p>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');

function submitHandler() {
  if (email.value && password.value) {
    // Handle form submission
    console.log('Form submitted:', {
      email: email.value,
      password: password.value,
    });
  }
}
</script>

<style scoped lang="sass">

.q-form
  max-width: 400px
  width: 20rem

  @media (max-width: 600px)
    max-width: 100%
    width: 14rem
</style>
