<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateCommunityForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/communities',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'name', label: 'Name', value: ''}
      ],
      title: 'Create a community',
      refreshCommunities: true,
      callback: () => {
        const message = 'Successfully created a community!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
