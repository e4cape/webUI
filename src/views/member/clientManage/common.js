// import { CharacterType, SecurityPackBasicMultiType } from '@/enums/merchant'

export const mixin = {
  computed: {
    // 一号一店 无限制
    // 一号多店的总部不可以修改
    isOperable() {
      return this.isOneNumberOneStore || this.isOneNumberManyShop
    }
  }
}
