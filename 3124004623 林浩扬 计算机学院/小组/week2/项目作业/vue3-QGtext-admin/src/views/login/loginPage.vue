<script setup>
import { userRegisterSevice, userLoginSevice} from '@/api/user.js'
import { User, Lock } from '@element-plus/icons-vue'
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
  confirmPassword: '' // 确认密码
})
// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' } // 邮箱格式验证
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' } // 手机号格式验证 1开头 第二位3-9 后面9位数字
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须为 6-15位 的非空字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须为 6-15位 的非空字符', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        if (value === formModel.value.password) {
          callback();
        } else {
          callback(new Error('两次输入的密码不一致'));
        }
      }, trigger: 'blur' }
  ]

}
// 注册函数
const register = async() => {
  await form.value.validate()
  userRegisterSevice(formModel.value).then(res => {
    console.log(res)
    if (res.code === 200) {
      ElMessage.success('注册成功')
    }
  isRegister.value = false
  });
}
const userStore = useUserStore()
const router = useRouter()
// 登录函数
const login = async() => {
  await form.value.validate()
  userLoginSevice(formModel.value).then(res => {
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
    confirmPassword: ''
  }
})

</script>

<template>
<div>
  <el-row class="login-page">
    <el-col :span="24"></el-col>
      <!-- 注册相关表单 -->
      <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" v-if="isRegister">
        <el-form-item >
          <hr>注册
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formModel.message" :prefix-icon="Message" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formModel.phone" :prefix-icon="Iphone" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="formModel.password" :prefix-icon="Lock" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="formModel.confirmPassword" :prefix-icon="Lock" type="password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="register" calss="button" type="primary" auto-insert-space>注册</el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="info" :underline="false" href="#" @click="isRegister = false">
            已有账号?登录 ->
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录相关表单 -->
      <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" v-else>
        <el-form-item >
          <hr>登录
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="formModel.password" :prefix-icon="Lock" type="password" placeholder="请输入密码"></el-input>
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
</div>
</template>

<style scoped>
.login-page {
  width: 400px;
  margin: 100px auto;
}
.flex {
  display: flex;
  justify-content: space-between;
}
.el-form-item {
  margin-bottom: 10px;
}

</style>
