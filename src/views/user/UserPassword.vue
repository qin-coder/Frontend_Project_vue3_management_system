<script setup>
import { ref } from 'vue'
import { userUpdatePasswordService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const formRef = ref()
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

const checkDifferent = (rule, value, callback) => {
  // 校验新密码和原密码不能一样
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码一样'))
  } else {
    callback()
  }
}
const checkSameAsNewPwd = (rule, value, callback) => {
  // 校验确认密码必须和新密码一样
  if (value !== pwdForm.value.new_pwd) {
    callback(
      new Error(
        'The confirmation password must be the same as the new password'
      )
    )
  } else {
    callback()
  }
}
const rules = ref({
  old_pwd: [
    {
      required: true,
      message: 'Please enter the original password',
      trigger: 'blur'
    },
    {
      min: 6,
      max: 15,
      message: 'Original password length between 6 and 15 digits',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: 'Please enter a new password', trigger: 'blur' },
    {
      min: 6,
      max: 15,
      message: 'New passwords between 6-15 digits in length',
      trigger: 'blur'
    },
    { validator: checkDifferent, trigger: 'blur' }
  ],
  re_pwd: [
    {
      required: true,
      message: 'Please enter the new password again',
      trigger: 'blur'
    },
    {
      min: 6,
      max: 15,
      message: 'Verify that the password length is between 6 and 15 digits',
      trigger: 'blur'
    },
    { validator: checkSameAsNewPwd, trigger: 'blur' }
  ]
})

const userStore = useUserStore()
const router = useRouter()

const submitForm = async () => {
  await formRef.value.validate()
  await userUpdatePasswordService(pwdForm.value)
  ElMessage.success('Password changed successfully')

  // 密码修改成功后，退出重新登录
  // 清空本地存储的 token 和 个人信息
  userStore.setToken('')
  userStore.setUser({})

  // 拦截登录
  router.push('/login')
}

const resetForm = () => {
  formRef.value.resetFields()
}
</script>

<template>
  <page-container title="change password">
    <el-row>
      <el-col :span="12">
        <el-form
          ref="formRef"
          :model="pwdForm"
          :rules="rules"
          label-width="200px"
          style="width: 100%; max-width: 500px; margin: 0 auto"
          label-position="left"
        >
          <el-form-item label="old password" prop="old_pwd">
            <el-input v-model="pwdForm.old_pwd" show-password></el-input>
          </el-form-item>
          <el-form-item label="new password" prop="new_pwd">
            <el-input v-model="pwdForm.new_pwd" show-password></el-input>
          </el-form-item>
          <el-form-item label="confirm password" prop="re_pwd">
            <el-input v-model="pwdForm.re_pwd" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm"
              >change password</el-button
            >
            <el-button @click="resetForm">Reset</el-button>
          </el-form-item>
        </el-form></el-col
      >
    </el-row>
  </page-container>
</template>
