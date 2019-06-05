<template>
  <div>
    <div class="cascader-list" v-if="dataList.length > 0">
      <span>礼品分类：</span>
      <div class="clearfix">
        <ul>
          <li v-for="item in dataList" :key="item.categoryId" :class="{'active':activeFirstId === item.categoryId,'disabled':item.disabled}" @click="leftChoose(item)">
            {{item.categoryName}}<i :class="{'el-icon-arrow-right':item.items}"></i>
          </li>
        </ul>
        <ul>
          <li v-for="item in childrenList" :key="item.categoryId" :class="{'active':activeSecondId === item.categoryId}" @click="rightChoose(item.categoryId)" v-text="item.categoryName" ></li>
        </ul>
      </div>
      <div class="tr p-t-10">
        <el-button name="btnConfirm" type="primary" @click="confirm">确 定</el-button>
        <el-button name="btnCancel" @click="cancel">取 消</el-button>
      </div>
    </div>
    <div v-else><i class="el-icon-warning"></i>无法获取礼品分类数据</div>
  </div>
</template>

<script>
export default {
  props:{
    data: {
      type: Array,
      default() {
        return []
      },
      required: true
    }
  },
  data() {
    return {
      dataList:[],
      activeFirstId:1,
      childrenList: [],
      activeSecondId:2
    }
  },
  methods: {
    leftChoose(v){
      if(v.disabled){
        return
      }
      this.activeFirstId = v.categoryId
      this.childrenList = v.items
      this.activeSecondId = v.items instanceof Array ? this.childrenList[0].categoryId : ''
    },
    rightChoose(v){
      this.activeSecondId = v
    },
    confirm(){
      let array = []
      array.push(this.activeFirstId)
      this.activeSecondId && array.push(this.activeSecondId)
      this.$emit('confirm',array)
    },
    cancel(){
      this.$emit('cancel')
      this.activeFirstId = this.dataList[0].categoryId
      this.childrenList = this.dataList[0].items
      this.$nextTick(()=>{
        this.activeSecondId = this.childrenList[0].categoryId
      })
    }
  },
  mounted () {
    if(!this.$props.data){
      this.$message.error('暂无礼品分类数据')
      return
    }
    this.dataList = this.$props.data.map(item => Object.assign(item, {
      disabled: Boolean(!item.items)
    }))
    this.activeFirstId = this.dataList[0].categoryId
    this.childrenList = this.dataList[0].items
    this.$nextTick(()=>{
      this.activeSecondId = this.childrenList[0].categoryId
    })
  }
}
</script>

<style lang="scss" scoped>
.cascader-list{
  position: relative;
  >span{
    position: absolute;
    top:0;
    left: 0;
    width: 80px;
    line-height: 20px;
  }
  >.clearfix{
    padding-left: 80px;
    >ul{
      float: left;
      width: 48%;
      height: 280px;
      overflow-y: auto;
      border:1px solid #ddd;
      &:first-child{
        >li{
          >i{
            float:right;
          }
          &.disabled{
            cursor:not-allowed; 
            color:#aaa;
          }
        }
      }
      &:last-child{
        float: right;
      }
      >li{
        cursor: pointer;
        width: 100%;
        padding: 6px 10px;
        &.active {
          background-color: #399fe5;
          color: #f5f5f5;
        }
      }
    }
  }
}

</style>
