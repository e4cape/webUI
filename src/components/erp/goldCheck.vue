<template>
  <div>
    <el-dialog :title="checkInfo.type ? '查看素金' : '查看非素' " :visible.sync="visible">
      <el-form :model="goldData" label-width="120px">
        <el-form-item label="会员ID：">
          <p>{{goldData.MemberId}}</p>
        </el-form-item>
        <el-form-item label="手机号：">
          <p>{{goldData.Mobile}}</p>
        </el-form-item>
        <el-form-item class="img-box" label="图片：">
          <img :src="goldData.ImageUrl ? $root.settings.DOMAIN_IMG_FILE + goldData.ImageUrl.replace('{0}', '150x150') : $root.settings.DOMAIN_IMAGE +  '/default/goods/150x150.jpg'" alt="" class="avatar" />
        </el-form-item>
        <el-form-item label="旧货编号：">
          <p>{{goldData.JunkCode}}</p>
        </el-form-item>
        <el-form-item label="是否本店出售：">
          <!-- <p>{{goldData.IsOurStore === YNStatus.Yes ? '是' : '否'}}</p> -->
          <p>{{goldData.IsOurs === YNStatus.Yes ? '是' : '否'}}</p>
        </el-form-item>
        <el-form-item label="旧货名称：">
          <p>{{goldData.JunkName}}</p>
        </el-form-item>
        <el-form-item label="材质：">
          <!-- <p>{{getName($store.getters.materialType.TypeArray, goldData.MaterialType)}}</p> -->
          <p>{{$store.getters.materialType.Types[goldData.MaterialType]}}</p>
        </el-form-item>
        <el-form-item label="品类：">
          <!-- <p>{{getName($store.getters.materialType.TypeArray, goldData.MaterialType)}}</p> -->
          <p>{{$store.getters.categoryType.Types[goldData.CategoryType]}}</p>
        </el-form-item>
        <el-form-item label="成色：">
          <!-- <p>{{getName($store.getters.goldType.TypeArray, goldData.GoldTyp)}}</p> -->
          <p>{{$store.getters.goldType.Types[goldData.GoldType]}}</p>
        </el-form-item>
        <el-form-item label="金重(g)：">
          <p>{{$root.toFloat(goldData.GoldWeight, 3)}}</p>
        </el-form-item>
        <el-form-item v-if="checkInfo.type" label="回收金价(元/g)：">
          <p>￥{{$root.toFloat(goldData.RecallGoldPrice)}}</p>
        </el-form-item>
        <!-- 非素 -->
        <div v-if="!checkInfo.type">
          <el-form-item label="货重(g)：">
            <p>{{$root.toFloat(goldData.Weight, 3)}}</p>
          </el-form-item>
          <el-form-item label="主石重（ct）：">
            <p>{{$root.toFloat(goldData.StoneWeight, 3)}}</p>
          </el-form-item>
          <el-form-item label="主石颜色：">
            <p>{{stoneColors.Types[goldData.StoneColor]}}</p>
          </el-form-item>
          <el-form-item label="主石净度：">
            <p>{{stoneClaritys.Types[goldData.StoneClarity]}}</p>
          </el-form-item>
          <el-form-item label="主石切工：">
            <p>{{stoneCuts.Types[goldData.StoneCut]}}</p>
          </el-form-item>
        </div>
        <!-- end -->
        <el-form-item label="回收金额(元)：">
          <p>￥{{$root.toFloat(goldData.RecallPrice)}}</p>
        </el-form-item>
        <el-form-item label="回收工费(元)：">
          <p>￥{{$root.toFloat(goldData.RecallFee)}}</p>
        </el-form-item>
        <el-form-item label="备注：">
          <p>{{goldData.Note}}</p>
        </el-form-item>
        <el-form-item label="操作记录">
          <table class="junkTable">
            <tbody>
              <tr v-for=" (item , index) in Logs " :key="index">
                <td class="tit">{{dayjs(item.CreateTime).format('YYYY-MM-DD HH:mm')}}：</td>
                <td>{{item.Note.split(',')[0]}}</td>
                <td class="tit">单号：</td>
                <td>{{item.Note.split(',')[1].split(':')[1]}}</td>
                <td class="tit">创建人：</td>
                <td>{{item.CreateUser}}</td>
              </tr>
            </tbody>
          </table>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {
  STOCKING_API_JUNK_TRACE_GET,
  STOCKING_API_JUNK_LOG_GETS
} from '@/apis/stocking.js'
import {
  YNStatus
} from '@/enums/common.js'
import{
  StoneColor,
  StoneClarity,
  StoneCut
} from '@/enums/stocking.js'

export default {
  data() {
    return {
      dayjs,
      YNStatus,
      stoneColors: StoneColor,
      stoneClaritys: StoneClarity,
      stoneCuts: StoneCut,
      visible: this.checkDialog,
      Logs: [],
      goldData: {
        GoldWeight: 0,
        RecallGoldPrice: 0,
        Weight: 0,
        StoneWeight: 0,
        RecallPrice: 0,
        RecallFee: 0
      }
    }
  },
  // props: ['checkDialog', 'checkInfo'],
  props: {
    checkDialog: {
      default: false,
      type: Boolean
    },
    checkInfo: {
      default (){
        return {}
      },
      type: Object
    }
  },
  mounted() {
    console.log('goldCheck.vue')
    this.getJunkData()
  },
  methods: {
    getJunkData() {
      // 获取数据
      STOCKING_API_JUNK_TRACE_GET({
        JunkId: this.checkInfo.id 
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goldData = res.data.Data
        }
      })
      STOCKING_API_JUNK_LOG_GETS({
        JunkId: this.checkInfo.id,
        CharacterId: this.checkInfo.CharacterId,
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: 1,
        PageSize: 1000
      }).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.Logs = res.data.Data.Rows||[]
        }
      })
    },
    getName(type1, type2){
      let str = ''
      let arr = type1.split(',')
      if(type2){
        str = arr.find(item => {
          return item.Id == type2
        }).value
        
      }
      return str
    },
    closeDialog() {
      this.$emit('closeDialog', true)
    }
  },
  watch: {
    checkInfo: 'getJunkData',
    visible: 'closeDialog'
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 10px;
}
.junkTable {
  td {
    text-align: left;
    padding: 0 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }
  .tit {
    text-align: right;
    font-weight: 600;
    color: #555;
  }
}
.img-box{
  img{
    width: 150px;
    height: 150px;
  }
}
</style>
