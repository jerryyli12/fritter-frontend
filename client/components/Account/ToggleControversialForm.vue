<!-- Form for signing out (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ToggleControversialForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/controversials',
      method: 'PUT',
      setControversial: true,
      title: 'Toggle controversial setting',
      fields: [],
      callback: () => {
        this.$store.commit('alert', {
          message: 'Controversial toggled!', status: 'success'
        });
      }
    };
  }
};
</script>

