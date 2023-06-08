import { ref, inject, readonly } from 'vue';
import { useI18n } from 'vue-i18n';

export function useAuth() {
  const auth = inject('auth');
  const authServerMessage = ref(null);
  const loginIsLoading = ref(false);
  const { t } = useI18n();

  function logout() {
    auth.logout()
      .catch((error) => {
        console.error("unable to logout due to: " + error);
      }).finally(() => {
        console.log("logout complete");
      });
  }

  function login(loginRequest) {
    let username = loginRequest.username;
    let password = loginRequest.password;
    authServerMessage.value = null;
    if (!username && !password) {
      authServerMessage.value = t("usernameAndPasswordAreRequired");
      return;
    }
    if (!username && password) {
      authServerMessage.value = t("usernameIsRequired");
      return;
    }
    if (username && !password) {
      authServerMessage.value = t("passwordIsRequired");
      return;
    }

    loginIsLoading.value = true;
    auth.loginWithSupplied(username, password, false)
      .then(() => {
        authServerMessage.value = null;
      })
      .catch((error) => {
        authServerMessage.value = error;
        if (!authServerMessage.value) {
          authServerMessage.value = t("somethingHorribleHappened");
        }
      })
      .finally(() => {
        loginIsLoading.value = false;
      });
  }

  const roAuthServerMessage = readonly(authServerMessage);
  const roLoginIsLoading = readonly(loginIsLoading);

  return {
    logout,
    login,
    roAuthServerMessage,
    roLoginIsLoading,
  };
}
