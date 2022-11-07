<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <section>
        <header>
          <h2>Communities</h2>
          <button>Create</button>
        </header>
        <button>Joined Communities</button>
        <button>All Communities</button>
      </section>

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
  name: 'CommunityPage',
  components: {FreetComponent},
  data() {
  },
  
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
