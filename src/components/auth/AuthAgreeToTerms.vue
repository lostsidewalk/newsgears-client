<template>
  <div class="auth-field">
    <div class="agree-to-terms">
      <input type="checkbox" id="agree-to-terms" v-model="agreeWithTerms" @change="updateAgreement" />
      <label for="agree-to-terms">&nbsp;I agree to the <router-link class="terms-router-link" to="/terms">terms and conditions.</router-link></label>
    </div>
  </div>
</template>

<script>

export default {
  name: "AuthAgreeToTerms",
  props: [ "inTransit", "theme" ],
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
  padding: 5px;
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
  padding-left: 10px;
  padding-right: 10px;
  color: v-bind('theme.normalmessage');
  padding: 10px;
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
