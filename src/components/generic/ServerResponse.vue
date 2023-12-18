<template>
  <v-alert
    v-if="serverMessage"
    class="text-align-cener"
    :class="ma4r"
    type="error"
    theme="dark"
  >
    {{ serverMessage }}
  </v-alert>
</template>

<script>
import spacingMixin from '@/mixins/spacingMixin';

export default {
  name: "ServerResponse",
  mixins: [spacingMixin],
  props: {
    serverMessage: { type: String, default: "" },
  },
};
</script>
