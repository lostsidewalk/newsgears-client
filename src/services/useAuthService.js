import { ref, reactive } from "vue";
import axios from "axios";

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
    user: reactive({
      username: null,
      hasSubscription: false,
    })
  });
  const isAuthenticated = ref(false);

  // URLs; append '/api' to the base URL if the reverse proxy is enabled 
  const baseUrl = (process.env.VUE_APP_NEWSGEARS_REVERSE_PROXY === "true")
    ? process.env.VUE_APP_NEWSGEARS_API_URL + '/api'
    : process.env.VUE_APP_NEWSGEARS_API_URL;
  const currentUserUrl = baseUrl + "/currentuser";
  const authUrl = baseUrl + "/authenticate";
  const pwResetUrl = baseUrl + "/pw_reset";
  const pwUpdateUrl = baseUrl + "/pw_update";
  const registrationUrl = baseUrl + "/register";
  const logoutUrl = baseUrl + "/deauthenticate";

  function log(msg) {
    console.log("auth-service: " + msg);
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
    return error.message;
  }

  function setupLoggedInSession(data) {
    log("setting up a logged session");
    isAuthenticated.value = true;
    if (data) {
      auth.token = data.authToken;
      auth.user.username = data.username;
      auth.user.hasSubscription = data.hasSubscription;
    }
  }

  function subscribeLoggedInSession() {
    auth.user.hasSubscription = true;
  }

  function unsubscribeLoggedInSession() {
    auth.user.hasSubscription = false;
  }

  function tearDownLoggedInSession() {
    log("tearing down logged session");
    isAuthenticated.value = false;
    auth.user.username = null;
    auth.user.hasSubscription = false;
  }

  function __getToken() {
    return new Promise((resolve, reject) => {
      let isTokenExpired = (t) => {
        return Date.now() >= JSON.parse(atob(t.split(".")[1])).exp * 1000;
      };
      if (
        !isAuthenticated.value ||
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
            }
            tearDownLoggedInSession();
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

  return {
    auth,
    isAuthenticated, 
  }
}

export default useAuthService;
