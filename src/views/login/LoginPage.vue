<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user.js'
import { useUserStore } from '@/stores'
import {useRouter} from 'vue-router'
const isRegister = ref(false)

const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
const form = ref()
const rules = ref({
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 5, max: 10, message: 'Length should be 5 to 10', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: 'Length should be 6 to 15 and none empty character',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: 'Please input password again', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: 'Length should be 6 to 15 and none empty character',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        // Custom validation
        // Check if the password and confirm password match
        // If they don't match, call the callback with an error message
        // If they match, call the callback without any arguments
        if (value !== formModel.value.password) {
          callback(new Error('Two passwords are inconsistent'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})
const register = async () => {
  await form.value.validate()
  await userRegisterService(formModel.value)
  ElMessage.success('Register success')
  isRegister.value = false
}
const userStore = useUserStore()
const router = useRouter()
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.token)
  ElMessage.success('Login success')
  router.push('/')
}
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>
<template>
  <el-row class="login-page"
    ><!-- 总共分成了24份 -->
    <el-col :span="12" class="bg"></el-col>
    <!--左侧背景图 :span="12"表示占据12份-->
    <el-col :span="6" :offset="3" class="form">
      <!--右侧表单 :span="6"表示占据6份 :offset="3"表示偏移3份-->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>Register</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="Please input username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :rules="rules"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please input password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please input password again"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            register
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← return to login
          </el-link>
        </el-form-item>
      </el-form>
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>Login</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="Please input username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please input password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>Remember me</el-checkbox>
            <el-link type="primary" :underline="false"
              >Forget password ?</el-link
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >Login</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            Register →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
