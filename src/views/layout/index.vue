<template>
 <div class="layout-wrap">
  <AppAside></AppAside>
  <AppHeader></AppHeader>
 </div>
</template>

<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'
export default {
  name: 'AppLayot',
  props: [''],
  components: {
    AppAside,
    AppHeader
  },
  data () {
    return {

    }
  },

  computed: {},

  beforeMount () {},

  mounted () {},

  methods: {},

  watch: {}

}

</script>
<style lang='' scoped>

</style>
