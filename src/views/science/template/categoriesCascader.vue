<template>
  <el-cascader
    :name="name"
    :options="[allCategory, ...categories]"
    :value="value"
    :props="{
        value: 'DictId',
        label: 'DictName',
        children: 'items'
      }"
    change-on-select
    @change="$emit('update:value', $event)"
  ></el-cascader>
</template>

<script>
import { dictFilterItems, rearrangeDict } from '../util'
import {
  COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYCOLLEGE,
  COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYSYSTEM
} from '@/apis/science'
import { InfrastCourseChannelType } from '@/enums/science'

export default {
  name: 'categoriesCascader',
  props: {
    name: {
      type: String,
      value: 'ChannelType'
    },
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      allCategory: {
        DictId: 0,
        DictName: '所有分类'
      },
      categories: []
    }
  },
  methods: {
    async pullOptions() {
      const result = []
      async function request(api, type, cb) {
        const response = await api()
        if (response.data.Code === 'CORRECT') {
          const subset = response.data.Data.Subset
          cb(subset)
        }
      }
      await Promise.all(
        [
          [
            COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYCOLLEGE,
            InfrastCourseChannelType.College
          ],
          [
            COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYSYSTEM,
            InfrastCourseChannelType.System
          ]
        ].map(([api, type]) => {
          return request(api, type, subset => {
            result.push({
              DictId: type,
              DictName: InfrastCourseChannelType.Types[type],
              items: rearrangeDict(subset)
            })
          })
        })
      )
      this.categories = dictFilterItems(result)
    }
  },
  mounted() {
    this.pullOptions()
  }
}
</script>

<style scoped></style>
