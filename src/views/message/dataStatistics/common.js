import { CharacterType } from '@/enums/common'

const sendEnum = [
  {
    key: CharacterType.Lingcb, title: '平台'
  },
  {
    key: CharacterType.Company, title: '公司'
  },
  {
    key: CharacterType.Store, title: '门店'
  }
]

const storeEnum = sendEnum.slice(1)

export {
  sendEnum,
  storeEnum
}
