<template>
  <el-container>
    <el-aside width="200px">
      <!-- 侧边栏 -->
      <AppAside/>
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <AppHeader/>
      </el-header>
      <!-- 内容 -->
      <el-main>
        <router-view :key='$route.path'>
          <!--
          禁用路由缓存，只需要给 router-view 添加一个唯一的 key 即可
          这样路由就不会去缓存组件了
          这个 key 要确保唯一
          禁用路由换粗不是必须的，看情况
          如果你要刻意使用默认的路由缓存能力，那么就不要禁用，去呗缓存的路由中通过
            方式一：监视 $route 做处理
            方式二：2.2 新增的 beforeRouteUpdate 路由导航钩子做处理
         -->
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'
export default {
  name: 'AppLayout',
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
<style lang='less' scoped>
.el-container {
  height: 100%;
}
.el-aside {
  background-color: #343a46;
}
.el-header {
  background-color: #aec0d1;
}
.el-main {
  background-color: #e8eff4;
}
</style>
