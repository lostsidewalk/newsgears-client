import { createWebHistory, createRouter } from "vue-router";
import LandingView from "@/views/LandingView.vue";
import HomeView from "@/views/HomeView.vue";
import PasswordResetRequestView from "@/views/PasswordResetRequestView.vue";
import PasswordResetCallbackView from "@/views/PasswordResetCallbackView.vue";
import RegistrationRequestView from "@/views/RegistrationRequestView.vue";
import VerificationCallbackView from "@/views/VerificationCallbackView.vue";
import DocsView from "@/views/DocsView.vue";
import ApiView from "@/views/ApiView.vue";

const routes = [
  {
    path: "/",
    name: "LandingView",
    component: LandingView,
    props: {
      baseUrl: process.env.VUE_APP_NEWSGEARS_API_URL,
    },
  },
  {
    path: "/app",
    name: "HomeView",
    title: "Newsgears RSS",
    component: HomeView,
    props: {
      baseUrl: process.env.VUE_APP_NEWSGEARS_API_URL,
      feedUrl: process.env.VUE_APP_NEWSGEARS_FEED_URL,
    },
  },
  {
    path: "/pw_reset",
    name: "PasswordResetRequestView",
    component: PasswordResetRequestView,
    props: {
      baseUrl: process.env.VUE_APP_NEWSGEARS_API_URL,
    },
  },
  {
    path: "/pw_reset/continue",
    name: "PasswordResetCallbackView",
    component: PasswordResetCallbackView,
    props: {
      baseUrl: process.env.VUE_APP_NEWSGEARS_API_URL,
    },
  },
  {
    path: "/register",
    name: "RegistrationRequestView",
    component: RegistrationRequestView,
    props: {
      baseUrl: process.env.VUE_APP_NEWSGEARS_API_URL,
    },
  },
  {
    path: "/verify/continue",
    name: "VerificationCallbackView",
    component: VerificationCallbackView,
    props: {
      baseUrl: process.env.VUE_APP_NEWSGEARS_API_URL,
    },
  },
  {
    path: "/docs",
    name: "DocsView",
    component: DocsView,
    props: {
      baseUrl: process.env.VUE_APP_NEWSGEARS_API_URL,
    },
  },
  {
    path: "/api",
    name: "ApiView",
    component: ApiView,
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
  LandingView: "Newsgears RSS from LostSidewalk Software",
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
