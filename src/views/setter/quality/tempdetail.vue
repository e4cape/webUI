<template>
  <div class='temp-detail'>
    <el-row v-loading="isLoading" type="flex" justify="space-between">
      <el-col :lg="14">
        <ul class="detail-list">
          <li>
            <div class="temp-item-name">门店Logo</div>
            <div class="temp-item-content logo">
              <img :src="detail.LogoUrl ? DOMAIN_IMG_FILE + detail.LogoUrl:''" alt="" />
            </div>
          </li>
          <li>
            <div class="temp-item-name">公司印章全称</div>
            <div class="temp-item-content">
              {{detail.StampTitle}}
            </div>
          </li>
          <li>
            <div class="temp-item-name">质保单协议</div>
            <div class="temp-item-content" v-html="detail.AgreeNote">
            </div>
          </li>
          <li>
            <div class="temp-item-name"></div>
            <div class="temp-item-content">
              <el-button name="tempedit" type="primary" @click="$router.push('/setter/quality/tempedit')">修改</el-button>
            </div>
          </li>
        </ul>
      </el-col>
      <el-col :lg="10">
        <div class="preview">
          <div>
            <img :src="detail.TemplateID == 99?detail.CustomImgUrl:detail.ImageUrl?DOMAIN_IMG_FILE + detail.ImageUrl:''" width="400px" alt="" />
          </div>
          <div>
            <el-button name="preview" type="text" icon="el-icon-search" @click="dialogVisible=true">点击预览</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="质保单预览" :visible.sync="dialogVisible">
      <img :src="detail.TemplateID == 99?detail.CustomImgUrl:DOMAIN_IMG_FILE + detail.ImageUrl" width="100%" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import {
  MARKETING_API_STORE_STAMP_GET 
} from '@/apis/marketing'
import { CharacterType } from '@/enums/common.js'
import {
  DOMAIN_IMG_FILE 
} from '@/configs/appSettings'
export default {
  data() {
    return {
      CharacterType,
      DOMAIN_IMG_FILE,
      detail: {
        ImageUrl: ''
      },
      isLoading: false,
      dialogVisible: false
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
    wechatSettingType() {
      return this.$store.getters.wechatSettingType
    }
  },
  methods: {
    // ...mapGetters(['GET_SITE']),
    getDetail() {
      this.isLoading = true
      MARKETING_API_STORE_STAMP_GET().then(res => {
        this.detail = res.data.Data
        this.detail.LogoUrl = this.detail.LogoUrl.replace('{0}', '240x120')
        this.detail.AgreeNote = this.detail.AgreeNote.replace(/\r?\n/g, '<br>')
        this.isLoading = false
      })
    }
  },
  created() {
    this.getDetail()
  }
}
</script>
<style lang="scss" scoped>
.detail-list {
  margin: 0;
  li {
    display: flex;
    &:last-child {
      .temp-item-name {
        background-color: #fff;
      }
      .temp-item-content {
        border-left: none;
      }
    }
    .temp-item-name {
      padding: 10px;
      display: flex;
      align-items: center;
      width: 125px;
      text-align: left;
      line-height: 1.5;
      border-top: 1px solid #e5e5e5;
      background-color: #f5f5f5;
    }
    .temp-item-content {
      padding: 10px;
      width: 1%;
      flex: 1;
      word-break: break-all;
      line-height: 1.5;
      border-top: 1px solid #e5e5e5;
      border-left: 1px solid #e5e5e5;
      &.logo {
        img {
          width: 240px;
          height: 120px;
          vertical-align: middle;
        }
      }
    }
  }
}
.preview {
  text-align: center;
}
</style>