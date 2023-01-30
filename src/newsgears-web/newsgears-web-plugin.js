import axios from "axios";
import { reactive } from 'vue';

let instance;

export const isError = (error) => instance.isError(error);

export default {
  install: (app, options) => {
    console.log("newsgears-web: install");

    // token refresh 
    function getTokenSilently() {
      return __getToken();
    }

    function __getToken() {
      return new Promise((resolve, reject) => {
        let isTokenExpired = t => {
          return Date.now() >= (JSON.parse(atob(t.split('.')[1]))).exp * 1000;
        }
        if (!app.config.globalProperties.$auth.$isAuthenticated || !app.config.globalProperties.$auth.$token || isTokenExpired(app.config.globalProperties.$auth.$token)) {
          axios
            .get(app.config.globalProperties.$currentUserUrl, {
              withCredentials: true
            })
            .then((response) => {
              if (response.status === 200) {
                setupLoggedInSession(response.data);
                resolve(app.config.globalProperties.$auth.$token);
              } else {
                tearDownLoggedInSession();
                reject();
              }
            }).catch((error) => {
              if (isError(error)) { // test for 401, 403 
                log("*** please re-authenticate ***");
                tearDownLoggedInSession();
              }
              reject(getError(error));
            });
        } else {
          resolve(app.config.globalProperties.$auth.$token);
        }
      });
    }

    // login methods 
    function loginWithSupplied(username, password) {
      return __loginWithSupplied(username, password);
    }

    function __loginWithSupplied(username, password) {
      return new Promise((resolve, reject) => {
        log("newsgears-web: login with supplied password and password");
        axios
          .post(
            app.config.globalProperties.$authUrl, {
            username: username,
            password: password
          }, {
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
          }).catch((error) => {
            tearDownLoggedInSession();
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
            app.config.globalProperties.$pwResetUrl, {
            username: username,
            email: email
          }, {
            withCredentials: true,
          }
          )
          .then((response) => {
            if (response.status === 200) {
              resolve();
            } else {
              reject();
            }
          }).catch((error) => {
            reject(getError(error));
          });
      });
    }
    function pwUpdateWithSupplied(newPassword, newPasswordConfirmed) {
      return new Promise((resolve, reject) => {
        log("newsgears-web: pw update with supplied password and password (confirmed)");
        axios
          .put(
            app.config.globalProperties.$pwUpdateUrl, {
            newPassword: newPassword,
            newPasswordConfirmed: newPasswordConfirmed
          }, {
            withCredentials: true,
          }
          )
          .then((response) => {
            if (response.status === 200) {
              resolve();
            } else {
              reject();
            }
          }).catch((error) => {
            reject(getError(error));
          });
      });
    }
    // registration methods 
    function registerWithSupplied(username, email, password, userType) {
      return new Promise((resolve, reject) => {
        log("registration with supplied username, email, password, and user type");
        axios
          .post(
            app.config.globalProperties.$registrationUrl, {
            username: username,
            email: email,
            password: password,
            userType: userType
          }, {
            withCredentials: true,
          }
          )
          .then((response) => {
            if (response.status === 200) {
              resolve({ username, password });
            } else {
              reject();
            }
          }).catch((error) => {
            reject(getError(error));
          });
      });
    }
    // logout methods 
    function logout() {
      return new Promise((resolve, reject) => {
        axios.get(app.config.globalProperties.$logoutUrl, {
          withCredentials: true,
          headers: {
            "Authorization": `Bearer ${app.config.globalProperties.$auth.$token}`
          }
        }).then(() => {
          log("logout successful");
          resolve();
        }).catch((error) => {
          reject(getError(error));
        }).finally(() => {
          tearDownLoggedInSession();
        })
      });
    }
    // session setup/teardown methods 
    function setupLoggedInSession(data) {
      log("setting up a logged session");
      app.config.globalProperties.$auth.$isAuthenticated = true;
      app.config.globalProperties.$auth.$token = data.authToken;
      app.config.globalProperties.$auth.$user.username = data.username;
      app.config.globalProperties.$auth.$user.hasSubscription = data.hasSubscription;
    }
    function subscribeLoggedInSession() {
      app.config.globalProperties.$auth.$user.hasSubscription = true;
    }
    function unsubscribeLoggedInSession() {
      app.config.globalProperties.$auth.$user.hasSubscription = false;
    }
    function tearDownLoggedInSession() {
      log("tearing down logged session");
      app.config.globalProperties.$auth.$isAuthenticated = false;
      app.config.globalProperties.$auth.$user.username = null;
      app.config.globalProperties.$auth.$user.hasSubscription = null;
    }
    // utility methods 
    function log(msg) {
      console.log("newsgears-web: " + msg);
    }
    function isError(error) {
      return error.response && (error.response.status === 403 || error.response.status === 401);
    }
    function getError(error) { // test for AxiosError 
      let r = error.response;
      if (r && r.data) {
        return r.data.message;
      }
      return "Network error, please try again later.";
    }

    const authObj = reactive({
      'getTokenSilently': getTokenSilently,
      'loginWithSupplied': loginWithSupplied,
      'pwResetWithSupplied': pwResetWithSupplied,
      'pwUpdateWithSupplied': pwUpdateWithSupplied,
      'registerWithSupplied': registerWithSupplied,
      'subscribe': subscribeLoggedInSession,
      'unsubscribe': unsubscribeLoggedInSession,
      'logout': logout,
      'tearDownLoggedInSession': tearDownLoggedInSession,
      'token': null,
      '$isAuthenticated': options.isAuthenticated === true,
      '$user': reactive({}),
    });

    // URLs
    app.config.globalProperties.$currentUserUrl = options.currentUserUrl || "http://localhost:8080/currentuser";
    app.config.globalProperties.$authUrl = options.authUrl || "http://localhost:8080/authenticate";
    app.config.globalProperties.$pwResetUrl = options.pwResetUrl || "http://localhost:8080/pw_reset";
    app.config.globalProperties.$pwUpdateUrl = options.pwUpdateUrl || "http://localhost:8080/pw_update";
    app.config.globalProperties.$registrationUrl = options.registrationUrl || "http://localhost:8080/register";
    app.config.globalProperties.$logoutUrl = options.logoutUrl || "http://localhost:8080/deauthenticate";

    app.config.globalProperties.$auth = authObj;
  }
};
