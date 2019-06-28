import Vue from 'vue'
import router from './router'
import './styles/index.less'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css'
import axios from 'axios'
import App from './App.vue'
import { getUser, removeUser } from '@/utils/auth'
import JSONbig from 'json-bigint'

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'
// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0'

// 这里使用 JSONbig.parse 转换原始数据
// 类似于 JSON.parse
// 但是它会处理其中超出安全整数范围的整数问题。
// 严谨一点，如果 data 不是 json 格式字符串就会报错
axios.defaults.transformResponse = [function (data) {
  try {
    // 如果是 json 格式字符串，那就转换并返回给后续使用
    return JSONbig.parse(data)
  } catch (err) {
    // 报错就意味着 data 不是 json 格式字符串，这里就直接原样返回给后续使用
    return data
  }
}]

// axios请求拦截器,axios发送的请求回先经过这里，可以在此进行一些逻辑操作
axios.interceptors.request.use(config => {
  const user = getUser()
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
  // return config 是允许发送请求的开关
}, error => {
  return Promise.reject(error)
})

// axios 响应拦截器， axios 收到的响应先经过这里
axios.interceptors.response.use(response => {
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, error => {
  if (error.response.status === 401) {
    removeUser()
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})

Vue.use(ElementUI)
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
