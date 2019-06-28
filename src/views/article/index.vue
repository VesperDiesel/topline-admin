<template>
  <div>
    <!-- 数据筛选 -->
    <el-card class="filter-card">
      <!-- slot 插槽 -->
      <div slot="header" class="clearfix">
        <span>数据筛选</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <el-form ref="form" :model="filterParams" label-width="80px">
        <el-form-item label="状态">
          <el-radio-group v-model="filterParams.status">
            <el-radio label="全部"></el-radio>
            <el-radio v-for="(item, index) in statTypes"
            :key='item.label'
            :label='index'>{{ item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
         <article-channel v-model="filterParams.channel_id"></article-channel>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="range_date"
            @change="handleDateChange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter" :loading='articleLoading'>查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 数据筛选 -->

    <!-- 文章列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>一共有 <strong>{{ totalCount }}</strong> 条数据</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <el-table
        class="article-list"
        :data="articles"
        style="width: 100%"
        v-loading="articleLoading">
        <!-- v-loading 自定义指令 -->
        <el-table-column
          label="封面"
          width="180">
           <!--
            template 中的内容就是自定义表格列内容
            如果需要在 template 中访问遍历项数据，则需要给 template 配置 slot-scope="scope"
              slot-scope 属性名是固定的
              scope 值是自己随便起的名字
            结果就是：我们可以通过 scope.row 访问到当前遍历项对象，就好比我们遍历中的 item 一样
           -->
          <template slot-scope='scope'>
            <img :src="item"
            width='20'
            v-for='item in scope.row.cover.images'
            :key='item'>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        <template slot-scope="scope">
            <el-tag :type="statTypes[scope.row.status].type">{{ statTypes[scope.row.status].label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain>修改</el-button>
            <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 数据分页  current-page当前高亮页,需要于数据保持同步-->
      <el-pagination
        background
        :current-page='page'
        layout="prev, pager, next"
        :pagesize="pageSize"
        :total='totalCount'
        :disabled='articleLoading'
        @current-change='handleCurrentChange'>
      </el-pagination>
      <!-- /数据分页 -->
    </el-card>
    <!-- /文章列表 -->
  </div>
</template>

<script>

import AticleChannel from '@/components/article-channel'

export default {
  name: 'ArticleList',
  comments: {
    AticleChannel
  },
  props: [''],
  data () {
    return {
      articles: [],
      statTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      pageSize: 10,
      totalCount: 0,
      page: 1, // 当前页码
      articleLoading: false, // 加载中
      filterParams: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: ''
      },
      range_date: ''
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
    handleDelete (item) {
      console.log(item.id.toString())
    },
    handleDateChange (value) {
      // console.log(value) 一个数组，里面是起始和终止时间
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
    },
    handleFilter () {
      this.page = 1
      this.loadArticles()
    },
    async loadArticles () {
      this.articleLoading = true
      const filterData = {}
      for (let key in this.filterParams) {
        const item = this.filterParams[key]
        if (item !== null && item !== undefined && item !== '') {
          filterData[key] = item
        }
      }
      const data = await this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page: this.page,
          per_page: this.pageSize,
          ...filterData
        }
      })
      this.articles = data.results
      this.totalCount = data.total_count
      this.articleLoading = false
    },
    handleCurrentChange (page) {
      this.page = page
      this.loadArticles()
    }
  },

  watch: {}

}

</script>
<style lang='less' scoped>
.filter-card {
  margin-bottom: 15px;
}
.article-list {
  margin-bottom: 30px;
}
</style>
