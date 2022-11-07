<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>@{{user}}</h2>
        <p>
          Joined: {{dateJoined}}
        </p>
      </header>
      <button @click="showCreated">
        Freets
      </button>
      <button @click="showLiked">
        Liked Freets
      </button>
      <section
        v-if="$store.state.freets.length"
      >
        <FreetComponent
          v-for="freet in $store.state.freets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article
        v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';

export default {
  name: 'ProfilePage',
  components: {FreetComponent},
  data() {
    return {
      user: null,
      dateJoined: null
    };
  },
  async beforeCreate() {
    const user = this.$route.params.user;
    const userInfo = await fetch(`/api/users/${user}`);
    if (userInfo.ok) {
      // this.createdFreets = await (await fetch(`/api/freets?author=${user}`)).json();
      // this.likedFreets = await (await fetch(`/api/likes?user=${user}`)).json();
      this.$store.commit('updateFilter', `/api/freets?author=${user}`);
      this.$store.commit('refreshFreets');
      this.user = user;
      const res = await userInfo.json();
      this.dateJoined = res.dateJoined;
    }
  },
  methods: {
    async showCreated() {
      this.$store.commit('updateFilter', `/api/freets?author=${this.user}`);
      this.$store.commit('refreshFreets');
    },
    async showLiked() {
      this.$store.commit('updateFilter', `/api/likes?user=${this.user}`);
      this.$store.commit('refreshFreets');
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
