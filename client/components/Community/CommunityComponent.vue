<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="community"
  >
    <div id="left">
      <header>
        <h3>
          <!-- <router-link v-if="community.inCommunity" :to="`/community/${community._id}`">
            {{ community.name }}
          </router-link>
          <span v-else>
            {{ community.name }}
          </span> -->
          {{community.name}}
        </h3>
      </header>
      <p>{{community.members}} members</p>
    </div>
    <div id="right">
      <button v-if="community.inCommunity" @click="viewCommunity">
        View
      </button>
      <button v-if="community.inCommunity" @click="toggleMembership">
        Leave
      </button>
      <button v-else @click="toggleMembership">
        Join
      </button>
    </div>
  </article>
</template>

<script>
export default {
  name: 'CommunityComponent',
  props: {
    // Data from the stored freet
    community: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    };
  },
  methods: {
    async toggleMembership() {
      const r = await fetch(`/api/communities/user/${this.community._id}`, {method: 'PUT'});
      this.$store.commit('refreshCommunities');
    },
    viewCommunity() {
      this.$router.push(`/community/${this.community._id}`);
    }
  }
};
</script>

<style scoped>
/* .community {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
} */

.community {
  padding: 0.75em;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}

#right {
  display: flex;
  gap: 0.5em;
  align-items: center;
}

#right > button {
  height: 36px;
  width: 100px;
  border-radius: 18px;
  border-width: 0;
  color: white;
  background-color: #2db3ff;
  font-size: 14px;
  font-weight: bold;
}

#right > button:hover {
  background-color: #0d93df;
}

header > h3 {
  margin: 0;
}

p {
  margin: 0;
}

</style>
