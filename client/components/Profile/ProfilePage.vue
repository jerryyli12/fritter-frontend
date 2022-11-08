<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username && user">
      <header>
        <h2>@{{user}}</h2>
        <p>
          Joined: {{dateJoined}}
        </p>
      </header>
      <div id="leftButtons" v-if="$store.state.viewingLeft">
        <button id="left" @click="showCreated">
          Freets
        </button>
        <button id="right" @click="showLiked">
          Liked Freets
        </button>
      </div>
      <div id="rightButtons" v-else>
        <button id="left" @click="showCreated">
          Freets
        </button>
        <button id="right" @click="showLiked">
          Liked Freets
        </button>
      </div>
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
    <section v-else-if="$store.state.username">
      <h2>
        This user does not exist.
      </h2>
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
      dateJoined: null,
    };
  },
  async beforeCreate() {
    const user = this.$route.params.user;
    const userInfo = await fetch(`/api/users/${user}`);
    if (userInfo.ok) {
      this.$store.commit('updateViewing', true);
      this.$store.commit('updateFilter', `/api/freets?author=${user}`);
      this.$store.commit('refreshFreets');
      this.user = user;
      const res = await userInfo.json();
      this.dateJoined = res.dateJoined;
    }
    else
      this.user = null;
  },
  watch: {
    async '$route.params.user'(to, from) {
      const user = to;
      const userInfo = await fetch(`/api/users/${user}`);
      if (userInfo.ok) {
        this.$store.commit('updateViewing', true);
        this.$store.commit('updateFilter', `/api/freets?author=${user}`);
        this.$store.commit('refreshFreets');
        this.user = user;
        const res = await userInfo.json();
        this.dateJoined = res.dateJoined;
      }
      else
        this.user = null;
    }
  },
  methods: {
    async showCreated() {
      this.$store.commit('updateViewing', true);
      this.$store.commit('updateFilter', `/api/freets?author=${this.user}`);
      this.$store.commit('refreshFreets');
    },
    async showLiked() {
      this.$store.commit('updateViewing', false);
      this.$store.commit('updateFilter', `/api/likes?user=${this.user}`);
      this.$store.commit('refreshFreets');
    }
  }
};
</script>

<style scoped>
/* section {
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
} */

header > p {
  margin-left: 0.75em;
  color: #555;
  margin-top: 0;
}

#leftButtons {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

#leftButtons > button {
  width: 100%;
  font-size: 20px;
  border-width: 0;
  background-color: #fff;
  border-bottom: 1px solid #555;
}

#leftButtons > #left {
  border-bottom: 4px solid #2db3ff;
}

#leftButtons > button:hover {
  background-color: #eee;
}

#rightButtons {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

#rightButtons > button {
  width: 100%;
  font-size: 20px;
  border-width: 0;
  background-color: #fff;
  border-bottom: 1px solid #555;
}

#rightButtons > #right {
  border-bottom: 4px solid #2db3ff;
}

#rightButtons > button:hover {
  background-color: #eee;
}

h2 {
  margin-bottom: 0.25em;
}

h3 {
  margin-left: 0.75em;
}

</style>
