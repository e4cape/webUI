<template>
  <el-row class="content p-20" type="flex" v-loading="loading" element-loading-text="拼命加载中">
    <el-col :span="8">
      <h2 class="t-t blue">基础资料</h2>
      <div class=" list-warp m-t-10">
        <div class="list">
          <span class="list-label">姓名</span>
          <span class="list-content">{{DetailData.UserName}}</span>
        </div>
        <div class="list">
          <span class="list-label">员工编号</span>
          <span class="list-content">{{DetailData.UserId}}</span>
        </div>
        <div class="list">
          <span class="list-label">性别</span>
          <span class="list-content">{{DetailData.SexyType===1?'男':DetailData.SexyType===3?'女':'保密'}}</span>
        </div>
        <div class="list">
          <span class="list-label">出生日期</span>
          <span class="list-content">{{DetailData.Birthday | filterDateTime}}</span>
        </div>
        <div class="list">
          <span class="list-label">身份证号</span>
          <span class="list-content">{{DetailData.CardIdentity}}</span>
        </div>
        <div class="list">
          <span class="list-label">身份证地址</span>
          <span class="list-content">{{DetailData.CardAddr}}</span>
        </div>
        <div class="list">
          <span class="list-label">手机</span>
          <span class="list-content">{{DetailData.Mobile}}</span>
        </div>
        <div class="list">
          <span class="list-label">邮箱</span>
          <span class="list-content">{{DetailData.Email}}</span>
        </div>
        <div class="list">
          <span class="list-label">QQ</span>
          <span class="list-content">{{DetailData.QQ}}</span>
        </div>
        <div class="list">
          <span class="list-label">现住址</span>
          <span class="list-content">{{DetailData.CurrAddr}}</span>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <h2 class="t-t orange">工作信息</h2>
      <div class="list-warp m-t-10">
        <div class="list">
          <span class="list-label">入职日期</span>
          <span class="list-content">{{DetailData.SignedTime | filterDateTime}}</span>
        </div>
        <div class="list">
          <span class="list-label">转正日期</span>
          <span class="list-content">{{DetailData.OfficialTime | filterDateTime}}</span>
        </div>
        <div class="list">
          <span class="list-label">离职日期</span>
          <span class="list-content">{{DetailData.LeavedTime | filterDateTime}}</span>
        </div>
        <div class="list">
          <span class="list-label">部门</span>
          <span class="list-content">{{DetailData.Department1}}</span>
        </div>
        <div class="list">
          <span class="list-label">职位</span>
          <span class="list-content">{{DetailData.Position1}}</span>
        </div>
        <div class="list">
          <span class="list-label">职级</span>
          <span class="list-content">{{DetailData.LevelTitle1}}</span>
        </div>
        <div class="list">
          <span class="list-label">在职状态</span>
          <span class="list-content">{{DetailData.VitaStatus ? employeeVitaStatus.Types[DetailData.VitaStatus] : '-'}}</span>
        </div>
        <div class="list">
          <span class="list-label">&nbsp;</span>
          <span class="list-content">&nbsp;</span>
        </div>
        <div class="list">
          <span class="list-label">&nbsp;</span>
          <span class="list-content">&nbsp;</span>
        </div>
        <div class="list">
          <span class="list-label">&nbsp;</span>
          <span class="list-content">&nbsp;</span>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <h2 class="t-t red">提成设置</h2>
      <div class="list-warp m-t-10">
        <div class="list">
          <span class="list-label">提成方案</span>
          <span class="list-content">{{DetailData.RatioTitle}}</span>
        </div>
        <div class="list">
          <span class="list-label">{{DetailData.RatioTitle==='导购'?'销售额来源':'销售额来源部门'}}</span>
          <span class="list-content">{{DetailData.RatioTitle==='导购'? '个人': DetailData.Depts}}</span>
        </div>
        <div class="list">
          <span class="list-label">&nbsp;</span>
          <span class="list-content"></span>
        </div>
        <div class="list">
          <span class="list-label">&nbsp;</span>
          <span class="list-content">&nbsp;</span>
        </div>
        <div class="list">
          <span class="list-label">&nbsp;</span>
          <span class="list-content">&nbsp;</span>
        </div>
        <div class="list">
          <span class="list-label">&nbsp;</span>
          <span class="list-content">&nbsp;</span>
        </div>
        <div class="list">
          <span class="list-label">&nbsp;</span>
          <span class="list-content">&nbsp;</span>
        </div>
        <div class="list">
          <span class="list-label">&nbsp;</span>
          <span class="list-content">&nbsp;</span>
        </div>
        <div class="list">
          <span :span="7" class="list-label">&nbsp;</span>
          <span class="list-content">&nbsp;</span>
        </div>
        <div class="list">
          <span class="list-label">&nbsp;</span>
          <span class="list-content">&nbsp;</span>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import {
  EmployeeVitaStatus 
} from '@/enums/performance'
import {
  KPIS_API_EMPLOYEE_GET 
} from '@/apis/performance'
import {
  MERCHANT_API_DROPDOWN_DEPARTLIST 
} from '@/apis/merchant'
export default {
  data() {
    return {
      employeeVitaStatus: EmployeeVitaStatus,
      DetailData: {
      },
      loading: false,
      depList:[]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init(){
      this.loading = true
      // 部门列表
      const resp = await MERCHANT_API_DROPDOWN_DEPARTLIST({State: 0})
      if (resp.data.Code === 'CORRECT') {
        this.depList = resp.data.Data.Rows
      }
      const res = await KPIS_API_EMPLOYEE_GET({UserId: this.$route.params.id})
      this.loading = false
      if(res.data.Code === 'CORRECT'){
        this.DetailData = res.data.Data
        let deptString = ''
        if(this.DetailData.DeptIds){
          let tmpArr = this.DetailData.DeptIds.split(',')
          tmpArr.forEach(item => {
            const resItem = this.depList.find(v => v.Id == item)
            if(resItem){
              deptString += resItem.Value + '，'
            }
          })
          deptString = deptString.substring(0,deptString.length-1)
        }else{
          deptString = '-'
        }
        this.DetailData.Depts = deptString
      }
    }
  },
}

</script>
<style lang="scss" scoped>
.list-warp{
  border-top: 1px #ddd solid;
  margin-right: 10px;
  .list-label {
    line-height: 32px;
    font-weight: bold;
    min-width: 120px;
    padding-left: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #555;
    text-align: left;
    background: #f5f5f5;
    border-right: 1px #ddd solid;
    display: inline-block;
  }

  .list-content {
    display: inline-block;
    padding-left: 15px;
    line-height: 32px;
    color: #555;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
  }

  .list {
    height: 33px;
    border-bottom: 1px #ddd solid;
  }
}
.content {
  border: 1px #ddd solid;
}

.bd-1 {
  border-top: 1px #ddd solid;
  border-bottom: 1px #ddd solid;
  margin-right: 42px;
}

.t-t {
  font-weight: bold;
  color: #fff;
  width: 120px;
  height: 30px;
  line-height: 30px;
  text-align: center;

  &.blue {
    background: url('~/static/images/blue.png') no-repeat;
  }

  &.orange {
    background: url('~/static/images/orange.png') no-repeat;
  }

  &.red {
    background: url('~/static/images/red.png') no-repeat;
  }
}

.create-list {
  font-size: 14px;
  line-height: 2;
}

.create-list-label {
  text-align: right;
  padding-right: 12px;
}

</style>
