<template>
  <div id="account">
    <div v-show="!isLogin">
      <logmsg></logmsg>
    </div>
    <div v-show="isLogin">

    </div>
  </div>
</template>

<script>
import logmsg from './logmsg'
import store from '@/store'
export default {
  components: {
    logmsg
  },
  data () {
    return {
      isLogin: store.state.token !== null
    }
  }
}
</script>
