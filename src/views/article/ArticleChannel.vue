<script setup>
import { ref } from 'vue'
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
const channelList = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialog = ref()
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()
const onEditChannel = (row) => {
  dialog.value.open(row)
}
const onAddChannel = () => {
  dialog.value.open({})
}
const onSuccess = () => {
  getChannelList()
}
const onDelChannel = async (row) => {
  await ElMessageBox.confirm(
    'Are you sure you want to delete the classifieds?',
    'Warming tips',
    {
      type: 'warning',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }
  )
  await artDelChannelService(row.id)
  ElMessage({ type: 'success', message: 'Delete Success' })
  getChannelList()
}
</script>
<template>
  <page-container title="Article Classification">
    <template #extra>
      <el-button @click="onAddChannel" type="primary">
        Add Classification</el-button
      >
    </template>

    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column label="Number" width="100" type="index">
      </el-table-column>
      <el-table-column
        label="Classification Name"
        prop="cate_name"
      ></el-table-column>
      <el-table-column
        label="Classification Nickname"
        prop="cate_alias"
      ></el-table-column>
      <el-table-column label="Operation" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="No data" />
      </template>
    </el-table>
    <channel-edit
      ref="dialog"
      @success="onSuccess"
      v-model:dialogVisible="dialogVisible"
      @getChannelList="getChannelList"
    ></channel-edit>
  </page-container>
</template>
