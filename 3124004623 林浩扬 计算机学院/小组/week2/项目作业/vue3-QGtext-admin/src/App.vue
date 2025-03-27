<script setup>
import { userRegisterSevice, userLoginSevice } from '@/api/user.js'
import { User, Lock, Message, Iphone } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user.js'
import { useRouter } from 'vue-router'
const isRegister = ref(true)
const form = ref(null) // Define the form reference

//整个用于提交的form数据对象
const formModel = ref({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '', // 确认密码
})
// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }, // 邮箱格式验证
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }, // 手机号格式验证 1开头 第二位3-9 后面9位数字
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须为 6-15位 的非空字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须为 6-15位 的非空字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === formModel.value.password) {
          callback()
        } else {
          callback(new Error('两次输入的密码不一致'))
        }
      },
      trigger: 'blur',
    },
  ],
}
// 注册函数
const register = async () => {
  try {
    await form.value.validate()
    console.log('提交的数据:', formModel.value) // 打印提交的数据
    userRegisterSevice(formModel.value)
      .then((res) => {
        console.log('接口返回:', res) // 打印接口返回内容
        if (res?.data?.code === 200) {
          ElMessage.success('注册成功')
          isRegister.value = false
        } else {
          ElMessage.error(res?.data?.msg || '注册失败')
        }
      })
      .catch((error) => {
        console.error('接口错误:', error.response?.data || error) // 打印错误信息
        ElMessage.error('注册请求失败')
      })
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请检查表单填写是否正确')
  }
}

const userStore = useUserStore()
const router = useRouter()
// 登录函数
const login = async () => {
  await form.value.validate()
  userLoginSevice(formModel.value).then((res) => {
    console.log(res)
    if (res.code === 200) {
      userStore.setToken(res.data.token)
      ElMessage.success('登录成功')
      router.push('/')
    }
  })
  console.log(formModel.value)
}

//重置时，清空表单数据
watch(isRegister, () => {
  formModel.value = {
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  }
})
</script>

<template>
  <div>
    <el-row class="login-page">
      <el-col :span="6" :offset="3"></el-col>
      <!-- 注册相关表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <hr />
          注册
        </el-form-item>

        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            v-model="formModel.email"
            :prefix-icon="Message"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>

        <el-form-item prop="phone">
          <el-input
            v-model="formModel.phone"
            :prefix-icon="Iphone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="formModel.confirmPassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="register" calss="button" type="primary" auto-insert-space
            >注册</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-link type="info" :underline="false" href="#" @click="isRegister = false">
            已有账号?登录 ->
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录相关表单 -->
      <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" v-else>
        <el-form-item>
          <hr />
          登录
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item class="flex">
          <div>
            <el-checkbox v-model="checked">记住密码</el-checkbox>
            <el-link type="primary" :underline="false" href="#">忘记密码?</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" class="button" type="primary" auto-insert-space>登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="info" :underline="false" href="#" @click="isRegister = true">
            注册 ->
          </el-link>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="12"></el-col>
    </el-row>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #74b9ff, #a29bfe);
}

.hr {
  border: none;
  border-top: 2px solid black;
  margin: 10px 0;
}

.el-form {
  width: 400px;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.el-form-item {
  margin-bottom: 20px;
}

.el-form-item hr {
  border: none;
  border-top: 2px solid #74b9ff;
  margin: 10px 0;
}

.el-input {
  border-radius: 5px;
}

.el-button {
  width: 100%;
  border-radius: 5px;
}

.el-link {
  font-size: 14px;
  color: #0984e3;
  cursor: pointer;
}

.el-link:hover {
  text-decoration: underline;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  background-color: #0984e3;
  color: #fff;
}

.button:hover {
  background-color: #74b9ff;
}
</style>
