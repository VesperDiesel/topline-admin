<template>
 <el-card>
    <div slot="header">
      <span>素材管理</span>
    </div>
    <div class="action">
      <el-radio-group v-model="active">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="收藏"></el-radio-button>
      </el-radio-group>
      <!-- <el-button type="primary">上传图片</el-button> -->
      <!--
        这里我们可以直接使用 Upload 上传组件进行图片上传
        Upload 组件支持自动请求，不用我们自己写代码，只需要配置一下请求接口
        如果要使用它默认的请求能力，就无法使用我们在 axios 中做的那些配置了，例如 baseURL、请求拦截器。。。
          1. action 请求地址
          2. headers 请求头
          3. name  字段名称
        一：:on-success="loadImages"
          将 loadImages 配置为 on-success 的成功调用函数
          那么当上传成功的时候，Upload 组件就会调用 loadImage(response, file, fileList)
          我们自己写的 loadImages 函数，期望参数是一个布尔值
        二：:on-success="loadImages(false)"
          {{ loadImages(false) }}
          不行，因为属性绑定中会直接调用这个函数
        三：定义一个额外的函数，在这个函数中我们手动调用我们自己的 loadImages(false)
          :on-success="handleUploadSuccess"
        四：我们可以在模板中使用箭头函数
          注意：模板中直接定义的箭头函数中使用实例成员需要加 this
       -->
      <el-upload
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="{ Authorization: `Bearer ${$store.state.user.token}` }"
        name="image"
        :on-success="() => { this.loadImages(false) }"
        :show-file-list="false"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>

    <!-- 图片列表 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in images" :key="item.id" style="margin-bottom: 10px;">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.url" class="image" style='style="max-width: 100%;'>
          <div style="padding: 10px;">
            <div class="bottom clearfix">
              <el-button
               plain
               type="primary"
               :icon="item.is_collected ? 'el-icon-star-on' :' el-icon-star-off'"
               circle
               @click="handleCollect(item)"></el-button>
              <!--
                1. 注册点击事件，绑定处理函数，传递要删除的数据对象
                2. 定义删除函数，发请求执行删除操作
                3. 成功：重新加载数据列表，提示成功
                   失败：提示失败
               -->
              <el-button
                plain
                type="primary"
                icon="el-icon-delete"
                circle
                @click="handleDelete(item)"
              ></el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>

export default {
  name: 'MediaList',
  props: [''],
  data () {
    return {
      active: '全部',
      images: []
    }
  },

  components: {},

  computed: {},

  created () {
    this.loadImages()
  },

  beforeMount () {},

  mounted () {},

  methods: {
    async loadImages (collect = false) {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/user/images',
          params: {
            collect,
            page: 1,
            per_page: 10
          }
        })
        this.images = data.results
      } catch (err) {
        console.log(err)
        this.$message.error('加载图片列表失败')
      }
    },
    async handleCollect (item) {
      const collect = !item.is_collected
      try {
        const data = await this.$http({
          method: 'PUT',
          url: `/user/images/${item.id}`,
          data: {
            collect
          }
        })
        item.is_collected = data.collect
        this.$message({
          type: 'success',
          message: `${collect ? '' : '取消'}收藏成功`
        })
      } catch (err) {
        console.log(err)
        this.$message.error('收藏失败')
      }
    },
    handleUploadSuccess () {
      this.loadImages(false)
    },
    async handleDelete (item) {
      try {
        await this.$http({
          method: 'DELETE',
          url: `/user/images/${item.id}`
        })
        this.loadImages()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      } catch (err) {
        console.log(err)
        this.$message.error('删除失败')
      }
    }
  },

  watch: {}

}

</script>
<style lang='less' scoped>
.action {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.bottom {
  display: flex;
  justify-content: center;
}
img {
    height: 400px;
    width: 400px;
}
</style>
