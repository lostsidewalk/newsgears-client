import { createWebHistory, createRouter } from 'vue-router';
import LandingView from '@/views/LandingView.vue';
import HomeView from '@/views/HomeView.vue';
import PasswordResetRequestView from '@/views/PasswordResetRequestView.vue';
import PasswordResetCallbackView from '@/views/PasswordResetCallbackView.vue';
import RegistrationRequestView from '@/views/RegistrationRequestView.vue';
import VerificationCallbackView from '@/views/VerificationCallbackView.vue';
import SettingsView from '@/views/SettingsView.vue';
import OrderConfirmedView from '@/views/OrderConfirmedView.vue';
import ManageSubscriptionView from '@/views/ManageSubscriptionView.vue';
import DocsView from '@/views/DocsView.vue';
import ApiView from '@/views/ApiView.vue';
import PrivacyPolicyView from '@/views/PrivacyPolicyView.vue';

const routes = [
  {
    path: '/',
    name: 'LandingView',
    component: LandingView,
    props: {
      baseUrl: process.env.VUE_APP_FEEDGEARS_API_URL
    }
  },
	{
		path: '/app',
		name: 'HomeView',
    title: 'FeedGears RSS',
		component: HomeView,
		props: {
			baseUrl: process.env.VUE_APP_FEEDGEARS_API_URL
		}
	},
	{
		path: '/pw_reset',
		name: 'PasswordResetRequestView',
		component: PasswordResetRequestView,
		props: {
			baseUrl: process.env.VUE_APP_FEEDGEARS_API_URL
		}
	},
  {
    path: '/pw_reset/continue',
    name: 'PasswordResetCallbackView',
    component: PasswordResetCallbackView, 
    props: {
      baseUrl: process.env.VUE_APP_FEEDGEARS_API_URL
    }
  },
	{
		path: '/register',
		name: 'RegistrationRequestView',
		component: RegistrationRequestView,
		props: {
			baseUrl: process.env.VUE_APP_FEEDGEARS_API_URL
		}
	},
  {
    path: '/verify/continue',
    name: 'VerificationCallbackView',
    component: VerificationCallbackView, 
    props: {
      baseUrl: process.env.VUE_APP_FEEDGEARS_API_URL
    }
  },
  {
    path: '/settings',
    name: 'SettingsView',
    component: SettingsView,
    props: {
      baseUrl: process.env.VUE_APP_FEEDGEARS_API_URL
    }
  },
  {
    path: '/order-confirmed',
    name: 'OrderConfirmedView',
    component: OrderConfirmedView,
    props: {
      baseUrl: process.env.VUE_APP_FEEDGEARS_API_URL
    }
  },
  {
    path: '/manage-subscription',
    name: 'ManageSubscriptionView',
    component: ManageSubscriptionView,
    props: {
      baseUrl: process.env.VUE_APP_FEEDGEARS_API_URL
    }
  },
  {
    path: '/docs',
    name: 'DocsView',
    component: DocsView,
    props: {
      baseUrl: process.env.VUE_APP_FEEDGEARS_API_URL
    }
  },
  {
    path: '/api',
    name: 'ApiView',
    component: ApiView,
    props: {
      baseUrl: process.env.VUE_APP_FEEDGEARS_API_URL
    }
  },
  {
    path: '/privacy',
    name: 'PrivacyPolicyView',
    component: PrivacyPolicyView,
    props: {
      baseUrl: process.env.VUE_APP_FEEDGEARS_API_URL
    }
  },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

const defaultRouteTitle = 'FeedGears RSS';

const titlesByRoute = {
  'LandingView': 'FeedGears RSS from LostSidewalk Software',
  'HomeView': 'FeedGears RSS Feed Dashboard',
  'PasswordResetRequestView': 'FeedGears RSS Password Reset Request',
  'PasswordResetCallbackView': 'FeedGears RSS Password Reset Continuation',
  'RegistrationRequestView': 'FeedGears RSS User Registration',
  'VerificationCallbackView': 'FeedGears RSS Email Verification Continuation',
  'SettingsView': 'FeedGears RSS User Settings, Notifications, and Checkout',
  'OrderConfirmedView': 'FeedGears RSS Order Confirmation', 
  'ManageSubscriptionView': 'FeedGears RSS Subscription Management',
}

router.beforeEach((to, from, next) => {
  let t = titlesByRoute[to.name];
  document.title = t ? t : defaultRouteTitle;
  next();
});

export default router;
