<template>
  <div class="search-container">
    <a-space>
      <a-select
          v-model:value="conditions.params.system"
          :options="systemOptions"
          placeholder="System"
          class="input"
          allow-clear
          @change="handleChangeSelect"
      />
    </a-space>
    <a-space>
      <a-button type="primary" @click="handleSearch">搜索</a-button>
      <a-button @click="handleReset">重置</a-button>
    </a-space>
  </div>

  <a-divider style="margin: 8px 0;" />

  <div class="table-container">
    <a-table
      class="table"
      :columns="tableColumns"
      :data-source="logs"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'time'">
          <span>{{dayjs(record.time).format('YYYY/MM/DD HH:mm:ss')}}</span>
        </template>
        <template v-else-if="column.key === 'content'">
          <span class="content" @click="handleClickContent(record.content)">{{record.content}}</span>
        </template>
        <template v-else-if="column.key === 'actions'">
          <a href="javascript:void(0)" @click="handleClickContent(record.content)">查看</a>
        </template>
      </template>
    </a-table>
  </div>

  <a-pagination
    :total="totalLogs"
    v-model:current="conditions.params.page"
    v-model:page-size="conditions.params.size"
    class="pagination"
    show-size-changer
    :show-total="total => `共 ${total} 项`"
    @change="handleChangePage"
    @showSizeChange="handleChangeSize"
  />

  <a-drawer
    v-model:visible="showDrawer"
    title="详情"
    placement="right"
    width="600px"
    @close="handleCloseDrawer"
  >
    <div class="monaco-editor"></div>
  </a-drawer>

</template>

<script setup>
import {useLogs, useSystems} from "@/compose/compose";
import {computed, nextTick, reactive, ref} from "vue";
import {tableColumns} from './config'
import dayjs from 'dayjs'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js'

let editor = null

const showDrawer = ref(false)

const conditions = reactive({
  params: {
    system: undefined,
    page: 1,
    size: 10,
  },
})

const systems = useSystems()
const [logs, totalLogs, fetchLogs] = useLogs(conditions)

const systemOptions = computed(() => systems.value?.length > 0 && systems.value.map(s => ({
  value: s,
  label: s,
})))

function handleChangeSelect(value) {
  value && fetchLogs()
}

function handleSearch() {
  fetchLogs()
}

function handleReset() {
  conditions.system = undefined
}

function handleClickContent(content) {
  showDrawer.value = true
  nextTick(() => {
    editor = monaco.editor.create(document.querySelector('.monaco-editor'), {
      value: '',
      language: 'json',
      readOnly: true,
    })
    editor.setValue(JSON.stringify(JSON.parse(content), null, 2))
  })
}

function handleCloseDrawer() {
  editor && editor.dispose()
  showDrawer.value = false
}

function handleChangePage(page) {
  conditions.params.page = page
  fetchLogs()
}

function handleChangeSize(_, size) {
  conditions.params.page = 1
  conditions.params.size = size
  fetchLogs()
}

</script>

<style lang="stylus" scoped>
.search-container
  display flex
  align-items start
  justify-content space-between
  row-gap 8px

  .input
    width 240px

.table-container
  height calc(100vh - 398px)
  overflow auto

  .content
    cursor pointer

.pagination
  margin-top 16px
  width 100%
  text-align right

.monaco-editor
  height 100%
</style>
