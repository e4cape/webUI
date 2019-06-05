<template>
  <div class="data-mining clearfix">
    <div class="left">
      <div class="hd">
        数据分组
        <el-button name="btnCreateUpdate" @click="createUpdate('create')">新建分组</el-button>
      </div>
      <div v-loading="loadingLeft">
        <ul :class="dataGroup.length>20 ? 'bd sp': 'bd' ">
          <li
            name="clickGetGroupItemsByGroupId"
            v-for="(item,index) in dataGroup"
            @click="getGroupItemsByGroupId(item.settingTagGroupId,item.name,index)"
            :class="form.settingTagGroupId == item.settingTagGroupId ? 'on' : ''"
            :key="item.settingTagGroupId"
            :title="item.name"
          >
            {{item.name}}
            <i name="clickDeletes" class="el-icon-circle-close" @click.stop="deletes(item.settingTagGroupId)"></i>
          </li>
        </ul>
      </div>
    </div>
    <div class="right">
      <el-card shadow="never" v-loading="loadingRightTop">
        <div slot="header" class="clearfix">
          <span>标签</span>
          <el-button name="btnCreateUpdates" type="text" @click="createUpdate('update')" class="modify">修改</el-button>
        </div>
        <ul class="labels">
          <li v-for="item in currentLabel" :key="item.settingTagGroupItemId">
            <el-button name="btnTagName">{{item.tagName}}</el-button>
          </li>
        </ul>
      </el-card>
      <el-card shadow="never" class="cardsp">
        <div class="operations">
          <el-button name="btnVisiblemsgMarketingModal" type="primary" @click="visiblemsgMarketingModal = true">发送营销短信</el-button>
          <el-button name="btnTaskParams" type="primary" @click="TaskParams.dialog = true">创建回访任务</el-button>
          <!-- <el-button
            type="primary"
            @click="beforeCreateDialog = true"
          >赠送优惠券</el-button>-->
          <member-Export :records="selectTable" :apiParameter="form" :apiKey="apiKey" :exportSelectIf="true" class="m-l-10"></member-Export>
          <div class="noshow">
            <el-checkbox name="checkExceptEmptyMobile" v-model="form.exceptEmptyMobile" @change="exceptEmptyMobileChange">不显示无手机号的会员</el-checkbox>
          </div>
        </div>
      </el-card>
      <el-table :data="tableData" @sort-change="sortChange" v-loading="$store.getters.tb_loading">
        <el-table-column label="基本信息" min-width="400" fixed>
          <template slot-scope="scope">
            <user-Info :scope="scope.row"></user-Info>
          </template>
        </el-table-column>
        <el-table-column label="关注时间" prop="subscrTime" min-width="150" show-overflow-tooltip sortable></el-table-column>
        <el-table-column label="入会日期" prop="joinTime" min-width="150" show-overflow-tooltip sortable></el-table-column>
        <el-table-column label="距今入会天数" prop="joinDays" min-width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column label="年龄" prop="age" min-width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column label="生日" prop="dateOfBirthText" min-width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column label="距今生日天数" prop="birthDays" min-width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column label="最近消费日期" prop="expendLast" min-width="150" show-overflow-tooltip sortable></el-table-column>
        <el-table-column label="最近消费距今天数" prop="expendDays" min-width="150" show-overflow-tooltip sortable></el-table-column>
        <el-table-column label="累计消费金额" prop="expendPrice" min-width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column label="累计消费次数" prop="expendTimes" min-width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column label="退货次数" prop="orderRetrunTimes" min-width="100" show-overflow-tooltip sortable></el-table-column>
      </el-table>
      <pagination :total="total" :pg="form.pageIndex" :size="form.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
    <el-dialog :title="title" :visible.sync="visibleCreateUpdate" width="800px" class="dialog-create-update">
      <div v-loading="loadingCreateUpdate">
        <div class="thename">
          <el-form :model="createUpdateForm" :rules="createUpdateRule" ref="createUpdateForm" label-width="100px">
            <el-form-item label="分组名称" prop="name">
              <el-input name="inputName" v-model="createUpdateForm.name" maxlength="50"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="thelabel">
          <div class="hd">
            <i class="el-icon-caret-bottom"></i>
            <span>*</span>标签（请选择）
          </div>
          <div class="bd">
            <div class="con">
              <dl class="clearfix" v-for="(item,i) in allTagTypeWithSettingTag" :key="item.tagType">
                <dt>{{item.tagTypeText}}</dt>
                <dd v-if="item.settingTags.length<=5">
                  <span
                    :class="checkLabelIfArr[i][j] ? 'checked': ''"
                    v-for="(itemChild,j) in item.settingTags"
                    @click="checkLabel(i,j)"
                    :key="itemChild.settingTagId"
                    v-show="itemChild.name != ''"
                  >{{itemChild.name}}</span>
                </dd>
                <dd v-else>
                  <span
                    :class="checkLabelIfArr[i][j] ? 'checked': ''"
                    v-for="(itemChild,j) in item.settingTags.slice(0,5)"
                    @click="checkLabel(i,j)"
                    :key="itemChild.settingTagId"
                    v-show="isAir(itemChild)"
                  >{{itemChild.name}}</span>
                  <span v-if="!moreIfArr[i]" @click="showMore(i)">更多...</span>
                  <span
                    :class="checkLabelIfArr[i][k+5] ? 'checked': ''"
                    v-show="moreIfArr[i]"
                    v-for="(itemChild,k) in item.settingTags.slice(5)"
                    @click="checkLabel(i,k+5)"
                    :key="itemChild.settingTagId"
                  >{{itemChild.name}}</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnSave" type="primary" @click="save" :loading="$store.getters.is_loading">保存</el-button>
        <el-button name="btnCancel" @click="visibleCreateUpdate = false">取消</el-button>
      </span>
    </el-dialog>
    <msgMarketingModal
      title="发送营销短信"
      v-if="visiblemsgMarketingModal"
      :visiblemsgMarketingModal="visiblemsgMarketingModal"
      @listenVisiblemsgMarketingModal="visiblemsgMarketingModal = false"
      :settingTagGroupId="form.settingTagGroupId"
      :exceptEmptyMobile="form.exceptEmptyMobile"
    />
    <createVisitTask v-if="TaskParams.dialog" :TaskParams="TaskParams" @listenVisitTask="listenCreateVisitTask"></createVisitTask>
    <giveCoupon-create title="新建" v-if="beforeCreateDialog" :beforeCreateDialog="beforeCreateDialog" @listenCreateDialog="listenCreateDialog"></giveCoupon-create>
    <basic-edit
      title="选择赠送优惠券原因"
      v-if="editDialog"
      :editDialog="editDialog"
      :editForm="editForm"
      :couponCreateRow="couponCreateRow"
      @listenEditDialog="listenEditDialog"
      :dataMiningMsg="dataMiningMsg"
    ></basic-edit>
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
import userInfo from '@/components/scrm/userInfo'
import msgMarketingModal from '@/components/scrm/msgMarketingModal'
import createVisitTask from '../../member/visitTask/createTask'
import giveCouponCreate from '../giveCoupon/giveCouponCreate'
import basicEdit from '../giveCoupon/giveCouponBasicEdit'
import memberExport from '@/components/scrm/memberExport'
import {
  MEMBERSHIP_API_SETTINGTAGGROUP_GETALL,
  MEMBERSHIP_API_SETTINGTAGGROUP_DELETE,
  MEMBERSHIP_API_SETTINGTAGGROUP_GETGROUPITEMSBYGROUPID,
  MEMBERSHIP_API_SETTINGTAG_GETALLTAGTYPEWITHSETTINGTAG,
  MEMBERSHIP_API_SETTINGTAGGROUP_CREATE,
  MEMBERSHIP_API_SETTINGTAGGROUP_UPDATE,
  MEMBERSHIP_API_DATAANALYSIS_GETANALYSISMEMBERLIST,
  MEMBERSHIP_API_VISITTASK_CREATEWITHTAGGROUP
} from '@/apis/membership'
import { YNStatus } from '@/enums/common'
export default {
  data() {
    return {
      loadingLeft: false, // 左边loading状态
      loadingRightTop: false, // 右上loading状态
      dataGroup: [], // 数据分组数据
      currentLabel: [], // 当前分组项的标签
      currentName: '', // 当前分组项名字
      createIf: null, // 新建否
      loadingCreateUpdate: false, // 新建修改分组loading
      title: '', // 新建/修改弹窗名字
      visibleCreateUpdate: false, // 新建/修改分组弹窗显隐
      // 新建/修改弹窗之name
      createUpdateForm: {
        name: ''
      },
      // 新建/修改弹窗之name设置
      createUpdateRule: {
        name: [
          {
            required: true, message: '请输入分组名称', trigger: 'blur'
          }
        ]
      },
      allTagTypeWithSettingTag: [], // 所有标签类型及标签设置
      moreIfArr: [], // 更多否
      checkLabelIfArr: [], // 标签选中否
      visiblemsgMarketingModal: false, // 发送营销短信显隐
      TaskParams: {
        // 创建回访任务
        dialog: false,
        params: {
        }
      },
      // 赠送优惠券
      editForm: {
      },
      beforeCreateDialog: false,
      editDialog: false,
      apiKey: 'DATAANALYSIS_GETANALYSISMEMBERLIST', // 导出api
      selectTable: [], // 导出列
      // 表格分页相关
      form: {
        settingTagGroupId: 0, // 当前数据分组id
        exceptEmptyMobile: false, // 排除无手机号码客户
        orderField: 'subscrTime',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 10
      },
      parameter: {
      },
      tableData: [],
      total: 0
    }
  },
  computed: {
    dataMiningMsg() {
      const {
        settingTagGroupId, exceptEmptyMobile
      } = this.form
      return {
        settingTagGroupId,
        exceptEmptyMobile
      }
    }
  },
  mounted() {
    this.getAll()
  },
  methods: {
    // 发送营销短信
    listenCreateVisitTask(data) {
      if (!data) {
        this.TaskParams.dialog = false
        return false
      }
      this.createVisitTaskConfirm(data)
    },
    createVisitTaskConfirm(data) {
      const {
        settingTagGroupId, exceptEmptyMobile
      } = this.form
      const param = {
        settingTagGroupId,
        exceptEmptyMobile,
        ...data
      }
      MEMBERSHIP_API_VISITTASK_CREATEWITHTAGGROUP(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.TaskParams.dialog = false
          this.$router.push({
            path: '/member/visitTask/visitTaskEdit',
            query: {
              id: res.data.Data
            }
          })
        }
      })
    },
    // 赠送优惠券
    listenCreateDialog(obj) {
      this.beforeCreateDialog = false
      if (obj) {
        this.editDialog = true
        this.couponCreateRow = obj
      }
    },
    isAir(itemChild) {
      if (itemChild.name.replace(/\s*/g, '') == '') {
        return false
      } else {
        return true
      }
    },
    listenEditDialog() {
      this.editDialog = false
    },
    // 获取门店所有数据分组
    getAll(type) {
      // 'update'修改保存后获取
      this.loadingLeft = true
      MEMBERSHIP_API_SETTINGTAGGROUP_GETALL().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.dataGroup = res.data.Data
          if (type == 'update') {
            this.getGroupItemsByGroupId(
              this.form.settingTagGroupId,
              this.currentName
            )
          } else {
            this.form.settingTagGroupId = res.data.Data[0].settingTagGroupId
            this.createUpdateForm.name = res.data.Data[0].name
            this.currentName = res.data.Data[0].name
            this.getGroupItemsByGroupId(
              res.data.Data[0].settingTagGroupId,
              res.data.Data[0].name
            )
          }
        }
        this.loadingLeft = false
      })
    },
    // 删除分组
    deletes(id) {
      this.$confirm('确定删除?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        MEMBERSHIP_API_SETTINGTAGGROUP_DELETE(id).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.getAll()
          }
          this.$store.commit('SET_FULL_LOADING', false)
        })
      })
    },
    // 获取数据分组明细
    getGroupItemsByGroupId(id, name) {
      this.loadingRightTop = true
      MEMBERSHIP_API_SETTINGTAGGROUP_GETGROUPITEMSBYGROUPID(id).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form.settingTagGroupId = id
          this.createUpdateForm.name = name
          this.currentName = name
          this.currentLabel = res.data.Data

          this.parameter.pageSize = 10
          this.parameter.pageIndex = 1
          this.getData()
        }
        this.loadingRightTop = false
      })
    },
    // 获取所有标签类型及标签设置
    getAllTagTypeWithSettingTag() {
      MEMBERSHIP_API_SETTINGTAG_GETALLTAGTYPEWITHSETTINGTAG().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.allTagTypeWithSettingTag = res.data.Data
          this.checkLabelIfArr = []
          for (let i = 0; i < res.data.Data.length; i++) {
            this.checkLabelIfArr.push([])
          }
          if (
            !this.createIf &&
            this.currentLabel.length > 0 &&
            this.allTagTypeWithSettingTag.length > 0 &&
            this.checkLabelIfArr.length > 0
          ) {
            for (let i = 0; i < this.currentLabel.length; i += 1) {
              for (
                let j = 0;
                j < this.allTagTypeWithSettingTag.length;
                j += 1
              ) {
                if (
                  this.currentLabel[i].tagType ==
                  this.allTagTypeWithSettingTag[j].tagType
                ) {
                  for (
                    let k = 0;
                    k < this.allTagTypeWithSettingTag[j].settingTags.length;
                    k += 1
                  ) {
                    if (
                      this.currentLabel[i].tagName ==
                      this.allTagTypeWithSettingTag[j].settingTags[k].name
                    ) {
                      this.$set(this.checkLabelIfArr[j], k, true)
                    }
                  }
                }
              }
            }
          }
        }
        this.loadingCreateUpdate = false
      })
    },
    // 新建修改
    createUpdate(type) {
      this.visibleCreateUpdate = true
      this.loadingCreateUpdate = true
      if (type == 'create') {
        this.title = '新建分组'
        this.createIf = true
        this.createUpdateForm.name = ''
      } else {
        this.title = '修改分组'
        this.createIf = false
        this.createUpdateForm.name = this.currentName
      }
      this.moreIfArr = []
      this.getAllTagTypeWithSettingTag()
    },
    // -显示更多
    showMore(i) {
      this.$set(this.moreIfArr, i, true)
    },
    // -标签check
    checkLabel(i, j) {
      this.$set(this.checkLabelIfArr[i], j, !this.checkLabelIfArr[i][j])
    },
    // -保存
    save() {
      this.$refs['createUpdateForm'].validate(valid => {
        if (!valid) { return }
        this.$store.commit('SET_BTN_LOADING', true)
        let param = {
        }
        let settingTagGroupItems = []
        for (let i = 0; i < this.checkLabelIfArr.length; i += 1) {
          if (this.checkLabelIfArr.length > 0) {
            for (let j = 0; j < this.checkLabelIfArr[i].length; j += 1) {
              if (this.checkLabelIfArr[i][j] == true) {
                const settingTagCheck = this.allTagTypeWithSettingTag[i]
                  .settingTags[j]
                const {
                  settingTagId, tagType
                } = settingTagCheck
                const tagName = settingTagCheck.name
                settingTagGroupItems.push({
                  settingTagId,
                  tagType,
                  tagName
                })
              }
            }
          }
        }
        if (this.createIf) {
          param = {
            name: this.createUpdateForm.name,
            settingTagGroupItems
          }
          MEMBERSHIP_API_SETTINGTAGGROUP_CREATE(param).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '新建分组成功'
              })
              this.visibleCreateUpdate = false
              this.$refs['createUpdateForm'].resetFields()
              this.getAll()
            } else {
              this.$message({
                message: res.data.Message,
                type: 'error'
              })
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else {
          param = {
            settingTagGroupId: this.form.settingTagGroupId,
            name: this.createUpdateForm.name,
            settingTagGroupItems
          }
          MEMBERSHIP_API_SETTINGTAGGROUP_UPDATE(param).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.visibleCreateUpdate = false
              this.$refs['createUpdateForm'].resetFields()
              this.getAll('update')
            } else {
              this.$message({
                message: res.data.Message,
                type: 'error'
              })
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      })
    },
    // 表格分页相关
    currentChange(val) {
      this.parameter.pageIndex = val
      this.getData()
    },
    sizeChange(val) {
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.getData()
    },
    // -获取数据挖掘的客户列表
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)

      MEMBERSHIP_API_DATAANALYSIS_GETANALYSISMEMBERLIST(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.rows
          this.selectTable = res.data.Data.rows.map(item => item.memberId)
          this.total = res.data.Data.total
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    // -排序
    sortChange({
      prop, order
    }) {
      this.form.orderField = prop || ''
      this.form.orderType = order == 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getData()
    },
    // 不显示无手机号的会员
    exceptEmptyMobileChange(e) {
      this.form.exceptEmptyMobile = e
      this.getData()
    }
  },
  components: {
    userInfo,
    msgMarketingModal,
    pagination,
    createVisitTask,
    giveCouponCreate,
    basicEdit,
    memberExport
  }
}
</script>

<style lang="scss" scoped>
.data-mining {
  padding-bottom: 50px;
  .left {
    float: left;
    width: 300px;
    /deep/ .el-loading-spinner {
      margin-top: 0;
    }
    .hd {
      position: relative;
      height: 34px;
      line-height: 34px;
      padding-left: 10px;
      background: #399fe5;
      color: $white;
      button {
        position: absolute;
        top: 50%;
        right: 10px;
        padding: 6px 15px;
        border: 0;
        transform: translateY(-50%);
      }
    }
    .bd {
      position: relative;
      max-height: 680px;
      border-left: 1px solid $border-color;
      border-right: 1px solid $border-color;
      overflow-y: auto;
      li {
        position: relative;
        height: 34px;
        line-height: 33px;
        padding: 0 30px;
        border-bottom: 1px solid $border-color;
        text-overflow: ellipsis;
        overflow: hidden;
        cursor: pointer;
        background: url('../../../assets/images/three-bar.png') 5px 10px
          no-repeat;
        &.on,
        &:hover {
          background: $bg-color url('../../../assets/images/three-bar.png') 8px
            10px no-repeat;
        }
        i {
          position: absolute;
          top: 0;
          right: 10px;
          line-height: 33px;
          color: $em-color;
          font-size: $base-font;
          &:hover {
            color: #da0000;
          }
        }
      }
      &.sp {
        border-bottom: 1px solid $border-color;
        li:last-child {
          border-bottom: none;
        }
      }
    }
  }
  .right {
    float: left;
    width: calc(100% - 330px);
    margin-left: 10px;
    /deep/ .el-card__body {
      padding: 0px 10px 10px 0;
    }
    .el-card {
      border: 1px solid $border-color;
      border-radius: 0;
      /deep/ .el-card__header {
        height: 34px;
        line-height: 34px;
        padding: 0 10px;
        border-bottom: 1px solid $border-color;
        & > div > span {
          font-weight: bold;
        }
      }
    }
    .modify {
      float: right;
      padding: 0;
      line-height: 28px;
    }
    .cardsp {
      border: 0;
    }
    .labels {
      overflow: auto;
      li {
        float: left;
        margin: 10px 0 0 10px;
        button {
          cursor: default;
        }
      }
    }
    .operations {
      position: relative;
      width: 100%;
      margin-top: 10px;
      .noshow {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
.dialog-create-update {
  .thename {
    padding: 10px 0;
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
    /deep/ .el-input__inner {
      width: 300px;
    }
    /deep/ .el-form-item__error {
      position: relative;
      padding-top: 4px;
    }
  }
  /deep/ .el-dialog__body {
    padding: 0;
  }
  .thelabel {
    .hd {
      height: 40px;
      line-height: 38px;
      padding-left: 15px;
      border-top: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
      background: $bg-color;
      i {
        margin-right: 5px;
      }
      span {
        color: #f56c6c;
        margin-right: 4px;
      }
    }
    .bd {
      padding: 10px;
      .con {
        height: 380px;
        border: 1px solid $border-color;
        overflow-y: scroll;
        dl {
          padding-bottom: 5px;
          font-size: 12px;
          dt {
            float: left;
            width: 130px;
            line-height: 28px;
            padding-right: 10px;
            margin-top: 5px;
            text-align: right;
            white-space: nowrap;
          }
          dd {
            float: left;
            width: calc(100% - 130px);
            span {
              display: inline-block;
              height: 28px;
              line-height: 26px;
              padding: 0 5px;
              margin: 5px 10px 0 0;
              border: 1px solid $border-color;
              cursor: pointer;
              &:hover {
                border: 1px solid #399fe5;
              }
              &.checked {
                background: #399fe5;
                color: $white;
                border: 1px solid #399fe5;
              }
            }
          }
        }
      }
    }
  }
}
</style>
