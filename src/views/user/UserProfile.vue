<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'

const formRef = ref()

// 是在使用仓库中数据的初始值 (无需响应式) 解构无问题
const {
  user: { email, id, nickname, username },
  getUser
} = useUserStore()

const form = ref({
  id,
  username,
  nickname,
  email
})

const rules = ref({
  nickname: [
    { required: true, message: 'Please input user nickname', trigger: 'blur' },
    {
      pattern: /^\S{2,10}/,
      message: 'Nickname length of 2-10 non-empty characters',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: 'Please input user e-mail', trigger: 'blur' },
    {
      type: 'email',
      message: 'Please input correct e-mail',
      trigger: ['blur', 'change']
    }
  ]
})

const submitForm = async () => {
  // 等待校验结果
  await formRef.value.validate()
  // 提交修改
  await userUpdateInfoService(form.value)
  // 通知 user 模块，进行数据的更新
  getUser()
  // 提示用户
  ElMessage.success('Edit Success')
}
</script>
<template>
  <page-container title="Basic Information">
    <!-- 表单部分 -->
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="Login Name">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="User Name" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="User E-mail" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">Submit changes</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
