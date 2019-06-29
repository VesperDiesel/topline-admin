<template>
 <el-card>
    <div slot="header">
      <span>评论管理</span>
    </div>
    <el-table :data="articles">
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
      <el-table-column label="评论粉丝数" prop="fans_comment_count"></el-table-column>
      <el-table-column label="允许评论"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>

export default {
  name: 'ArticleComment',
  props: [''],
  data () {
    return {
      articles: []
    }
  },

  components: {},

  computed: {},

  created () {
    this.loadArticles()
  },

  beforeMount () {},

  mounted () {},

  methods: {
    async loadArticles () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/articles',
          params: {
            response_type: 'comment'
          }
        })
        console.log(data)
        this.articles = data.results
      } catch (err) {
        this.$message.error('加载评论列表失败')
      }
    }
  },

  watch: {}

}

</script>
<style lang='less' scoped>

</style>
