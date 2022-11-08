<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="event"
  >
    <div id="left">
      <header>
        <h3>
          {{ event.name }}
        </h3>
        <p>
          Date & Time: 
          <input v-if="editing" :value="draftTime" @input="draftTime = $event.target.value">
          <span v-else>{{event.time}}</span>
        </p>
        <p>
          Location: 
          <input v-if="editing" :value="draftLocation" @input="draftLocation = $event.target.value">
          <span v-else>{{event.location}}</span>
        </p>
      </header>
      <section v-if="event.creator === $store.state.username" class="actions">
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
        <button @click="deleteEvent">
          🗑️ Delete
        </button>
      </section>
      <p id="botbar">{{event.attendingUsers}} attending | {{event.interestedUsers}} interested</p>
    </div>
    <div id="right">
      <div v-if="event.userStatus === 'attending'">
        <button id="notAttending" @click="toggleAttending">
          Attending
        </button>
      </div>
      <div v-else>
        <button id="attending" @click="toggleAttending">
          Attending
        </button>
      </div>
      <div v-if="event.userStatus === 'interested'">
        <button id="notInterested" @click="toggleInterested">
          Interested
        </button>
      </div>
      <div v-else>
        <button id="interested" @click="toggleInterested">
          Interested
        </button>
      </div>
      <!-- <button @click="toggleAttending">
        <span v-if="event.userStatus === 'attending'">Not Attending</span>
        <span v-else>Attending</span>
      </button>
      <button @click="toggleInterested">
        <span v-if="event.userStatus === 'interested'">Not Interested</span>
        <span v-else>Interested</span>
      </button> -->
      <div v-if="event.community.inCommunity">
        <button id="viewCom" @click="viewCommunity">
          View Community
        </button>
      </div>
      <div v-else>
        <button id="joinCom" @click="joinCommunity">
          Join Community
        </button>
      </div>
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
  name: 'EventComponent',
  props: {
    // Data from the stored freet
    event: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false,
      draftTime: this.event.time,
      draftLocation: this.event.location,
      alerts: {}
    };
  },
  methods: {
    // async toggleMembership() {
    //   const r = await fetch(`/api/communities/user/${this.community._id}`, {method: 'PUT'});
    //   this.$store.commit('refreshCommunities');
    // }
    startEditing() {
      this.editing = true;
      this.draftTime = this.event.time;
      this.draftLocation = this.event.location;
    },
    stopEditing() {
      this.editing = false;
      this.draftTime = this.event.time;
      this.draftLocation = this.event.location;
    },
    deleteEvent() {
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted event!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      if (this.draftTime === this.event.time && this.draftLocation === this.event.location) {
        const error = 'Error: Edited event time/location should be different than current event time/location.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited event!',
        body: JSON.stringify({time: this.draftTime, location: this.draftLocation}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/events/view/${this.event._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshEvents');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async toggleAttending() {
      const r = await fetch(`/api/events/user/attending/${this.event._id}`, {method: 'PUT'});
      this.$store.commit('refreshEvents');
    },
    async toggleInterested() {
      const r = await fetch(`/api/events/user/interested/${this.event._id}`, {method: 'PUT'});
      this.$store.commit('refreshEvents');
    },
    viewCommunity() {
      this.$router.push(`/community/${this.event.community._id}`);
    },
    async joinCommunity() {
      const r = await fetch(`/api/communities/user/${this.event.community._id}`, {method: 'PUT'});
      this.$store.commit('refreshCommunities');
      this.$router.push(`/community/${this.event.community._id}`);
    }
  }
};
</script>

<style scoped>
/* .event {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
} */
.event {
  padding: 0.75em;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}

header > h3 {
  margin: 0;
}

header > p {
  margin: 0;
  color: #555;
}

#botbar {
  margin: 0.5em 0 0 0;
}

#right {
  display: flex;
  gap: 0.5em;
  flex-direction: column;
  justify-content: center;
}

#notAttending, #attending, #notInterested, #interested, #viewCom, #joinCom {
  height: 36px;
  width: 140px;
  border-radius: 18px;
  border-width: 0;
  font-size: 14px;
  font-weight: bold;
  color: white;
  background-color: #bbb;
}

#viewCom, #joinCom {
  background-color: #2db3ff;
}
#viewCom:hover, #joinCom:hover {
  background-color: #0d93df;
}


#notAttending {
  background-color: #00cc36;
}

#notInterested{
  background-color: #fca414;
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
