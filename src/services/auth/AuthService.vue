<script>
import axios from "axios";
import { reactive } from "vue";

function useAuthService() {
  const auth = reactive({
    getTokenSilently: __getToken,
    loginWithSupplied: __loginWithSupplied,
    pwResetWithSupplied: pwResetWithSupplied,
    pwUpdateWithSupplied: pwUpdateWithSupplied,
    registerWithSupplied: registerWithSupplied,
    subscribe: subscribeLoggedInSession,
    unsubscribe: unsubscribeLoggedInSession,
    logout: logout,
    tearDownLoggedInSession: tearDownLoggedInSession,
    token: null,
    isAuthenticated: false,
    user: reactive({})
  });

  // URLs
  const currentUserUrl = process.env.VUE_APP_FEEDGEARS_API_URL + "/currentuser";
  const authUrl = process.env.VUE_APP_FEEDGEARS_API_URL + "/authenticate";
  const pwResetUrl = process.env.VUE_APP_FEEDGEARS_API_URL + "/pw_reset";
  const pwUpdateUrl = process.env.VUE_APP_FEEDGEARS_API_URL + "/pw_update";
  const registrationUrl = process.env.VUE_APP_FEEDGEARS_API_URL + "/register";
  const logoutUrl = process.env.VUE_APP_FEEDGEARS_API_URL + "/deauthenticate";

  function log(msg) {
    console.log("newsgears-web: " + msg);
  }

  function isError(error) {
    return (
      error.response &&
      (error.response.status === 403 || error.response.status === 401)
    );
  }

  function getError(error) {
    let r = error.response;
    if (r && r.data) {
      let message = r.data.message;
      if (r.data.details) {
        message = message + ": " + r.data.details;
      }
      return message;
    }
    return "Network error, please try again later.";
  }

  function setupLoggedInSession(data) {
    log("setting up a logged session");
    auth.isAuthenticated = true;
    auth.token = data.authToken;
    auth.user.username = data.username;
    auth.user.hasSubscription = data.hasSubscription;
  }

  function subscribeLoggedInSession() {
    auth.user.hasSubscription = true;
  }

  function unsubscribeLoggedInSession() {
    auth.user.hasSubscription = false;
  }

  function tearDownLoggedInSession() {
    log("tearing down logged session");
    auth.isAuthenticated = false;
    auth.user.username = null;
    auth.user.hasSubscription = null;
  }

  function __getToken() {
    return new Promise((resolve, reject) => {
      let isTokenExpired = (t) => {
        return Date.now() >= JSON.parse(atob(t.split(".")[1])).exp * 1000;
      };
      if (
        !auth.isAuthenticated ||
        !auth.token ||
        isTokenExpired(auth.token)
      ) {
        axios
          .get(currentUserUrl, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.status === 200) {
              setupLoggedInSession(response.data);
              resolve(auth.token);
            } else {
              tearDownLoggedInSession();
              reject();
            }
          })
          .catch((error) => {
            if (isError(error)) {
              // check for 401, 403
              log("*** please re-authenticate ***");
              tearDownLoggedInSession();
            }
            reject(getError(error));
          });
      } else {
        resolve(auth.token);
      }
    });
  }

  // login methods
  function __loginWithSupplied(username, password) {
    return new Promise((resolve, reject) => {
      log("newsgears-web: login with supplied password and password");
      axios
        .post(
          authUrl,
          {
            username: username,
            password: password,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setupLoggedInSession(response.data);
            resolve();
          } else {
            tearDownLoggedInSession();
            reject();
          }
        })
        .catch((error) => {
          if (isError(error)) {
            // check for 401, 403
            log("*** please re-authenticate ***");
            tearDownLoggedInSession();
          }
          reject(getError(error));
        });
    });
  }

  // pw reset methods
  function pwResetWithSupplied(username, email) {
    return new Promise((resolve, reject) => {
      log("newsgears-web: pw reset init with supplied username and email");
      axios
        .post(
          pwResetUrl,
          {
            username: username,
            email: email,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            resolve();
          } else {
            reject();
          }
        })
        .catch((error) => {
          reject(getError(error));
        });
    });
  }
  function pwUpdateWithSupplied(newPassword, newPasswordConfirmed) {
    return new Promise((resolve, reject) => {
      log(
        "newsgears-web: pw update with supplied password and password (confirmed)"
      );
      axios
        .put(
          pwUpdateUrl,
          {
            newPassword: newPassword,
            newPasswordConfirmed: newPasswordConfirmed,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            resolve();
          } else {
            reject();
          }
        })
        .catch((error) => {
          reject(getError(error));
        });
    });
  }
  // registration methods
  function registerWithSupplied(username, email, password, userType) {
    return new Promise((resolve, reject) => {
      log(
        "registration with supplied username, email, password, and user type"
      );
      axios
        .post(
          registrationUrl,
          {
            username: username,
            email: email,
            password: password,
            userType: userType,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            resolve({ username, password });
          } else {
            reject();
          }
        })
        .catch((error) => {
          reject(getError(error));
        });
    });
  }
  // logout methods
  function logout() {
    return new Promise((resolve, reject) => {
      axios
        .get(logoutUrl, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        })
        .then(() => {
          log("logout successful");
          resolve();
        })
        .catch((error) => {
          reject(getError(error));
        })
        .finally(() => {
          tearDownLoggedInSession();
        });
    });
  }

  return auth;
}

export default useAuthService;
</script>
