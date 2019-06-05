<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">小程序首页</span>
      </div>
      <div class="panel-bd">
        <div class="state-wchat border-b">
          <span>广告状态：</span>
          <el-switch name="switchAdv" v-model="defaultAdv.status" @change="saveAdv(true)" :active-value="10" :inactive-value="0"></el-switch>
          <span class="state-color m-l-10">{{defaultAdv.status?'已开启':'已关闭'}}</span>
        </div>
        <el-row class="border-b">
          <el-col :span="12" style="min-width: 500px;">
            <div class="state-wchat">
              <span>广告标题：</span>
              <el-input :disabled="!titleEditFlg" :maxlength="15" class="m-r-5" style="width: 260px;" v-model="defaultAdv.title"></el-input>
              <el-button v-if="!titleEditFlg" @click="EditAdv('title')" type="text">编辑</el-button>
              <template v-else>
                  <el-button name="btnSaveAdv" @click="saveAdv(false)" type="text">保存</el-button>
                <el-button name="btnCancelAdv" @click="cancelAdv" type="text">取消</el-button>
              </template>
            </div>
            <div class="state-wchat">
              <span>广告图片：</span>
              <span class="gray-color">（宽750px高270px）</span>
            </div>
            <el-upload name="handleAvatar" class="adbanner-uploader" :action="imgurlup+''" :headers="{'access-token': $store.getters.access_token}" accept="image/png,image/jpeg,image/jpg" :show-file-list="false" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :before-upload="beforeAvatarUpload">
              <div class="nei">
                <img style="width: 100%;" v-if="defaultAdv.imageUrl" :src="$root.settings.DOMAIN_IMAGE + defaultAdv.imageUrl" alt="">
                <i v-else class="el-icon-plus"></i>
              </div>
            </el-upload>
            
          </el-col>
          <el-col :span="12" style="max-width: calc(100% - 500px);">
            <div style="margin: 16px 0 16px;" class="m-b-10">
              <span>广告显示时间：</span>
            </div>
            <div>
              <span>开始：</span>
              <el-date-picker style="width: 150px;" :disabled="!timeEditFlg" type="date" placeholder="选择时间" v-model="defaultAdv.timeStart"></el-date-picker>
              <span class="m-l-5">结束：</span>
              <el-date-picker style="width: 150px;" :disabled="!timeEditFlg" type="date" placeholder="选择时间" v-model="defaultAdv.timeEnd"></el-date-picker>
            </div>
            <el-button name="btnEdit" v-if="!timeEditFlg" @click="EditAdv" type="text">编辑</el-button>
            <template v-else>
              <el-button name="btnSave" @click="saveAdv(false)" type="text">保存</el-button>
              <el-button name="btnCancel" @click="cancelAdv" type="text">取消</el-button>
            </template>
          </el-col>
        </el-row>
        <!-- <div class="state-wchat border-b">
          <span>广告内容：</span>
          <el-radio v-model="aaa" :label="1">节假日专场</el-radio>
        </div> -->
        
        <div class="state-wchat">
          <el-button type="primary" @click="selectGiftDialog = true">选择礼品</el-button>
          <el-dropdown @command="handleCommand">
            <el-button type="primary">批量操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="remove">批量移除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="m-l-10" style="color: #aaa;">注：最多可选择100个礼品</span>
        </div>
        <el-table :data="data" @selection-change="selectChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column min-width="50">
            <template slot-scope="scope">
              <el-popover popper-class="big-img" placement="right" trigger="hover" >
                <div>
                  <img :src="scope.row.imageUrl ? $root.settings.DOMAIN_IMAGE + scope.row.imageUrl.replace('{0}', '1080x0') : $root.settings.DOMAIN_IMAGE +  '/default/goods/150x150.jpg'" alt="" />
                </div>
                <div class="fl item-img" slot="reference" >
                  <img :src="scope.row.imageUrl ? $root.settings.DOMAIN_IMAGE + scope.row.imageUrl.replace('{0}', '50x50') : $root.settings.DOMAIN_IMAGE +  '/default/goods/50x50.jpg'" alt=""/>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="StoreBarCode" label="礼品名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="clearfix" @click="giftDetail(scope.row.giftId)" >
                <div class="show2line tl" style="width:calc(100% - 40px)" >
                  <div>
                    <span class="init-button-text text-overflow">{{scope.row.giftName}}</span>
                    <br />
                    <span class="init-button-text text-overflow w-100">{{scope.row.barCode}}</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="categoryText" label="分类" show-overflow-tooltip></el-table-column>
          <el-table-column prop="supplierName" label="供应商" show-overflow-tooltip></el-table-column>
          <el-table-column prop="retailPrice" label="价格" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">    
              <p>{{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}}<span>{{scope.row.wholesalePrice || '-'}}</span></p>
              <p>建议零售价：<span>{{scope.row.retailPrice || '-'}}</span></p>
            </template>
          </el-table-column>
          <el-table-column prop="orderQty" label="销量" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.createTime | filterDate}}
            </template>
          </el-table-column>
          <el-table-column prop="onlineStatusText" label="状态" show-overflow-tooltip></el-table-column>
          <el-table-column prop="StoreBarCode" label="操作" show-overflow-tooltip width="100">
            <template slot-scope="scope">
              <el-button name="btnRemove" type="text" @click="adRemove([scope.row.advGiftId])">移除</el-button>
              <el-button name="btnTotop" type="text" v-if="scope.$index !=0 || pg != 1" @click="adToup(scope.row.advGiftId)">置顶</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total" :pg="pg" :size="size" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      </div>
      <!-- @module 查看礼品 -->
      <el-dialog title="查看礼品" :visible.sync="gidtDetaileDialog" :before-close="detailShowCancel" width="458px" v-loading="dialogLoading" element-loading-text="拼命加载中">
        <show-detail :data="detailInfo" ref="showDetail"></show-detail>
      </el-dialog>
      <!-- @module 查看礼品 -->
      <select-gifts v-if="selectGiftDialog" :advBasicId="defaultAdv.advBasicId" :selectGiftDialog="selectGiftDialog" @listenSelectGifts="listenSelectGifts"></select-gifts>
    </div>
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
import showDetail from '@/components/gifting/showDetail.vue'
import selectGifts from '@/components/gifting/selectGifts.vue'
import {
  GIFTING_API_GIFT_GETDETAILBYSTORE,
  GIFTING_API_ADVBASIC_GETDEFAULTADV,
  GIFTING_API_ADVBASIC_SEARCHADVGIFTS,
  GIFTING_API_ADVBASIC_BATCHREMOVEADVGIFT,
  GIFTING_API_ADVBASIC_SETADVGIFTTOP,
  GIFTING_API_ADVBASIC_BATCHADDADVGIFT,
  GIFTING_API_ADVBASIC_SAVEADV
} from '@/apis/gifting'
import {
  ImageUploadPaths 
} from '@/enums/gifting'
import {
  YNStatus
} from '@/enums/common'
export default {
  data() {
    return {
      OpenTime: '',
      imgurlup: this.$root.settings.DOMAIN_APIS.Gifting + '/api/Uploader/UploadImageAsync?pathType=' + ImageUploadPaths.Advertisement,
      selectGiftDialog:  false,
      titleEditFlg: false,
      timeEditFlg: false,
      queryForm: {
        orderField: 'createTime',
        orderType: YNStatus.No,
        pageSize: 1,
        pageIndex: 10
      },
      pg: 1,
      size: 10,
      total: 0,
      gidtDetaileDialog: false,
      dialogLoading: false,
      defaultAdv: {
      },
      oldAdvDetail: {
      },
      detailInfo: {
      },
      selectData: [],
      data: []
    }
  },
  methods: {
    getDefaultAdv () {
      GIFTING_API_ADVBASIC_GETDEFAULTADV().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.defaultAdv = res.data.Data
          this.getData()
        }
      })
    },
    getData() {
      GIFTING_API_ADVBASIC_SEARCHADVGIFTS({
        advBasicId: this.defaultAdv.advBasicId,
        pageIndex: this.pg,
        pageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.total || 0
          this.data = res.data.Data.rows
        }
      })
    },
    saveAdv (saveAdvFlg) {
      if (this.titleEditFlg && this.timeEditFlg || (saveAdvFlg && (this.titleEditFlg || this.timeEditFlg))) {
        this.$message.error('请先保存数据')
        if (saveAdvFlg) {
          this.defaultAdv.status = this.defaultAdv.status == 0 ? 10 : 0
        }
      } else if (Date.parse(this.defaultAdv.timeStart) > Date.parse(this.defaultAdv.timeEnd)) {
        this.$message.error('结束时间不能小于开始时间')
      } else if (!this.defaultAdv.title || !this.defaultAdv.title.trim()) {
        this.$message.error('请输入标题')
      } else if (!this.defaultAdv.timeEnd || !this.defaultAdv.timeStart) {
        this.$message.error('请选择时间')
      } else {
        this.defaultAdv.title = this.defaultAdv.title.trim()
        GIFTING_API_ADVBASIC_SAVEADV(this.defaultAdv).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('保存成功')
            this.titleEditFlg = false
            this.timeEditFlg = false
          }
        })
      }
    },
    EditAdv (value) {
      if (this.titleEditFlg || this.timeEditFlg) {
        this.$message.error('请先保存数据')
        return
      }
      if (value == 'title') {
        this.titleEditFlg = true
      } else {
        this.timeEditFlg = true
      }
      this.oldAdvDetail = {
        ...this.defaultAdv
      }
    },
    cancelAdv () {
      this.defaultAdv = {
        ...this.oldAdvDetail
      }
      this.titleEditFlg = false
      this.timeEditFlg = false
    },
    adRemove (ids) {
      console.log(ids)
      this.$confirm('确定移除此货品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        GIFTING_API_ADVBASIC_BATCHREMOVEADVGIFT(ids).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('移除成功')
            this.getData()
          }
        })
      }).catch()
    },
    adToup (id) {
      GIFTING_API_ADVBASIC_SETADVGIFTTOP({
        advGiftId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('提交成功')
          this.getData()
        }
      })
    },
    handleCommand (res) {
      if (res === 'remove') {
        if(this.selectData.length) {
          let ids = []
          this.selectData.forEach(item => {
            ids.push(item.advGiftId + '')
          })
          this.adRemove(ids)
        } else {
          this.$message.error('请选择数据')
        }
      }
    },
    giftDetail(v) {
      this.dialogLoading = true
      this.gidtDetaileDialog = true
      GIFTING_API_GIFT_GETDETAILBYSTORE(v).then(res => {
        this.dialogLoading = false
        if (res.data.Code === 'CORRECT') {
          this.detailInfo = res.data.Data
        }
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    detailShowCancel(done) {
      this.$refs['showDetail'].initActiveTab()
      done()
      this.detailInfo = ''
    },
    selectChange(selection) {
      this.selectData = selection
    },
    currentChange(val) {
      // 切换当前页
      this.pg = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.pg = 1
      this.size = val
      this.getData()
    },
    dateChange() {
      this.getData()
      this.getPeriodBalance()
    },
    // 上传成功的方法
    handleAvatarSuccess(res) {
      if (res.Code === 'CORRECT') {
        this.defaultAdv.imageUrl = res.Data[0]
        this.saveAdv()
      } else {
        this.$message.error(res.Message)
      }
      this.btnLoading = false
    },
    // 上传失败的方法
    handleAvatarError() {
      this.$message.error('上传失败，请稍后重试！！！')
      this.btnLoading = false
      this.serviceBtnLoading = false
    },
    // 上传图片校验
    beforeAvatarUpload(file) {
      this.btnLoading = true
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        this.btnLoading = false
        return false
      }
      if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确文件')
        this.btnLoading = false
        return false
      }
    },
    sortChange(sort) {
      // 表单排序
      this.queryForm.orderField = sort.prop
      this.queryForm.orderType = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getData()
    },
    listenSelectGifts (value) {
      if (!value) {
        this.selectGiftDialog = false
        return
      }
      GIFTING_API_ADVBASIC_BATCHADDADVGIFT({
        advBasicId: this.defaultAdv.advBasicId,
        giftIds: value
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('添加成功')
          this.getData()
        }
      })
    }
  },
  mounted() {
    this.getDefaultAdv()
    this.getData()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    showDetail,
    selectGifts
  }
}
</script>

<style lang="scss" scoped>
.state-wchat {
  padding: 16px!important;
}
.state-color {
  color: #ffa200;
}
.gray-color {
  font-size: 12px;
  color: #999999;
}
.border-b {
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e5e5;
}
.adbanner-uploader {
  margin-left: 16px;
  height: 169px;
  overflow: hidden;
  .nei {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 470px;
    height: 169px;
    overflow: hidden;
    border: 1px dashed #e5e5e5;
    .el-icon-plus {
      font-size: 20px;
    }
  }
  .nei:hover {
    border-color: #409EFF;
    .el-icon-plus {
      color: #409EFF;
    }
  }
}
.item-img {
  width: 50px;
  height: 50px;
  img {
    width: 100%;
    height: 100%;;
  }
}
</style>