import { createWebHistory, createRouter } from 'vue-router';
import LandingView from '@/views/LandingView.vue';
import HomeView from '@/views/HomeView.vue';
import PasswordResetRequestView from '@/views/PasswordResetRequestView.vue';
import PasswordResetCallbackView from '@/views/PasswordResetCallbackView.vue';
import RegistrationRequestView from '@/views/RegistrationRequestView.vue';
import TermsAndConditionsView from '@/views/TermsAndConditionsView.vue';
import VerificationCallbackView from '@/views/VerificationCallbackView.vue';
import SettingsView from '@/views/SettingsView.vue';
import CheckoutView from '@/views/CheckoutView.vue';
import OrderConfirmedView from '@/views/OrderConfirmedView.vue';
import ManageSubscriptionView from '@/views/ManageSubscriptionView.vue';

const routes = [
  {
    path: '/',
    name: 'LandingView',
    component: LandingView,
    props: {
      baseUrl: 'http://localhost:8080'
    }
  },
	{
		path: '/app',
		name: 'HomeView',
		component: HomeView,
		props: {
			baseUrl: 'http://localhost:8080'
		}
	},
	{
		path: '/pw_reset',
		name: 'PasswordResetRequestView',
		component: PasswordResetRequestView,
		props: {
			baseUrl: 'http://localhost:8080'
		}
	},
  {
    path: '/pw_reset/continue',
    name: 'PasswordResetCallbackView',
    component: PasswordResetCallbackView, 
    props: {
      baseUrl: 'http://localhost:8080'
    }
  },
	{
		path: '/register',
		name: 'RegistrationRequestView',
		component: RegistrationRequestView,
		props: {
			baseUrl: 'http://localhost:8080'
		}
	},
  {
		path: '/terms',
		name: 'TermsAndConditionsView',
		component: TermsAndConditionsView,
		props: {}
  },
  {
    path: '/verify/continue',
    name: 'VerificationCallbackView',
    component: VerificationCallbackView, 
    props: {
      baseUrl: 'http://localhost:8080'
    }
  },
  {
    path: '/settings',
    name: 'SettingsView',
    component: SettingsView,
    props: {
      baseUrl: 'http://localhost:8080'
    }
  },
  {
    path: '/order-confirmed',
    name: 'OrderConfirmedView',
    component: OrderConfirmedView,
    props: {
      baseUrl: 'http://localhost:8080'
    }
  },
  {
    path: '/stripe',
    name: 'CheckoutView',
    component: CheckoutView,
    props: {
      baseUrl: 'http://localhost:8080'
    }
  },
  {
    path: '/manage-subscription',
    name: 'ManageSubscriptionView',
    component: ManageSubscriptionView,
    props: {
      baseUrl: 'http://localhost:8080'
    }
  }
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
