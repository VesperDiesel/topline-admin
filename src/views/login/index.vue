<template>

     <div class="login-wrap">
    <!-- 给组件加 class，会把这个 class 作用到组件的根元素上 -->
    <div class="form-wrap">
      <div class="form-head">
        <img src="./logo_index.png" alt="黑马头条号">
      </div>
      <el-form class="form-content" ref="form" :model="form" :rules='rules'>
        <el-form-item prop='mobile'>
          <el-input v-model="form.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop='code'>
          <!-- el-col 栅格布局，一共 24 列，:span 用来指定占用的大小，:offset 用来指定偏移量 -->
          <el-col :span="14">
            <el-input v-model="form.code" placeholder="验证码"></el-input>
          </el-col>
          <el-col :offset="1" :span="9">
            <el-button @click="handleSendCode" :disabled="!!codeTimer">{{codeTimer ? `剩余${codeTimeSeconds秒}` : '获取验证码'}}</el-button>
          </el-col>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox class="agree-checkbox" v-model="form.agree"></el-checkbox>
          <span class="agree-text">我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt'
const initCodeTimeSeconds = 60
export default {
  name: 'AppLogin',
  props: [''],
  data () {
    return {
      form: {
        mobile: '',
        code: '',
        agree: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^d{11}&/, message: '请输入有效的手机号', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^d{6}&/, message: '请输入有效的验证码', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议' },
          { pattern: /true/, message: '请同意用户协议' }
        ]
      },
      codeTimer: null,
      codeTimeSeconds: initCodeTimeSeconds
    }
  },

  components: {},

  computed: {},

  beforeMount () {},

  mounted () {},

  methods: {
    handleLogin () {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        this.submitLogin()
      })
    },
    submitLogin () {
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      }).then(res => {
        // console.log(res.data)
        const userInfo = res.data.data
        window.localStorage.setItem('user_info', JSON.stringify(userInfo))
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.$router.push({
          name: 'home'
        })
      }).catch((e) => {
        this.$message.error('登录失败，手机号或验证码错误')
      })
    },
    handleSendCode () {
      this.$refs['form'].validateField('mobile', errorMessage => {
        if (errorMessage.trim().length > 0) {
          return
        }
        this.showGeetest()
      })
    },
    showGeetest () {
      const { mobile } = this.form
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        const { data } = res.data
        // 目前提供四种展现形式

        // popup（弹出式）

        // float（浮动式）、

        // custom（与popup类似，但是可以自定义弹出区域）、

        // bind（隐藏按钮类型）。
        window.initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind' // 隐藏，直接弹出式
        }, captchaObj => {
          captchaObj.onReady(() => {
            // 验证码ready之后才能调用verify方法显示验证码
            captchaObj.verify() // 弹出验证码内容框
          }).onSuccess(() => {
            // your code
            // console.log(captchaObj.getValidate())
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate
            } = captchaObj.getValidate()
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: {
                challenge,
                validate,
                seccode
              }
            }).then(res => {
              // console.log(res.data)
              this.codeCountDown()
            })
          }).onError(function () {
            // your code
          })
          // 在这里注册 “发送验证码” 按钮的点击事件，然后验证用户是否输入手机号以及手机号格式是否正确，没有问题：
          // captchaObj.verify
        })
      })
    },
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeTimeSeconds--
        if (this.codeTimeSeconds <= 0) {
          window.clearInterval(this.codeTimer)
          this.codeTimeSeconds = initCodeTimeSeconds
          this.codeTimer = null
        }
      }, 1000)
    }
  }
}
</script>
<style lang='less' scoped>
.login-wrap {
  height: 100%;
  background-color: #2b3e4a;
  display: flex;
  justify-content: center;
  align-items: center;
  .form-head {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    img {
      width: 200px;
    }
  }
  .form-wrap {
    width: 400px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    .btn-login {
      width: 100%;
    }
  }
  .agree-checkbox {
      margin-right: 10px;
    }
    .agree-text {
      font-size: 16px;
      color: #999;
    }
}
</style>
