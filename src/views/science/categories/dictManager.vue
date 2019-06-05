<template>
  <dict-manage
    tag="div"
    prop="DictName"
    title="分类"
    :items="dicts"
    :visible="true"
    :loading="loading"
    :uploading="uploading"
    @new="onDictNew"
    @create="onDictCreate"
    @update="onDictUpdate"
    @sort="onDictSort"
    @delete="onDictDelete"
    @cancel="onDictCancel"
    @close="$emit('update:visible', false)"
  />
</template>

<script>
import {
  COLLEGE_API_SETTINGDICTIONARY_GETS,
  COLLEGE_API_SETTINGDICTIONARY_SORT,
  COLLEGE_API_SETTINGDICTIONARY_DELETE,
  COLLEGE_API_SETTINGDICTIONARY_CREATE,
  COLLEGE_API_SETTINGDICTIONARY_UPDATE
} from '@/apis/science'
import { InfrastCourseChannelType } from '@/enums/science'
import DictManage from '@/components/dictManage'

import { SortType } from '@/enums/common'

const checkCategoryName = value => {
  if (value === '') {
    return '请填写名称'
  } else {
    // if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
    //   return '请输入汉字'
    // }
  }
}

export default {
  name: 'dictManager',
  components: {
    DictManage
  },
  data() {
    return {
      dicts: [],
      uploading: false,
      loading: false
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
      const valid = checkCategoryName(data.DictName)
      if (valid) {
        return this.$message.error(valid)
      }
      try {
        this.loading = true
        const {
          data: { Code }
        } = await COLLEGE_API_SETTINGDICTIONARY_CREATE({
          DictName: data.DictName,
          DictType: InfrastCourseChannelType.System,
          ParentId: 0
        })
        if (Code === 'CORRECT') {
          this.$message.success('创建成功!')
          this.pull()
          return
        }
        this.loading = false
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async onDictUpdate(para) {
      const valid = checkCategoryName(para.DictName)
      if (valid) {
        return this.$message.error(valid)
      }
      try {
        this.loading = true
        const {
          data: { Code }
        } = await COLLEGE_API_SETTINGDICTIONARY_UPDATE(para)
        if (Code === 'CORRECT') {
          this.$message.success('修改成功')
          await this.pull()
        }
        this.loading = false
      } catch (e) {
        console.error(e)
      }
    },
    async onDictSort(row, tag) {
      console.log(row, tag)
      const param = {
        DictId: row.DictId,
        DictType: InfrastCourseChannelType.System
      }
      const func = {
        first() {
          param.MoveType = SortType.First
        },
        last() {
          param.MoveType = SortType.Last
        },
        prev() {
          param.MoveType = SortType.Prev
        },
        next() {
          param.MoveType = SortType.Next
        }
      }
      try {
        this.loading = true
        func[tag]()
        const {
          data: { Code }
        } = await COLLEGE_API_SETTINGDICTIONARY_SORT(param)
        if (Code === 'CORRECT') {
          this.pull()
        } else {
          this.loading = false
        }
      } catch (e) {
        console.error(e)
      }
    },
    onDictCancel() {
      this.dicts.splice(0, 1)
    },
    async onDictDelete(data) {
      try {
        this.loading = true
        const {
          data: { Code }
        } = await COLLEGE_API_SETTINGDICTIONARY_DELETE({ DictId: data.DictId })
        if (Code === 'CORRECT') {
          this.$message.success('删除成功')
          await this.pull()
        }
        this.loading = false
      } catch (e) {
        console.error(e)
      }
    },
    async pull() {
      this.loading = true
      const response = await COLLEGE_API_SETTINGDICTIONARY_GETS({
        DictType: InfrastCourseChannelType.System
      })
      if (response.data.Code === 'CORRECT') {
        this.dicts = response.data.Data.Subset
      }
      this.loading = false
    }
  },

  async mounted() {
    this.pull()
  }
}
</script>

<style scoped></style>
