<template>
 <el-row :gutter="20">
    <el-col :span="10">江苏传智播客教育科技股份有限公司</el-col>
    <el-col :span="5" :offset="5">
      <el-dropdown trigger="click" @command='handleCommand'>
        <span class="el-dropdown-link">
          <img width="30" src="userInfo.photo">
          {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command='a'>用户设置</el-dropdown-item>
          <el-dropdown-item @click.native="handleLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>

export default {
  name: 'AppHeader',
  props: [''],
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  },
  components: {},

  computed: {},

  beforeMount () {},

  mounted () {},

  methods: {
    handleLogout () {
      this.$confirm('确认退出么？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.localStorage.removeItem('user_info')
        this.$router.push({ name: 'login' })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    handleCommand (dropdownItem) {
      console.log('handleCommand', dropdownItem)
    }
  }
}
</script>

<style lang='' scoped>
</style>
