import Vue from 'vue';
import VueRouter from 'vue-router';
import FreetsPage from './components/Freet/FreetsPage.vue';
import CommunityPage from './components/Community/CommunityPage.vue';
import EventPage from './components/Event/EventPage.vue';
import OneCommunityPage from './components/Community/OneCommunityPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import ProfilePage from './components/Profile/ProfilePage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: FreetsPage},
  {path: '/community/:communityId', name: 'OneCommunityPage', component: OneCommunityPage},
  {path: '/community', name: 'Community', component: CommunityPage},
  {path: '/event', name: 'Event', component: EventPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/profile/:user', name: 'Profile', component: ProfilePage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }
  }

  next();
});

export default router;
