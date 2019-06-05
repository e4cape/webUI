<template>
  <!-- 进店记录 -->
  <el-dialog title="添加进店记录" :visible.sync="visible" class="elDialog" @close="resetForm('entryRecordForm')">
    <!-- 弹窗内容 start-->
    <div class="modal">
      <div class="usersInfo">
        <user-Info :scope="currUserInfo" :isLink="false"></user-Info>
      </div>
      <div class="title">进店记录</div>
      <el-form :model="entryRecordForm" :rules="entryRecordRules" ref="entryRecordForm" label-width="100px" class="entryRecordForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="进店时间" prop="entryDate" required>
              <el-date-picker
                name="entryDate"
                type="datetime"
                placeholder="请选择"
                v-model="entryRecordForm.entryDate"
                style="width: 100%;"
                format="yyyy-MM-dd hh:mm"
                :clearable="false"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停留时间 " prop="stayMinute">
              <el-input-number name="stayMinute" v-model="entryRecordForm.stayMinute" controls-position="right" :min="1" :max="1440"></el-input-number>
              <span style="marginLeft: 5px">分钟</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="意向商品1">
              <el-col :span="12">
                <el-form-item prop="goodsMaterialId1" style="margin-bottom: 0;">
                  <el-select name="goodsMaterialId1" v-model="entryRecordForm.goodsMaterialId1" placeholder="请选择材质" @change="goodsMaterial1Change">
                    <el-option v-for="(item, index) in $store.getters.materialType.Types" :key="index" :value="index" :label="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="goodsCategoryId1" style="margin-bottom: 0;">
                  <el-select name="goodsCategoryId1" v-model="entryRecordForm.goodsCategoryId1" placeholder="请选择品类" @change="goodsCategory1Change">
                    <el-option v-for="(item, index) in $store.getters.categoryType.Types" :key="index" :value="index" :label="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="意向商品2">
              <el-col :span="12">
                <el-form-item prop="goodsMaterialId2" style="margin-bottom: 0;">
                  <el-select name="goodsMaterialId2" v-model="entryRecordForm.goodsMaterialId2" placeholder="请选择材质" @change="goodsMaterial2Change">
                    <el-option v-for="(item, index) in $store.getters.materialType.Types" :key="index" :value="index" :label="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="goodsCategoryId2" style="margin-bottom: 0;">
                  <el-select name="goodsCategoryId2" v-model="entryRecordForm.goodsCategoryId2" placeholder="请选择品类" @change="goodsCategory2Change">
                    <el-option v-for="(item, index) in $store.getters.categoryType.Types" :key="index" :value="index" :label="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预算价格">
              <el-col :span="10">
                <el-form-item prop="budgetStart" style="margin-bottom: 0;">
                  <el-input-number name="budgetStart" v-model="entryRecordForm.budgetStart" controls-position="right" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="2">~</el-col>
              <el-col :span="10">
                <el-form-item prop="budgetEnd" style="margin-bottom: 0;">
                  <el-input-number name="budgetEnd" v-model="entryRecordForm.budgetEnd" controls-position="right" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="意向商品价格">
              <el-col :span="10">
                <el-form-item prop="goodsPriceStart" style="margin-bottom: 0;">
                  <el-input-number name="goodsPriceStart" v-model="entryRecordForm.goodsPriceStart" controls-position="right" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="2">~</el-col>
              <el-col :span="10">
                <el-form-item prop="goodsPriceEnd" style="margin-bottom: 0;">
                  <el-input-number name="goodsPriceEnd" v-model="entryRecordForm.goodsPriceEnd" controls-position="right" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input name="remark" type="textarea" class="remarkText" v-model="entryRecordForm.remark" placeholder="请输入进店后跟进内容，最多200字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-button name="btnCreate" type="primary" @click="submitEmtryRecordForm('entryRecordForm')" :loading="loading">立即创建</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="recordTable">
        <ul class="entry-record-lists" v-if="recorData.length != 0">
          <li v-for="(item, index) in recorData" :key="index">
            <div class="entry-record-lists-hd">
              <div
                class="left"
              >{{currRecorInfo[index].createTime}} / {{currRecorInfo[index].createUser}}{{$store.getters.wechatSettingType != companyBasicMountType.Store ? ` / ${currRecorInfo[index].storeName}` : ''}}</div>
              <a name="btnDel" class="right" @click="onDeleteEntryRecordClick(currRecorInfo[index].memberEnterLogId)">
                <i class="el-icon-delete"></i>
                删除记录
              </a>
            </div>
            <tabulation :data="item"></tabulation>
          </li>
        </ul>
        <div v-else class="entry-record-b-box">暂无进店记录</div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import userInfo from '@/components/scrm/userInfo.vue'
import tabulation from '@/components/scrm/tabulation.vue'
import dayjs from 'dayjs'
import {
  MEMBERSHIP_API_MEMBERENTERLOG_GETMEMBERENTERLOGLIST,
  MEMBERSHIP_API_MEMBERENTERLOG_DELETEMEMBERENTERLOG,
  MEMBERSHIP_API_MEMBERENTERLOG_CREATE
} from '@/apis/membership.js'
import {
  CompanyBasicMountType
} from '@/enums/merchant'
import { EnableState } from '@/enums/common'
export default {
  props: {
    recordVisible: Boolean,
    currUserInfo: Object
  },
  data() {
    return {
      visible: this.recordVisible,
      companyBasicMountType: CompanyBasicMountType,
      entryRecordForm: {
        memberId: '',
        aliasName: '',
        entryDate: '',
        entryTime: '',
        trueName: '',
        stayMinute: '',
        goodsMaterial1: '',
        goodsCategory1: '',
        goodsMaterial2: '',
        goodsCategory2: '',
        goodsMaterialId1: '',
        goodsCategoryId1: '',
        goodsMaterialId2: '',
        goodsCategoryId2: '',
        budgetStart: 0,
        budgetEnd: 0,
        goodsPriceStart: 0,
        goodsPriceEnd: 0,
        remark: ''
      }, // 存储创建进店记录的值
      entryRecordRules: {
        entryDate: [
          {
            required: true, message: '请选择进店时间', trigger: 'blur'
          }
        ],
        stayMinute: [
          {
            required: true, message: '请输入停留时间', trigger: 'blur'
          }
        ],
        remark: [
          {
            min: 0, max: 200, message: '长度在200个字符内', trigger: 'blur'
          }
        ]
      }, // 创建进店记录校验
      recorData: [], // 进店记录
      currRecorInfo: [],
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  components: {
    userInfo,
    tabulation
  },
  methods: {
    goodsMaterial1Change(val) {
      this.entryRecordForm.goodsMaterial1 = this.$store.getters.materialType.Types[val]
    },
    goodsCategory1Change(val) {
      this.entryRecordForm.goodsCategory1 = this.$store.getters.categoryType.Types[val]
    },
    goodsMaterial2Change(val) {
      this.entryRecordForm.goodsMaterial2 = this.$store.getters.materialType.Types[val]
    },
    goodsCategory2Change(val) {
      this.entryRecordForm.goodsCategory2 = this.$store.getters.categoryType.Types[val]
    },
    // 点击创建进店记录
    submitEmtryRecordForm(formName) {
      if (/.*\..*/.test(this.entryRecordForm.stayMinute)) {
        return this.$message.error('停留时间必须为整数')
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          const para = {
            ...this.entryRecordForm,
            memberId: this.currUserInfo.memberId,
            aliasName: this.currUserInfo.aliasName,
            trueName: this.currUserInfo.trueName,
            entryTime: dayjs(this.entryRecordForm.entryDate).format(
              'YYYY-MM-DD hh:mm'
            )
          }
          MEMBERSHIP_API_MEMBERENTERLOG_CREATE(para).then(res => {
            if (res.data.Code == 'CORRECT') {
              this.$refs[formName].resetFields()
              this.entryRecordForm.goodsMaterial1 = ''
              this.entryRecordForm.goodsCategory1 = ''
              this.entryRecordForm.goodsMaterial2 = ''
              this.entryRecordForm.goodsCategory2 = ''
              this.$message({
                showClose: true,
                message: '成功添加一条记录',
                type: 'success'
              })
              this.getEntryRecord()
            }
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 获取进店记录列表
    getEntryRecord() {
      const para = {
        memberId: this.currUserInfo.memberId
      }
      MEMBERSHIP_API_MEMBERENTERLOG_GETMEMBERENTERLOGLIST(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          const recorData = []
          const currRecorInfo = []
          res.data.Data.forEach(item => {
            const arr = [
              [
                {
                  title: '进店时间',
                  content: item.entryTime
                },
                {
                  title: '停留时间',
                  content: item.stayMinute
                }
              ],
              [
                {
                  title: '意向商品1',
                  content: `${item.goodsMaterial1 ||
                    ''} ${item.goodsCategory1 || ''}`
                },
                {
                  title: '意向商品2',
                  content: `${item.goodsMaterial2 ||
                    ''} ${item.goodsCategory2 || ''}`
                }
              ],
              [
                {
                  title: '预算价格',
                  content: `${item.budgetStart ? `${item.budgetStart || ''} ~ ${item.budgetEnd || ''}` : ''}`
                },
                {
                  title: '意向商品价格',
                  content: `${item.goodsPriceStart ? `${item.goodsPriceStart} ~ ${item.goodsPriceEnd}` : ''}`
                }
              ],
              [
                {
                  title: '备注',
                  content: item.remark,
                  colspan: 3
                }
              ]
            ]
            const obj = {
              createTime: item.createTime,
              createUser: item.createUser,
              memberEnterLogId: item.memberEnterLogId,
              storeName: item.storeName
            }
            recorData.push(arr)
            currRecorInfo.push(obj)
          })
          this.recorData = recorData
          this.currRecorInfo = currRecorInfo
        }
      })
    },
    // 删除进店记录
    onDeleteEntryRecordClick(memberEnterLogId) {
      const para = {
        memberEnterLogId
      }
      MEMBERSHIP_API_MEMBERENTERLOG_DELETEMEMBERENTERLOG(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            showClose: true,
            message: '成功删除记录',
            type: 'success'
          })
          this.getEntryRecord()
        }
      })
    },
    // 获取材质列表
    getMaterialList() {
      this.$store.dispatch('GET_MATERIAL_TYPE', EnableState.Enable)
    },
    // 获取品类列表
    getCategoryList() {
      this.$store.dispatch('GET_CATEGORY_TYPE', EnableState.Enable)
    },
    // modal关闭前重置form的值
    resetForm(formName) {
      this.$emit('closeClick', false)
      this.$refs[formName].resetFields()
    }
  },
  watch: {
    recordVisible(val) {
      this.visible = val
      if (val) {
        this.getEntryRecord()
        this.getMaterialList()
        this.getCategoryList()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.usersInfo {
  padding: 10px;
}
.modal {
  .title {
    height: 38px;
    line-height: 38px;
    padding-left: 15px;
    border-bottom: 1px solid #ddd;
    border-top: 1px solid #ddd;
    font-size: 14px;
    font-weight: bold;
    background: #f5f5f5;
  }
  .entryRecordForm {
    padding-right: 16px;
    padding-top: 20px;
    .remarkText {
      textarea {
        min-height: 100px !important;
      }
    }
  }
}
.elDialog {
  /deep/ .el-dialog__body {
    padding: 0 !important;
  }
  /deep/ .el-dialog {
    min-width: 750px;
  }
}
.entry-record-b-box {
  height: 339px;
  line-height: 339px;
  margin-top: 10px;
  border-top: 1px solid #ddd;
  text-align: center;
}
.recordTable {
  padding: 0 15px;
  .entry-record-lists {
    height: 339px;
    border-top: 1px solid #ddd;
    margin-top: 10px;
    overflow: auto;
    margin-bottom: 15px;
    padding-right: 15px;
    padding-left: 15px;
    .entry-record-lists-hd {
      zoom: 1;
      height: 40px;
      line-height: 40px;
      .left {
        float: left;
        font-size: 12px;
      }
      .right {
        float: right;
        font-size: 12px;
      }
    }
  }
}
</style>