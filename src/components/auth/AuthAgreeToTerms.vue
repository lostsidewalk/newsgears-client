<template>
  <div class="auth-field">
    <div class="agree-to-terms">
      <input type="checkbox" id="agree-to-terms" v-model="agreeWithTerms" @change="updateAgreement" :disabled="disabled" />
      <label for="agree-to-terms">&nbsp;I agree to the <router-link class="terms-router-link" to="/terms">terms and conditions.</router-link></label>
    </div>
  </div>
</template>

<script>

export default {
  name: "AuthAgreeToTerms",
  props: [ "theme", "disabled" ],
  emits: [ "updateAgreement" ],
  methods: {
    updateAgreement() {
      this.$emit('updateAgreement', {
        agreeWithTerms: this.agreeWithTerms
      })
    }
  },
  data() {
    return {
      agreeWithTerms: false,
    }
  }
};
</script>

<style scoped>
.auth-field > input {
  margin: 4%;
  padding: .31rem;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  width: 20%;
  max-width: 256px;
}

.auth-field > input:hover {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.auth-field > input:focus {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  outline: none;
}

.agree-to-terms {
  padding-left: .75rem;
  padding-right: .75rem;
  color: v-bind('theme.normalmessage');
  padding: .75rem;
  margin: 4%;
}

.agree-to-terms:hover {
  color: v-bind('theme.highlightedmessage');
}

.terms-router-link {
  text-decoration: none; 
  color: inherit;
}

.terms-router-link:hover {
  text-decoration: underline;
}
</style>
