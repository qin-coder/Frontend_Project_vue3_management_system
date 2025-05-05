import { useUserStore } from '@/stores/modules/user'
import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  baseURL,
  timeout: 100000
})
//请求拦截器

instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)
//响应拦截器
// 1. 先判断响应的状态码
// 2. 如果是200，说明请求成功，直接返回数据
// 3. 如果不是200，说明请求失败，提示错误信息
// 4. 如果是401，说明token过期，跳转到登录页
// 5. 其他错误，提示错误信息
// 6. 返回一个Promise对象，方便后续处理

instance.interceptors.response.use(
  (res) => {
    if (res.data.code === 0) {
      return res
    }
    ElMessage({ message: res.data.message || '服务异常', type: 'error' })
    return Promise.reject(res.data)
  },
  (err) => {
    ElMessage({
      message: err.response.data.message || '服务异常',
      type: 'error'
    })
    console.log(err)
    if (err.response?.status === 401) {
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
