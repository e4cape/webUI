<template>
  <dict-manage
    :prop="prop"
    :items="dicts"
    :visible="visible"
    :loading="loading"
    :uploading="uploading"
    :title="dialogTitle"
    :tag="tag"
    @new="onDictNew"
    @create="onDictCreate"
    @update="onDictUpdate"
    @sort="onDictSort"
    @delete="onDictDelete"
    @cancel="onDictCancel"
    @close="$emit('update:visible', false)"
  ></dict-manage>
</template>

<script>
import DictManage from '../dictManage'
import {
  MEMBERSHIP_API_SETTINGOPTION_CREATESETTINGOPTION,
  MEMBERSHIP_API_SETTINGOPTION_UPDATESETTINGOPTION,
  MEMBERSHIP_API_SETTINGOPTION_DELETESETTINGOPTION,
  MEMBERSHIP_API_SETTINGOPTION_SORTSETTINGOPTION
} from '@/apis/membership'

export default {
  components: {
    DictManage
  },
  props: {
    dialogTitle: {
      type: String
    },
    tag: {
      type: String
    },
    visible: {
      type: Boolean,
      required: true
    },
    // 展示在第一项, 要改变的字段名
    prop: {
      type: String,
      required: true
    },
    optionType: {
      required: true,
      type: String
    },
    items: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      title: '',
      uploading: false,
      sortVisible: false,
      loading: false,
      dicts: this.items.map(i => ({
        ...i
      }))
    }
  },
  methods: {
    updateDictToArray(index, dict) {
      const originDicts = this.dicts[index]
      const newDict = {}
      Object.keys(originDicts).filter(k => {
        if (dict[k]) {
          newDict[k] = dict[k]
        } else {
          newDict[k] = originDicts[k]
        }
      })
      this.dicts.splice(index, 1, dict)
    },
    // -排序
    // -得到排序数组
    optionsForSort(settingOptionId, options) {
      const optionsForSort = []
      for (let i = 0; i < options.length; i += 1) {
        optionsForSort[i] = options[i].settingOptionId
      }
      const settingOptionIdIndex = optionsForSort.indexOf(settingOptionId)
      optionsForSort.splice(settingOptionIdIndex, 1)
      return [optionsForSort, settingOptionIdIndex]
    },
    getDictIndexFromArray(dict) {
      return this.dicts.findIndex(
        d => d.settingOptionId === dict.settingOptionId
      )
    },
    onDictNew(obj) {
      this.dicts.unshift({
        name: '',
        ...obj
      })
    },
    async onDictCreate({ ...data }) {
      try {
        this.loading = true
        const {
          data: { Data: res }
        } = await MEMBERSHIP_API_SETTINGOPTION_CREATESETTINGOPTION({
          ...data,
          optionType: this.optionType
        })
        if (res) {
          this.$message.success('创建成功!')
          const newData = {
            ...data,
            settingOptionId: res
          }
          this.dicts.splice(0, 1, newData)
        } else {
          this.dicts.splice(0, 1)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async onDictUpdate(para) {
      try {
        this.uploading = true
        const {
          data: { Data: res }
        } = await MEMBERSHIP_API_SETTINGOPTION_UPDATESETTINGOPTION(para)
        if (res) {
          this.$message.success('修改成功')
          const index = this.getDictIndexFromArray(para)
          this.updateDictToArray(index, para)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.uploading = false
      }
    },
    async onDictSort(row, tag) {
      const id = row.settingOptionId
      const [arr, index] = this.optionsForSort(id, this.dicts)

      const func = {
        first() {
          arr.unshift(id)
        },
        last() {
          arr.push(id)
        },
        prev() {
          arr.splice(index - 1, 0, id)
        },
        next() {
          arr.splice(index + 1, 0, id)
        }
      }
      try {
        this.loading = true
        func[tag]()
        const {
          data: { Data: res }
        } = await MEMBERSHIP_API_SETTINGOPTION_SORTSETTINGOPTION({
          settingOptionIdList: arr
        })
        if (res) {
          this.dicts = res
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    onDictCancel() {
      this.dicts.splice(0, 1)
    },
    async onDictDelete(data) {
      try {
        const {
          data: { Data: res }
        } = await MEMBERSHIP_API_SETTINGOPTION_DELETESETTINGOPTION(data)

        if (res) {
          this.$message.success('删除成功')
          const index = this.getDictIndexFromArray(data)
          this.dicts.splice(index, 1)
        }
      } catch (e) {
        console.error(e)
      }
    }
  },

  watch: {
    visible() {
      if (this.dicts.length) {
        let arr = []
        this.dicts.forEach(item => {
          if (item.name) {
            arr.push(item)
          }
        })
        this.$emit('reason-change', arr)
      }
    },
    items() {
      this.dicts = this.items.map(item => ({
        ...item
      }))
    }
  }
}
</script>
