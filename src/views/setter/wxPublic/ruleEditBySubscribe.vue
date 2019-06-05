<template>
  <div>
    <el-form class="fix-w" label-width="120px" :model="form" :rules="rules" ref="form" v-loading="isLoading">
      <el-form-item label="规则名称：" prop="RuleTitle">
        <el-input name="RuleTitle" v-model="form.RuleTitle" class="w-238"></el-input>
      </el-form-item>
      <el-form-item label="触发事件：" prop="EventType">
        <el-select name="EventType" v-model="form.EventType" class="w-238">
          <el-option v-for="item in EventTypeOpt" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容：" prop="TextContent">
        <el-input name="TextContent" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" class="w-500 m-t-5" v-model="form.TextContent"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button name="save" type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  MARKETING_API_WEB_CHAT_RULEBYSUBSCRIBEDETAIL, // 微信管理 - 被关注自动回复(详细)
  MARKETING_API_WEB_CHAT_RULEUPDATEBYSUBSCRIBE // 微信管理 - 被关注自动回复(更新)
} from '@/apis/marketing'

import { CharacterType } from '@/enums/common'
import { WxEventType } from '@/enums/component'

export default {
  data() {
    return {
      isLoading: false,
      form: {},
      EventTypeOpt: [],
      rules: {
        RuleTitle: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            min: 1,
            max: 30,
            message: '字数在1-30之间！'
          }
        ],
        EventType: [
          {
            required: true,
            message: '请选择触发事件！'
          }
        ],
        TextContent: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            min: 1,
            max: 300,
            message: '字数在1-300之间！'
          }
        ]
      },
      CharacterType
    }
  },
  // 菜单高亮
  beforeRouteEnter(to, from, next) {
    let character = JSON.parse(decodeURIComponent(localStorage.userInfo))
      .CharacterType
    if (character == CharacterType.Lingcb) {
      to.meta.parentPath = '/setter/wxpublic/index'
    } else {
      to.meta.parentPath = '/setter/wxpublic/replyedit'
    }
    next()
  },
  methods: {
    getEnums() {
      for (let item in WxEventType.Types) {
        this.EventTypeOpt.push({
          label: WxEventType.Types[item],
          value: parseInt(item)
        })
      }
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.isLoading = true
          const obj = Object.assign({}, this.form, this.$route.query)
          MARKETING_API_WEB_CHAT_RULEUPDATEBYSUBSCRIBE(obj).then(res => {
            this.isLoading = false
            if (res.data.Code == 'CORRECT') {
              this.$message.success('保存成功！')
              this.$router.push(`/setter/wxpublic/replyedit?authorizerId=${this.$route.query.authorizerId}`)
            }
          })
        }
      })
    },
    getDetail() {
      const obj = Object.assign({}, this.$route.query)
      MARKETING_API_WEB_CHAT_RULEBYSUBSCRIBEDETAIL(obj).then(res => {
        this.form = res.data.Data
      })
    }
  },
  mounted() {
    this.getDetail()
    this.getEnums()
  }
}
</script>
<style lang="scss" scoped>
.w-500 {
  width: 500px;
}
</style>
