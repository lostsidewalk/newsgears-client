<template>
  <div class="pa-2">
    <router-link :to="to">
      {{ message }}
    </router-link>
  </div>
</template>

<script>
export default {
  name: "AuthPanelLink",
  props: {
    to: { type: String, required: true },
    message: { type: String, required: true },
  },
};
</script>
