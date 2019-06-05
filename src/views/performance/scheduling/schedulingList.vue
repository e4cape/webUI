<template>
  <div class="content noselect">
    <el-form :inline="true" :model="form" class="fix-item">
      <el-form-item label="日期">
        <el-date-picker name="Moth" v-model="form.Moth" :editable="false" :clearable="false" type="month" placeholder="选择日期范围" @change="ExChangeDate"></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="menu-box">
      <div class="m-y-15 menu-main">
        <span>排班选项：</span>
        <span name="Scheduling1" @click="Scheduling('早班')">早班</span>
        <span name="Scheduling2" @click="Scheduling('中班')">中班</span>
        <span name="Scheduling3" @click="Scheduling('晚班')">晚班</span>
        <span name="Scheduling4" @click="Scheduling('全天')">全天</span>
        <span name="Scheduling5" @click="Scheduling('休息')">休息</span>
        <span name="Scheduling6" @click="Scheduling('出差')">出差</span>
        <span name="Scheduling7" @click="Scheduling('病假')">病假</span>
        <span name="Scheduling8" @click="Scheduling('事假')">事假</span>
        <span name="Scheduling9" @click="Scheduling('婚假')">婚假</span>
        <span name="Scheduling10" @click="Scheduling('产假')">产假</span>
        <span name="Scheduling11" @click="Scheduling('年假')">年假</span>
      </div>
    </div>
    <div class="sc-table-box">
      <el-table :data="tableData" border v-loading="isLoading">
        <el-table-column fixed prop="UserName" label="员工姓名" width="150">
          <template slot-scope="scope">
            <span :data-userId="scope.row.UserId">{{scope.row.UserName}}</span>
          </template>
        </el-table-column>
        <!--  <el-table-column fixed prop="Department" label="部门" width="150"></el-table-column> -->
        <el-table-column width="53px" v-for="(item, index) in cols" :key="index" :label="item.Date" :label-class-name="item.SelfClass">
          <!-- <el-table-column :label="item.week" :label-class-name="item.SelfClass" :class-name="item.SelectClass"> -->
          <template slot="header" slot-scope="scope">
            <div class="renderTableHead">
              <span>{{scope.column.label}}</span>
              <span>{{cols[scope.column.label - 1]['week']}}</span>
            </div>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row[item.prop].data === '早班'" class="c-1">{{scope.row[item.prop].data}}</span>
            <span v-if="scope.row[item.prop].data === '中班'" class="c-2">{{scope.row[item.prop].data}}</span>
            <span v-if="scope.row[item.prop].data === '晚班'" class="c-3">{{scope.row[item.prop].data}}</span>
            <span v-if="scope.row[item.prop].data === '全天'" class="c-4">{{scope.row[item.prop].data}}</span>
            <span v-if="scope.row[item.prop].data === '休息'" class="c-5">{{scope.row[item.prop].data}}</span>
            <span v-if="scope.row[item.prop].data === '出差'" class="c-6">{{scope.row[item.prop].data}}</span>
            <span v-if="scope.row[item.prop].data === '病假'" class="c-7">{{scope.row[item.prop].data}}</span>
            <span v-if="scope.row[item.prop].data === '事假'" class="c-8">{{scope.row[item.prop].data}}</span>
            <span v-if="scope.row[item.prop].data === '婚假'" class="c-9">{{scope.row[item.prop].data}}</span>
            <span v-if="scope.row[item.prop].data === '产假'" class="c-10">{{scope.row[item.prop].data}}</span>
            <span v-if="scope.row[item.prop].data === '年假'" class="c-11">{{scope.row[item.prop].data}}</span>
            <span v-if="scope.row[item.prop].data === '已离职'" class="xx">{{scope.row[item.prop].data}}</span>
          </template>
          <!-- </el-table-column> -->
        </el-table-column>
      </el-table>
    </div>
    <div class="m-20">
      <el-button name="btnSave" type="primary" @click="SaveScheduling">保存</el-button>
      <el-button name="btnCancel" type="default" @click="Clear">取消</el-button>
    </div>
  </div>
</template>
<script>
import {
  addClass,
  removeClass,
  removeElement,
  offset,
  DataGroup
} from '@/utilities/class'

import {
  KPIS_API_SCHEDULE_UPDATE,
  KPIS_API_EMPLOYEE_EMPLOYEELIST,
  KPIS_API_SCHEDULE_GETS
} from '@/apis/performance'

import dayjs from 'dayjs'
import { EmployeeVitaStatus } from '@/enums/performance'
export default {
  data() {
    return {
      form: {
        Moth: '',
        BeginDate: '',
        EndDate: ''
      },
      cols: [],
      tableData: [],
      selectAry: [],
      upDataAry: [],
      len: '',
      flag: false,
      x: '',
      y: '',
      ary: [],
      tdAry: [],
      isLoading: false,
    }
  },
  methods: {
    GetNowDate(m) {
      // 根据日期渲染表格列
      let d
      const cols = []
      if (m) {
        d = new Date(m)
      } else {
        d = new Date()
      }
      const curMonthDays = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0
      ).getDate()
      const Weeks = {
        0: '日',
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六'
      }
      for (let i = 1; i < curMonthDays + 1; i++) {
        const week = new Date(d.getFullYear(), d.getMonth(), i).getDay()
        var _class = 'bg-ecf6f8'
        if (week === 0 || week === 6) {
          _class = 'bg-fefbec'
        }
        cols.push({
          Date: '' + i,
          week: Weeks[week],
          prop: 'date' + i,
          SelfClass: _class
        })
      }

      this.form.Moth = dayjs(d).format('YYYY-MM')
      this.form.BeginDate = this.form.Moth + '-01'
      this.form.EndDate = this.form.Moth + '-' + curMonthDays
      this.cols = cols
    },
    Scheduling(txt) {
      // 排班设置
      this.upDataAry = []
      if (this.selectAry.length > 0) {
        this.selectAry.forEach(item => {
          for (let objKey in this.tableData) {
            if (this.tableData[objKey].UserId == item.UserId) {
              if (this.tableData[objKey]['date' + item.key].isDefault) {
                this.tableData[objKey]['date' + item.key] = {
                  isUpdate: true,
                  isDefault: true,
                  data: txt
                }
              } else {
                this.tableData[objKey]['date' + item.key] = {
                  isCreate: true,
                  isDefault: false,
                  data: txt
                }
              }
              // this.$set(this.tableData,objKey,this.tableData[objKey])
            }
          }
        })
        // this.tableData.sort(compare('UserId'))
      }
    },
    StarSelect(e) {
      // 矩形选框起点
      this.selectAry = []
      this.flag = true
      this.x = e.pageX
      this.y = e.pageY
      const _div = document.createElement('div')
      _div.className = 'select-area'
      _div.style.cssText = 'left:' + this.x + 'px;top:' + this.y + 'px'
      if (!document.querySelector('.select-area')) {
        document.querySelector('body').appendChild(_div)
      }

      let tdAry = document
        .querySelector('.el-table__body')
        .getElementsByTagName('td')
      // for(let i=0;i<td.length;i++){
      //   if(td[i].innerText!=='离职'){
      //     tdAry.push(td[i])
      //   }
      // }
      // .forEach(m=>{
      // })
      if (e.target.className === 'cell') {
        tdAry = e.path[4].getElementsByTagName('td')
      }
      // this.tdAry = tdAry
      // for (let item in tdAry) {
      //   if (tdAry[item].offsetLeft !== undefined) {
      //     this.ary.push([offset(tdAry[item]).left, offset(tdAry[item]).top])
      //     removeClass(tdAry[item], 'cur')
      //   }
      // }
      for (let i = 0; i < tdAry.length; i++) {
        this.$set(this.tdAry, i, tdAry[i])
        if (tdAry[i].offsetLeft !== undefined) {
          this.$set(this.ary, i, [offset(tdAry[i]).left, offset(tdAry[i]).top])
          removeClass(tdAry[i], 'cur')
        }
      }
    },
    Selected(e) {
      // 鼠标画矩形选框
      if (this.flag) {
        let w, h, posX, posY, xx, yy
        let ScrX = document.querySelector('.el-table__body-wrapper').scrollLeft
        let ScrY = document.querySelector('.el-table__body-wrapper').scrollTop
        for (let i in this.ary) {
          if (this.tdAry[i] !== undefined) {
            xx = this.ary[i][0] - ScrX + this.tdAry[i].clientWidth
            yy = this.ary[i][1] - ScrY + this.tdAry[i].clientHeight

            if (e.pageX > this.x && e.pageY > this.y) {
              w = e.pageX - this.x
              h = e.pageY - this.y
              posX = this.x
              posY = this.y
              if (
                xx >= this.x &&
                yy >= this.y &&
                this.ary[i][0] - ScrX <= e.pageX &&
                this.ary[i][1] - ScrY <= e.pageY
              ) {
                addClass(this.tdAry[i], 'cur')
              } else {
                removeClass(this.tdAry[i], 'cur')
              }
            } else if (e.pageX > this.x && e.pageY < this.y) {
              // yy = this.ary[i][1]
              w = e.pageX - this.x
              h = this.y - e.pageY
              posX = this.x
              posY = e.pageY
              if (
                xx >= this.x &&
                yy >= posY &&
                this.ary[i][0] - ScrX <= e.pageX &&
                this.ary[i][1] - ScrY <= this.y
              ) {
                addClass(this.tdAry[i], 'cur')
              } else {
                removeClass(this.tdAry[i], 'cur')
              }
            } else if (e.pageX < this.x && e.pageY > this.y) {
              w = this.x - e.pageX
              h = e.pageY - this.y
              posX = e.pageX
              posY = this.y

              if (
                xx >= posX &&
                yy >= this.y &&
                this.ary[i][0] - ScrX <= this.x &&
                this.ary[i][1] - ScrY <= e.pageY
              ) {
                addClass(this.tdAry[i], 'cur')
              } else {
                removeClass(this.tdAry[i], 'cur')
              }
            } else {
              w = this.x - e.pageX
              h = this.y - e.pageY
              posX = e.pageX
              posY = e.pageY
              if (
                xx >= posX &&
                yy >= posY &&
                this.ary[i][0] - ScrX <= this.x &&
                this.ary[i][1] - ScrY <= this.y
              ) {
                addClass(this.tdAry[i], 'cur')
              } else {
                removeClass(this.tdAry[i], 'cur')
              }
            }
          }

          // if (this.tdAry[i]['innerText'] === '离职') {
          //   removeClass(this.tdAry[i], 'cur')
          // }
        }
        // let endW=Math.min(w,document.querySelector('sc-table-box').clientWidth)

        w = Math.min(window.screen.width - posX - 30, w)
        document.querySelector('.select-area').style.cssText =
          'width:' +
          w +
          'px;height:' +
          h +
          'px;left:' +
          posX +
          'px;top:' +
          posY +
          'px'
      }
    },
    EndSelect() {
      // 画矩形选框结束时触发事件
      this.flag = false
      // const _td =  document.querySelectorAll('.xx').parentNode.parentNode

      if (document.querySelector('.select-area')) {
        if (document.querySelector('.select-area').remove) {
          document.querySelector('.select-area').remove()
        } else {
          removeElement(document.querySelector('.select-area'))
        }
      }

      const _span = document.querySelectorAll('.xx')

      for (let i = 0; i < _span.length; i++) {
        removeClass(_span[i].parentNode.parentNode, 'cur')
      }
      setTimeout(() => {
        const _cur = document.querySelectorAll('.cur')
        for (let item in _cur) {
          if (_cur[item].parentNode) {
            let _td = _cur[item].parentNode.getElementsByTagName('td')
            for (let i in _td) {
              if (_td[i] === _cur[item]) {
                const _name = _td[0].innerHTML.replace(/<.+?>/gim, '')
                const _id = _td[0]
                  .getElementsByTagName('span')[0]
                  .getAttribute('data-userId')
                this.selectAry.push({
                  UserName: _name,
                  key: i,
                  UserId: _id
                })
              }
            }
          }
        }
      }, 400)
    },
    ExChangeDate() {
      // 切换日期
      this.GetNowDate(this.form.Moth)
      this.GetScheduling()
    },
    SaveScheduling() {
      // 保存数据
      this.isLoading = true
      const obj = {
        Creates: [],
        Updates: []
      }
      for (let i in this.tableData) {
        if (!isNaN(parseInt(i))) {
          for (let j = 0; j < this.cols.length; j++) {
            if (this.tableData[i]['date' + (j + 1)].data !== '') {
              if (this.tableData[i]['date' + (j + 1)].isUpdate) {
                obj.Updates.push({
                  PlanDate: dayjs(
                    new Date(this.form.Moth + '-' + (j + 1<10?`0${j + 1}`:j + 1))
                  ).format('YYYY-MM-DD'),
                  Note: this.tableData[i]['date' + (j + 1)].data,
                  UserName: this.tableData[i]['UserName'],
                  UserId: this.tableData[i]['UserId']
                })
              } else {
                if (this.tableData[i]['date' + (j + 1)].isCreate) {
                  obj.Creates.push({
                    PlanDate: dayjs(
                      new Date(this.form.Moth + '-' + (j + 1<10?`0${j + 1}`:j + 1))
                    ).format('YYYY-MM-DD'),
                    Note: this.tableData[i]['date' + (j + 1)].data,
                    UserName: this.tableData[i]['UserName'],
                    UserId: this.tableData[i]['UserId']
                  })
                }
              }
            }
          }
        }
      }
      KPIS_API_SCHEDULE_UPDATE(obj).then(data => {
        this.isLoading = false
        if (data.data.Code === 'CORRECT') {
          this.$message.success('设置成功！')
          this.GetScheduling()
        } else {
          setTimeout(() => {
            window.location.reload()
          }, 500)
        }
      })
    },
    Clear() {
      this.GetScheduling()
    },
    GetScheduling() {
      // 加载员工列表
      const $this = this
      this.isLoading = true
      this.tableData = []
      let arys = []
      KPIS_API_EMPLOYEE_EMPLOYEELIST({
        SignedTime: this.form.Moth
      }).then(data => {
        arys = data.data.Data
        let dateDefault = {}
        for (let i = 0; i < arys.length; i++) {
          for (let j = 0; j < this.cols.length; j++) {
            const curleavedTime = new Date(arys[i]['LeavedTime'].replace(/-/g,'/'))
            const xx = curleavedTime.getDate()
            const year = curleavedTime.getFullYear()
            const month = curleavedTime.getMonth() + 1
            const curYear = new Date(this.form.Moth).getFullYear()
            const curMonth = new Date(this.form.Moth).getMonth() + 1
            const VitaStatus = arys[i]['VitaStatus']

            if (
              VitaStatus == EmployeeVitaStatus.Leaved &&
              year == curYear &&
              month == curMonth &&
              j + 1 >= xx
            ) {
              dateDefault['date' + (j + 1)] = {
                isDefault: false,
                data: '已离职'
              }
            } else {
              dateDefault['date' + (j + 1)] = {
                isDefault: false,
                data: ''
              }
            }
          }
          // this.tableData.push()
          this.$set(
            this.tableData,
            i,
            Object.assign(
              {
                UserName: arys[i]['Name'] || '未设名字',
                UserId: arys[i]['Value'],
                LeavedTime: arys[i]['LeavedTime'],
                VitaStatus: arys[i]['VitaStatus']
              },
              dateDefault
            )
          )
        }
      })
        .then(() => {
          KPIS_API_SCHEDULE_GETS({
            PlanDate: dayjs(new Date(this.form.Moth)).format('YYYY-MM-DD'),
            PageSize:9999,
            PageIndex:1
          }).then(res => {
            this.isLoading = false
            if (res.data.Data.Count > 0) {
              const $data = DataGroup(res.data.Data.Rows, 'UserId')
              let ary = []
              let dateDefault = {}
              for (let i = 0; i < $data.length; i++) {
                const _data = this.tableData.find(
                  m => m.UserId == $data[i].UserId
                )
                if(!_data){
                  continue
                }
                dateDefault = {}
                for (let j = 0; j < this.cols.length; j++) {
                  for (var item in $data[i].data) {
                    if (
                      new Date($data[i].data[item]['PlanDate']).getDate() ===
                        parseInt(this.cols[j].Date) &&
                      $data[i].data[item]['Note'] !== ''
                    ) {
                      dateDefault['date' + (j + 1)] = {
                        isDefault: true,
                        data: $data[i].data[item]['Note']
                      }
                    } else {
                      if (!dateDefault['date' + (j + 1)]) {
                        const curleavedTime = new Date(_data['LeavedTime'].replace(/-/g,'/'))
                        const xx = curleavedTime.getDate()
                        const year = curleavedTime.getFullYear()
                        const month =
                          curleavedTime.getMonth() + 1
                        const curYear = new Date($this.form.Moth).getFullYear()
                        const curMonth =
                          new Date($this.form.Moth).getMonth() + 1
                        const VitaStatus = _data['VitaStatus']
                        if (
                          VitaStatus == EmployeeVitaStatus.Leaved &&
                          year == curYear &&
                          month == curMonth &&
                          j + 1 >= xx
                        ) {
                          dateDefault['date' + (j + 1)] = {
                            isDefault: false,
                            data: '已离职'
                          }
                        } else {
                          dateDefault['date' + (j + 1)] = {
                            isDefault: false,
                            data: ''
                          }
                        }
                      }
                    }
                  }
                }
                ary.push(
                  Object.assign(
                    {
                      UserName: $data[i].data[0]['UserName'],
                      UserId: $data[i]['UserId'],
                      LeavedTime: _data['LeavedTime'],
                      VitaStatus: _data['VitaStatus']
                    },
                    dateDefault
                  )
                )
              }
              ary.forEach((item) => {
                if (
                  this.tableData.find(m => m.UserId === item.UserId) !==
                  undefined
                ) {
                  const i = this.tableData.indexOf(
                    this.tableData.find(m => m.UserId === item.UserId)
                  )
                  this.tableData[i] = item
                  this.$set(this.tableData, i, this.tableData[i])
                }
              })
            }
          })
        })
    }
  },
  beforeMount() {
    this.GetNowDate()
    this.GetScheduling()
  },
  mounted() {
    const $this = this
    document.querySelector('body').onmouseup = function() {
      $this.EndSelect()
    }
    document.querySelector('.el-table__body').onmousedown = function(e) {
      let _td = e.target
      $this.StarSelect(e)
      if (e.target.className === 'cell') {
        _td = e.target.parentNode
      } else if (/^[c]/.test(e.target.className)) {
        _td = e.target.parentNode.parentNode
      }
      addClass(_td, 'cur')
    }
    document.querySelector('body').onmousemove = function(e) {
      if ($this.flag) {
        $this.Selected(e)
      }
    }
  }
}
document.body.onselectstart = document.body.ondrag = function() {
  return false
}
</script>
<style lang="scss" scoped>
body {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}

.fix-item {
  .el-form-item {
    margin-bottom: 10px;
  }
}

.lz {
  display: none;
}

.menu-box {
  border-top: 1px #ddd solid;
}

.m-b-0 {
  margin-bottom: 0;
}

.menu-main {
  background: #f5f5f5;
  font-size: 0;

  span {
    font-size: 14px;
    padding: 10px 20px;
    margin-right: 1px;
    color: #fff;
    display: inline-block;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &:nth-child(1) {
      color: #333;
      cursor: default;
    }

    &:nth-child(2) {
      background: #128ce1;
    }

    &:nth-child(3) {
      background: #2c85c1;
    }

    &:nth-child(4) {
      background: #4d7fa2;
    }

    &:nth-child(5) {
      background: #4ac22f;
    }

    &:nth-child(6) {
      background: #c98e40;
    }

    &:nth-child(7) {
      background: #80878d;
    }

    &:nth-child(8) {
      background: #ee455a;
    }

    &:nth-child(9) {
      background: #b66d8b;
    }

    &:nth-child(10) {
      background: #7c8572;
    }

    &:nth-child(11) {
      background: #bebca7;
    }

    &:nth-child(12) {
      background: #c1c1c1;
    }
  }
}

.c-1 {
  color: #128ce1;
}

.c-2 {
  color: #2c85c1;
}

.c-3 {
  color: #4d7fa2;
}

.c-4 {
  color: #4ac22f;
}

.c-5 {
  color: #c98e40;
}

.c-6 {
  color: #80878d;
}

.c-7 {
  color: #ee455a;
}

.c-8 {
  color: #b66d8b;
}

.c-9 {
  color: #7c8572;
}

.c-10 {
  color: #bebca7;
}

.c-11 {
  color: #c1c1c1;
}
/deep/ .el-table th.bg-ecf6f8 {
  background-color: #ecf6f8;
}

/deep/ .el-table thead.is-group th.bg-fefbec {
  background: #fefbec;
}

/deep/ .el-table th.bg-ecf6f8 > .cell {
  background-color: #ecf6f8;
}

/deep/ .el-table th.bg-fefbec > .cell {
  background-color: #fefbec;
}
/deep/ td.cur {
  background: rgba(44, 133, 193, 0.6) !important;
}

/deep/ td.cur .c-1,
/deep/ td.cur .c-2,
/deep/ td.cur .c-3,
/deep/ td.cur .c-4,
/deep/ td.cur .c-5,
/deep/ td.cur .c-6,
/deep/ td.cur .c-7,
/deep/ td.cur .c-8,
/deep/ td.cur .c-9,
/deep/ td.cur .c-10,
/deep/ td.cur .c-11 {
  color: #fff;
}
.sc-table-box {
  /deep/ .el-table__body-wrapper{
    overflow: auto;
    position: relative;
  }
  /deep/ .el-table td,
  /deep/ .el-table th {
    padding: 4px 0;
    text-align: center;
  }
  /deep/ tr.hover-row td {
    background: none;
  }

  /deep/ .el-table th {
    padding: 0;
  }

  /deep/ .el-table .cell {
    padding: 0;
  }
  /deep/ .el-table--border,
  /deep/ .el-table--group {
    border-left-color: #e5e5e5;
    border-right-color: #e5e5e5;
  }
}
/deep/ div.renderTableHead {
  width: 100%;
  padding: 0 !important;

  span {
    display: block;
    line-height: 1;
    padding: 7px;

    &:first-child {
      padding-top: 10px;
      margin-bottom: 10px;
    }

    &:last-child {
      padding-top: 10px;
      border-top: 1px #e5e5e5 solid;
    }
  }
}
/deep/ .el-table__fixed,
/deep/ .el-table__fixed-right {
  height: 100% !important;
}
</style>

<style lang="scss">
.select-area {
  position: absolute;
  background: rgba(255, 255, 255, 0.4);
  z-index: 999;
  border: 2px #128ce1 dashed;
}
</style>
