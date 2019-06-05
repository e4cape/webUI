<template>
  <div class="content">
    <div class="p-x-10 p-y-15 tool">
      <el-button
        name="btnDialogUpLoad"
        @click="dialogUpLoad = true"
        type="primary"
        icon="fa fa-plus"
      > 上传样式</el-button>
      <el-button
        name="btnDeleteCouponSty"
        class="to-tight"
        type="default"
        icon="fa fa-minus"
        @click="deleteCouponSty"
      > 删除卡面</el-button>
    </div>
    <div class="border-1px p-20">
      <ul
        class="template-list clearfix"
        v-loading="tbloading"
      >
        <li
          v-for="(item, index) in TemplateList"
          @click="onSelected(item.StyleId)"
          :key="index"
        >
          <img
            :src="imgList(item)"
            alt=""
          >
          <p>{{item.StyleId}}</p>
          <i
            class="el-icon-check select"
            :style="checkList.indexOf(item.StyleId)!=-1?'display:block':''"
          ></i>
        </li>
      </ul>
    </div>
    <pagination
      :total="total"
      :pg="page.PageIndex"
      :size="page.PageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
    <el-dialog
      title="上传样式"
      :visible.sync="dialogUpLoad"
      @close="handleClose"
      width="500px"
    >
      <uploadImgMulti
        ref="uploadMulti"
        :Root="$root.filePaths.SCORING_SETTING"
        @uploadSucc="uploadSucc"
      >点击上传</uploadImgMulti>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="btnSaveUpLoad"
          type="primary"
          :loading="loadingBtn"
          @click="saveUpLoad"
          :disabled="disableIf"
        >确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  SCORING_API_COUPON_SETTING_STYLE_GETS, // 卡券样式 - 检索
  SCORING_API_COUPON_SETTING_STYLE_CREATE, // 卡券样式 - 创建
  SCORING_API_COUPON_SETTING_STYLE_ABANDON // 卡券样式 - 作废(主键行锁)
} from '@/apis/scoring.js'

import pagination from '@/components/pagination.vue'
import uploadImgMulti from '@/components/common/uploadImgMulti'

export default {
  components: {
    pagination,
    uploadImgMulti
  },
  data() {
    return {
      tbloading: false,
      imageUrl: [],
      activeIndex: '2',
      page: {
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      checkList: [],
      TemplateList: [],
      StyleIds: [],
      dialogUpLoad: false,
      disableIf: true, // 上传未完成时，不能点击
      loadingBtn: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    uploadSucc(Keys) {
      this.imageUrl = Keys || []
      if (this.imageUrl.length > 0) {
        this.disableIf = false
      } else {
        this.disableIf = true
      }
    },
    getList() {
      this.tbloading = true
      this.checkList = []
      SCORING_API_COUPON_SETTING_STYLE_GETS(
        Object.assign({}, this.page, {
          IsAsced: 1
        })
      )
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.TemplateList = res.data.Data.Rows
            this.total = res.data.Data.Count || 0
          }
          this.tbloading = false
        })
        .catch(() => {
          this.tbloading = false
        })
    },
    saveUpLoad() {
      if (this.imageUrl.length < 1) {
        this.$message.warning('请上传样式')
        return false
      }
      this.loadingBtn = true
      SCORING_API_COUPON_SETTING_STYLE_CREATE({
        ImageUrl: this.imageUrl
      })
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.getList()
            this.imageUrl = []
            this.$refs.uploadMulti.$refs.uploadImgMulti.clearFiles()
            this.dialogUpLoad = false
            this.disableIf = true
          }
          this.loadingBtn = false
        })
        .catch(() => (this.loadingBtn = false))
    },
    imgList(data) {
      // return DOMAIN_IMAGE + data.ImageUrl.replace('{0}', '350x150')
      return this.$root.settings.DOMAIN_IMG_FILE + data.ImageUrl
    },
    onSelected(val) {
      let ary = this.checkList
      if (this.checkList.indexOf(val) != -1) {
        const len = ary.indexOf(val)
        ary.splice(len, 1)
      } else {
        ary.push(val)
      }
    },
    deleteCouponSty() {
      if (this.checkList.length > 0) {
        this.$confirm('确定要删除吗?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.isLoading = true
            SCORING_API_COUPON_SETTING_STYLE_ABANDON({
              DataIds: this.checkList
            }).then(res => {
              if (res.data.Code == 'CORRECT') {
                this.$message({
                  type: 'success',
                  message: '删除成功！'
                })
                this.getList()
              }
            })
          })
          .catch(() => {})
      } else {
        this.$message({
          type: 'warning',
          message: '请选择需要删除的卡券样式'
        })
      }
    },
    handleClose() {
      this.imageUrl = []
      this.$refs.uploadMulti.$refs.uploadImgMulti.clearFiles()
      this.dialogUpLoad = false
      this.disableIf = true
    },
    sizeChange(val) {
      this.page.PageSize = val
      this.page.PageIndex = 1
      this.getList()
    },
    currentChange(val) {
      this.page.PageIndex = val
      this.getList()
    }
  }
}
</script>
<style scoped lang="scss">
.template-list {
  li {
    position: relative;
    float: left;
    cursor: pointer;
    width: 350px;
    height: 150px;
    margin: 0 22px 50px 22px;
    text-align: center;
    font-size: 14px;
    img {
      width: 350px;
      height: 150px;
    }
    .select {
      position: absolute;
      right: 10px;
      top: 10px;
      color: #1afa29;
      font-size: 30px;
      display: none;
    }
  }
}
.avatar-uploader-box {
  .avatar-img {
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.ul-list {
  li {
    float: left;
    margin-left: 10px;
    margin-top: 20px;
    width: 160px;
    height: 70px;
    &:nth-of-type(1) {
      margin-left: 5px;
    }
    &:nth-of-type(6) {
      margin-left: 5px;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.dec-sty {
  position: absolute;
  top: 0px;
  left: 270px;
}
.mask {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 100;
  line-height: 2;
  align-items: center;
  justify-content: center;
}
.font-sty {
  font-size: 24px;
  color: #ffffff;
}
.to-tight {
  float: right;
}
</style>
<style lang="scss">
.dialog-val-box .el-form-item--mini .el-form-item__error {
  margin-left: 90px;
}
</style>
