import { createWebHistory, createRouter } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import PasswordResetRequestView from "@/views/PasswordResetRequestView.vue";
import PasswordResetCallbackView from "@/views/PasswordResetCallbackView.vue";
import RegistrationRequestView from "@/views/RegistrationRequestView.vue";
import VerificationCallbackView from "@/views/VerificationCallbackView.vue";
import DocsView from "@/views/DocsView.vue";

const routes = [
  // login route 
  {
    path: "/login",
    name: "LoginView",
    component: LoginView,
    props: {
      baseUrl: process.env.VUE_APP_NEWSGEARS_API_URL,
    },
  },
  // application route 
  {
    path: "/",
    name: "HomeView",
    title: "Newsgears RSS",
    component: HomeView,
    props: {
      baseUrl: process.env.VUE_APP_NEWSGEARS_API_URL,
      feedUrl: process.env.VUE_APP_NEWSGEARS_FEED_URL,
    },
  },
  // catch-all route (back to application) 
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
  {
    path: "/pw_reset",
    name: "PasswordResetRequestView",
    component: PasswordResetRequestView,
    props: {
      baseUrl: process.env.VUE_APP_NEWSGEARS_API_URL,
    },
  },
  // password reset continuation 
  {
    path: "/pw_reset/continue",
    name: "PasswordResetCallbackView",
    component: PasswordResetCallbackView,
    props: {
      baseUrl: process.env.VUE_APP_NEWSGEARS_API_URL,
    },
  },
  // registration initialization 
  {
    path: "/register",
    name: "RegistrationRequestView",
    component: RegistrationRequestView,
    props: {
      baseUrl: process.env.VUE_APP_NEWSGEARS_API_URL,
    },
  },
  // verification continuation 
  {
    path: "/verify/continue",
    name: "VerificationCallbackView",
    component: VerificationCallbackView,
    props: {
      baseUrl: process.env.VUE_APP_NEWSGEARS_API_URL,
    },
  },
  // documentation 
  {
    path: "/docs",
    name: "DocsView",
    component: DocsView,
    props: {
      baseUrl: process.env.VUE_APP_NEWSGEARS_API_URL,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const defaultRouteTitle = "Newsgears RSS";

const titlesByRoute = {
  LoginView: "Newsgears RSS from LostSidewalk Software",
  HomeView: "Newsgears RSS Feed Dashboard",
  PasswordResetRequestView: "Newsgears RSS Password Reset Request",
  PasswordResetCallbackView: "Newsgears RSS Password Reset Continuation",
  RegistrationRequestView: "Newsgears RSS User Registration",
  VerificationCallbackView: "Newsgears RSS Email Verification Continuation",
  SettingsView: "Newsgears RSS User Settings",
};

router.beforeEach((to, from, next) => {
  let t = titlesByRoute[to.name];
  document.title = t ? t : defaultRouteTitle;
  next();
});

export default router;
