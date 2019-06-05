<template>
  <section style="display: inline-block;">
    <export-field-setter
      v-loading.fullscreen.lock="uploading"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
      @submit="handleSubmit"
      :visible.sync="open"
      :apiKey="apiKey"
      :api="eApi"
    />
    <slot v-if="mode !== 'dropdown'" v-bind="{toggle}"></slot>
    <el-dropdown v-else @command="multiAudit">
      <el-button name="btnDown" type="primary">
        导出
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item name="btnOutChoose" v-if="!exportSelectIf" command="a" :disabled="record">导出所选</el-dropdown-item>
        <el-dropdown-item name="btnOutResult" command="b">导出查询结果</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </section>
</template>

<script>
import ExportFieldSetter from '@/components/exportFieldSetter'

import {
  MEMBERSHIP_API_STOREEXPORTER_EXPORTTOFILE,
  MEMBERSHIP_API_STOREEXPORTER_GETEXPORTFIELDS
} from '@/apis/membership'
import {
  DOMAIN_TEMP
} from '@/configs/appSettings'

export default {
  name: 'member-export',
  props: {
    apiKey: {
      type: String
    },
    apiParameter: {
      type: Object
    },
    records: {
      type: Array
    },
    exportSelectIf: {
      type: Boolean, default: false
    },
    mode: {
      type: String, default: 'dropdown'
    }
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      eApi: MEMBERSHIP_API_STOREEXPORTER_GETEXPORTFIELDS,
      uploading: false,
      exportType: 0,
      open: false
    }
  },
  components: {
    ExportFieldSetter
  },
  methods: {
    toggle(exportType) {
      this.open = !this.open
      this.exportType = exportType
    },
    multiAudit(command) {
      if (command !== 'b' && this.records.length === 0) {
        return this.$message.error('请选择要导出的条目')
      }
      this.open = true
      const self = this
      const cmds = {
        a() {
          // 导出所选
          self.exportType = 0
        },
        b() {
          // 导出所有
          self.exportType = 1
        }
      }
      cmds[command]()
    },
    // 后端大佬说的, 服务器需要时间来准备资源
    countDown(cb) {
      const count = 5
      const self = this
      function update(value) {
        if (value === 0) {
          cb()
        } else {
          setTimeout(() => {
            update(value - 1)
          }, 1000)
        }
        self.loadingText = `数据准备中, 预计剩余${value}秒 `
      }
      update(count)
    },
    async handleSubmit(exportFields) {
      try {
        this.uploading = true
        const propsParams = {
          ...this.$props
        }
        delete propsParams.visible
        const para = {
          ...propsParams,
          exportType: this.exportType,
          exportFields
        }
        const self = this
        const res = await MEMBERSHIP_API_STOREEXPORTER_EXPORTTOFILE(para).then(
          res => {
            return new Promise(resolve => {
              function cb() {
                resolve(res)
              }
              self.countDown(cb)
            })
          }
        )
        const tempPath = DOMAIN_TEMP
        if (res.data.Data) {
          const downloadUrl = `${tempPath}${res.data.Data}`
          window.location.href = downloadUrl
          this.open = false
          this.$emit('success')
        }
      } catch (e) {
        console.error(e)
        this.$message.error('数据导出失败!')
      } finally {
        this.uploading = false
      }
    }
  },
  computed: {
    record() {
      return this.records.length == 0
    }
  }
}
</script>
