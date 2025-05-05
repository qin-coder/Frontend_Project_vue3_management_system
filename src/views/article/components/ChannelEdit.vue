<script setup>
import { ref } from 'vue'
import { artAddChannelService, artEditChannelService } from '@/api/article'
const dialogVisible = ref(false)
const formRef = ref()
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})

const rules = {
  cate_name: [
    {
      required: true,
      message: 'Please input Classification Name',
      trigger: 'blur'
    },
    {
      pattern: /^\S{1,10}$/,
      message:
        'The classification name must be a non-empty character from 1 to 10 digits.',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    {
      required: true,
      message: 'Please input Classification Nickname',
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: 'Classification aliases must be alphanumeric with 1-15 digits',
      trigger: 'blur'
    }
  ]
}
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate()
  const isEdit = formModel.value.id
  // formModel.value.id
  //   ? await artEditChannelService(formModel.value)
  //   : await artAddChannelService(formModel.value)
  if (isEdit) {
    // edit
    await artEditChannelService(formModel.value)
    ElMessage.success('Edit successful')
  } else {
    // add
    await artAddChannelService(formModel.value)
    ElMessage.success('Adding successful')
  }
  dialogVisible.value = false
  emit('success')
}
//explose a method named open to parent component
// this method will be used to open the dialog
const open = async (row) => {
  dialogVisible.value = true
  formModel.value = { ...row }
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? 'Edit' : 'Adding'"
    width="30%"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="180px"
      style="padding-left: 30px"
    >
      <el-form-item label="Classification Name" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          minlength="1"
          maxlength="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="Classification Nickname" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          minlength="1"
          maxlength="15"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmit"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>
