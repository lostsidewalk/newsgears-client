<template>
  <v-btn class="mode-switch-button" 
    @click="switchMode" 
    accesskey="l" 
    :disabled="disabled || inTransit" 
    :title="this.$t('switchMode')"
    :aria-label="this.$t('switchModeAriaLabel')">
    <span class="fa fa-lightbulb-o" /> <!-- use fa-moon-o for dark mode -->
  </v-btn>
</template>

<script>
export default {
  name: "DisplayModeButton",
  props: [ "baseUrl", "disabled", "theme" ],
  emits: [
    "updateServerMessage",
  ],
  watch: {
    '$auth.$isAuthenticated' (isAuthenticated) {
      if (isAuthenticated) {
        this.refreshDisplaySettings(); 
      } else {
        this.$theme.setupDefaultMode();
      }
    }
  },
  methods: {
    // 
    // server error 
    // 
    handleServerError(error) {
      console.error(error);
      if (error.name === 'TypeError') {
        this.setLastServerMessage(this.$t('somethingHorribleHappened'));
      } else if (error.name === 'AbortError') {
        this.setLastServerMessage(this.$t('requestTimedOut'));
      } else if (error.message) {
        this.setLastServerMessage(error.message); 
      } else {
        this.setLastServerMessage(error); // $auth plugin errors 
      }
    },
    setLastServerMessage(message) {
      if (message) {
        this.$emit('updateServerMessage', message);
      }
    },
    // 
    switchMode() {
      this.$theme.switchMode();
      if (this.$auth.$isAuthenticated) {
        this.updateModeSetting();
      }
    },
    refreshDisplaySettings() {

      // this.$web.get("/settings/display")
      // .then((data) => {
      //   let displayConfig = data.displayConfig;
      //   if (displayConfig) {
      //     let themeConfig = data.themeConfig;
      //     this.$theme.setupModes(displayConfig.displayMode, themeConfig);
      //   }
      // });

      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              credentials: 'include', 
              signal: controller.signal
            };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/settings/display", requestOptions)
        .then((response) => {
          // server can return text or JSON object on success or error 
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          if (response.status === 200) {
            return isJson ? response.json() : {};
          } else {
            return isJson ? 
              response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
              response.text().then(t => {throw new Error(t)});
          }
        }).then((data) => {
          let displayConfig = data.displayConfig;
          if (displayConfig) {
            let themeConfig = data.themeConfig;
            this.$theme.setupModes(displayConfig.displayMode, themeConfig);
          }
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.inTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.inTransit = false;
      });
    },
    updateModeSetting() {

      // this.$web.put("/settings/display", JSON.stringify({ 
      //   frameworkConfig: { 
      //     display: { 
      //       displayMode: this.$theme.currentTheme.ident 
      //     } 
      //   } 
      // }));

      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
            method: 'PUT',
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
              frameworkConfig: { 
                display: { 
                  displayMode: this.$theme.currentTheme.ident 
                } 
              } 
            }),
            credentials: 'include',
            signal: controller.signal
          };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/settings", requestOptions).then((response) => {
          if (response.status === 200) {
            return;
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ? 
              response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
              response.text().then(t => {throw new Error(t)});
          }
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.inTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.inTransit = false;
      });
    }
  },
  data() {
    return {
      // 
      inTransit: false,
    }
  }
}
</script>

<style scoped>
.mode-switch-button {
  max-width: 256px;
  min-height: 3rem;
  padding: .75rem 1rem;
  font-weight: bold;
}
</style>
