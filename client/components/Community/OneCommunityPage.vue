<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username && community">
      <header>
        <h2>{{community.name}}</h2>
        <button @click="leaveCommunity">Leave</button>
      </header>
      <CreateCommunityFreetForm :communityId="community._id"/>
      <header>
        <!-- <div class="left">
          <h2>
            Viewing all freets in {{community.name}}
          </h2>
        </div> -->
      </header>
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
      <header>
        <h2>You are not a member of this community</h2>
      </header>
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
import CreateCommunityFreetForm from '@/components/Freet/CreateCommunityFreetForm.vue';

export default {
  name: 'OneCommunityPage',
  components: {FreetComponent, CreateCommunityFreetForm},
  data() {
    return {
      community: null,
    };
  },
  async beforeCreate() {
    if (this.$store.state.username) {
      const community = this.$route.params.communityId;
      const communityInfo = await fetch(`/api/communities/view/${community}`)
      if (communityInfo.ok) {
        this.$store.commit('updateFilter', `/api/communities/view/${community}`);
        this.$store.commit('refreshFreets');
        const res = await communityInfo.json();
        this.community = res;
      }
    }
  },
  watch: {
    async '$route.params.communityId'(to, from) {
      if (this.$store.state.username) {
        const community = to;
        const communityInfo = await fetch(`/api/communities/view/${community}`)
        if (communityInfo.ok) {
          this.$store.commit('updateFilter', `/api/communities/view/${community}`);
          this.$store.commit('refreshFreets');
          const res = await communityInfo.json();
          this.community = res;
        }
        else {
          this.community = null;
        }
      }
    }
  },
  methods: {
    async leaveCommunity() {
      const r = await fetch(`/api/communities/user/${this.community._id}`, {method: 'PUT'});
      this.$store.commit('refreshCommunities');
      this.$router.push({name: 'Community'});
    },
    // async joinCommunity(){ 
    //   const community = this.$route.params.communityId;
    //   const r = await fetch(`/api/communities/user/${community}`, {method: 'PUT'});
    //   this.$store.commit('refreshCommunities');
    //   this.$forceUpdate();
    // }
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

h3 {
  margin-left: 0.75em; 
}
</style>
