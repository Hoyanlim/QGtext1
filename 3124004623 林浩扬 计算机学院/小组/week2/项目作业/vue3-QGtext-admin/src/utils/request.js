import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://localhost:3000' // 替换为你的 API 基础路径

// 创建 Axios 实例
const instance = axios.create({
  baseURL,
  timeout: 5000, // 请求超时时间
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，比如添加 token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    //摘取核心响应数据
    if (res?.data?.code === 200) {
      return res
    }
    //处理业务失败
    ElMessage.error(res?.data?.msg || '服务异常')
    return Promise.reject(res?.data)
  },
  (error) => {
    //处理401错误
    //错误的特殊情况 => 401 权限不足 或token过期 =>拦截到登录
    if (error.response?.status === 401) {
      router.push('/login')
    }

    //错误的默认情况
    ElMessage.error(error.response?.data?.message || '服务异常')
    console.error('API Error:', error)
    return Promise.reject(error)
  },
)

export default instance
export { baseURL }
