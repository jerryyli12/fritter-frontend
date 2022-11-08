<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <section class="nav-list">
      <img class="nav-item" src="../../public/logo.svg">
      <router-link :class="$route.name === 'Home' ? 'nav-item-bold' : 'nav-item'" to="/">
        Home
      </router-link>
      <router-link :class="$route.name === 'Community' || $route.name === 'OneCommunityPage'  ? 'nav-item-bold' : 'nav-item'" v-if="$store.state.username" to="/community">
        Communities
      </router-link>
      <router-link :class="$route.name === 'Event' ? 'nav-item-bold' : 'nav-item'" v-if="$store.state.username" to="/event">
        Events
      </router-link>
      <router-link :class="$route.name === 'Profile' ? 'nav-item-bold' : 'nav-item'" v-if="$store.state.username" :to="{name: 'Profile', params: {user: $store.state.username}}">
        Profile
      </router-link>
      <router-link
        :class="$route.name === 'Account' ? 'nav-item-bold' : 'nav-item'"
        v-if="$store.state.username"
        to="/account"
      >
        Account
      </router-link>
      <router-link
        :class="$route.name === 'Login' ? 'nav-item-bold' : 'nav-item'"
        v-else
        to="/login"
      >
        Login
      </router-link>
    </section>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
nav {
  /* padding: 1vw 2vw;
  background-color: #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative; */
  top: 0;
  left: 0;
  height: 100%;
  width: 30%;
  position: fixed;
  display: flex;
  justify-content: center;
}

.nav-item {
  margin: 1em 0em 0em 0em;
  font-size: 24px;
}

.nav-item-bold {
  margin: 1em 0em 0em 0em;
  font-size: 24px;
  font-weight: bold;
}

.nav-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}


.title {
    /* font-size: 32px;
    margin: 0 5px; */
}

img {
    /* height: 32px; */
  height: 32px;
}

.left {
	/* display: flex;
	align-items: center; */
}

.right {
    /* font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center; */
}

.right a {
    /* margin-left: 5px; */
}

.alerts {
    /* width: 25%; */
}
</style>
