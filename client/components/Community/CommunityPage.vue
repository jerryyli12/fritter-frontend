<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <section>
        <header>
          <h2>Communities</h2>
          <button @click="toggleCreating">Create</button>
        </header>
        <CreateCommunityForm v-if="creating"/>
        <div id="leftButtons" v-if="$store.state.viewingLeft">
          <button id="left" @click="showJoined">
            Joined Communities
          </button>
          <button id="right" @click="showAll">
            All Communities
          </button>
        </div>
        <div id="rightButtons" v-else>
          <button id="left" @click="showJoined">
            Joined Communities
          </button>
          <button id="right" @click="showAll">
            All Communities
          </button>
        </div>
      </section>
      <section
        v-if="$store.state.communities.length"
      >
        <CommunityComponent
          v-for="community in $store.state.communities"
          :key="community.id"
          :community="community"
        />
      </section>
      <article
        v-else
      >
        <h3>No communities to display. Try joining or creating a community.</h3>
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
import CommunityComponent from '@/components/Community/CommunityComponent.vue';
import CreateCommunityForm from '@/components/Community/CreateCommunityForm.vue';

export default {
  name: 'CommunityPage',
  components: {CreateCommunityForm, CommunityComponent},
  data() {
    return {
      creating: false,
    }
  },
  beforeCreate() {
    if (this.$store.state.username) {
      this.$store.commit('updateViewing', true);
      this.$store.commit('updateCommunityFilter', `/api/communities/user`);
      this.$store.commit('refreshCommunities');
    }
  },
  methods: {
    toggleCreating() {
      this.creating = !this.creating;
    },
    showJoined() {
      this.$store.commit('updateViewing', true);
      this.$store.commit('updateCommunityFilter', `/api/communities/user`);
      this.$store.commit('refreshCommunities');
    },
    showAll() {
      this.$store.commit('updateViewing', false);
      this.$store.commit('updateCommunityFilter', null);
      this.$store.commit('refreshCommunities');
    },
  }
};
</script>

<style scoped>
header > button {
  top: 0;
  right: 0;
  position: absolute;
  margin-top: 1em;
  margin-right: 0.75em;
  font-size: 16px;
  height: 36px;
  width: 100px;
  border-radius: 18px;
  border-width: 0;
  background-color: black;
  color: white;
  font-weight: bold;
}

header > button:hover {
  background-color: #333;
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

h3 {
  margin-left: 0.75em; 
}
</style>
