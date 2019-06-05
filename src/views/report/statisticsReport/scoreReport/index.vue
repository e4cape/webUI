<template>
  <div>
    <scoreReportCompany v-if="$store.getters.user_session.CharacterType == CharacterType.Company"></scoreReportCompany>
    <scoreReportStore v-if="$store.getters.user_session.CharacterType == CharacterType.Store"></scoreReportStore>
  </div>
</template>
<script>
import { CharacterType } from '@/enums/common'
import scoreReportCompany from './company'
import scoreReportStore from './store'
export default {
  data() {
    return {
      CharacterType
    }
  },
  components: {
    scoreReportCompany,
    scoreReportStore
  }
}
</script>
