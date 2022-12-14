<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <div id="left">
      <header>
        <h3 class="author">
          <router-link :to="{name: 'Profile', params: {user: freet.author}}">
            @{{ freet.author }}
          </router-link>
        </h3>
        <p class="info">
          Posted at {{ freet.dateModified }}
          <i v-if="freet.edited">(edited)</i>
        </p>
        <div
          v-if="$store.state.username === freet.author"
          class="actions"
        >
          <button
            v-if="editing"
            @click="submitEdit"
          >
            ✅ Save changes
          </button>
          <button
            v-if="editing"
            @click="stopEditing"
          >
            🚫 Discard changes
          </button>
          <button
            v-if="!editing"
            @click="startEditing"
          >
            ✏️ Edit
          </button>
          <button @click="deleteFreet">
            🗑️ Delete
          </button>
        </div>
      </header>
      <textarea
        v-if="editing"
        class="content"
        :value="draft"
        @input="draft = $event.target.value"
      />
      <p
        v-else
        class="content"
      >
        <span v-if="!freet.blur || viewable">
          {{ freet.content }}
        </span>
        <span v-else>
          The following Freet contains potentially controversial content.
          <button @click="viewControversial">
            View anyway
          </button>
          <button @click="userSettings">
            Change user settings
          </button>
        </span>
      </p>
    </div>
    <div id="right">
      <button @click="toggleLikeFreet">
        <span v-if="freet.iLiked">❤️ {{ freet.likes }}</span>
        <span v-else> 🤍 {{ freet.likes }}</span>
      </button>
      <button @click="toggleControversialFreet">
        <span v-if="freet.iControversialed">⚠️</span>
        <span v-else>⚠</span>
      </button>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      viewable: false,
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async toggleLikeFreet() {
      const r = await fetch(`/api/likes/${this.freet._id}`, {method: 'PUT'});
      // this.freet = (await r.json()).freet;
      this.$store.commit('refreshFreets');
    },
    async toggleControversialFreet() {
      const r = await fetch(`/api/controversials/${this.freet._id}`, {method: 'PUT'});
      // this.freet = (await r.json()).freet;
      this.$store.commit('refreshFreets');
    },
    viewControversial() {
      this.viewable = true;
    },
    userSettings() {
      this.$router.push('Account');
    }
  }
};
</script>

<style scoped>
/* .freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
} */
.freet {
  padding: 0.75em;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}

.author {
  margin: 0;
}

.content {
  margin-top: 0.75em;
  margin-bottom: 0em;
}

.info {
  margin: 0;
  font-size: 12px;
  color: #555;
}

#right {
  width: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: .5em;
}

#right > button {
  height: 3em;
  width: 3em;
  border-radius: 1.5em;
  border-width: 0;
}

#right > button:hover {
  background-color: #ccc;
}

.actions {
  display: flex;
  gap: .5em;
  margin-top: .25em;
}
.actions > button {
  border-width: 0;
  height: 3em;
  border-radius: 1.5em;
  padding: 0em 1em;
}

.actions > button:hover {
  background-color: #ccc;
}

</style>
