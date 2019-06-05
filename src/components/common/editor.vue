<template>
  <div v-loading="editLoading">
    <div
      ref="editor"
      style="text-align:left; font-size: 16px;"
    ></div>
  </div>
</template>

<script>
import E from 'editor-lcb'
import { COMMON_API_IMAGE_UPLOAD64TOOSS } from '@/apis/common'
import { setTimeout } from 'timers'

export default {
  props: {
    Note: {
      type: String
    }
  },
  data() {
    return {
      editorContent: '',
      editLoading: false,
      editor: null,
      timer: null
    }
  },
  methods: {},
  mounted() {
    this.editor = new E(this.$refs.editor)
    this.editor.customConfig.onchange = html => {
      this.editorContent = html
      let sss = this.editor.txt.text()
      let text = sss.replace(/&nbsp;/g, ' ')
      this.$emit('listenEditerChange', {
        html,
        text
      })
    }
    this.editor.customConfig.emotions = [
      {
        title: '默认',
        type: 'image',
        content: [
          {
            alt: '[坏笑]',
            src:
              'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png'
          },
          {
            alt: '[舔屏]',
            src:
              'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7a/shenshou_thumb.gif',
            alt: '[草泥马]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/60/horse2_thumb.gif',
            alt: '[神马]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/fuyun_thumb.gif',
            alt: '[浮云]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c9/geili_thumb.gif',
            alt: '[给力]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f2/wg_thumb.gif',
            alt: '[围观]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/70/vw_thumb.gif',
            alt: '[威武]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6e/panda_thumb.gif',
            alt: '[熊猫]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/81/rabbit_thumb.gif',
            alt: '[兔子]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/otm_thumb.gif',
            alt: '[奥特曼]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/15/j_thumb.gif',
            alt: '[囧]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/89/hufen_thumb.gif',
            alt: '[互粉]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c4/liwu_thumb.gif',
            alt: '[礼物]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ac/smilea_thumb.gif',
            alt: '[呵呵]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0b/tootha_thumb.gif',
            alt: '[嘻嘻]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6a/laugh.gif',
            alt: '[哈哈]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/14/tza_thumb.gif',
            alt: '[可爱]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/af/kl_thumb.gif',
            alt: '[可怜]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a0/kbsa_thumb.gif',
            alt: '[挖鼻屎]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f4/cj_thumb.gif',
            alt: '[吃惊]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6e/shamea_thumb.gif',
            alt: '[害羞]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c3/zy_thumb.gif',
            alt: '[挤眼]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/29/bz_thumb.gif',
            alt: '[闭嘴]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/71/bs2_thumb.gif',
            alt: '[鄙视]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/lovea_thumb.gif',
            alt: '[爱你]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9d/sada_thumb.gif',
            alt: '[泪]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/19/heia_thumb.gif',
            alt: '[偷笑]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8f/qq_thumb.gif',
            alt: '[亲亲]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/b6/sb_thumb.gif',
            alt: '[生病]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/58/mb_thumb.gif',
            alt: '[太开心]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/17/ldln_thumb.gif',
            alt: '[懒得理你]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/98/yhh_thumb.gif',
            alt: '[右哼哼]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/zhh_thumb.gif',
            alt: '[左哼哼]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a6/x_thumb.gif',
            alt: '[嘘]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/af/cry.gif',
            alt: '[衰]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/73/wq_thumb.gif',
            alt: '[委屈]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9e/t_thumb.gif',
            alt: '[吐]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f3/k_thumb.gif',
            alt: '[打哈欠]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/27/bba_thumb.gif',
            alt: '[抱抱]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7c/angrya_thumb.gif',
            alt: '[怒]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/5c/yw_thumb.gif',
            alt: '[疑问]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a5/cza_thumb.gif',
            alt: '[馋嘴]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/70/88_thumb.gif',
            alt: '[拜拜]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e9/sk_thumb.gif',
            alt: '[思考]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/24/sweata_thumb.gif',
            alt: '[汗]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7f/sleepya_thumb.gif',
            alt: '[困]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6b/sleepa_thumb.gif',
            alt: '[睡觉]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/90/money_thumb.gif',
            alt: '[钱]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0c/sw_thumb.gif',
            alt: '[失望]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/cool_thumb.gif',
            alt: '[酷]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8c/hsa_thumb.gif',
            alt: '[花心]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/49/hatea_thumb.gif',
            alt: '[哼]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/36/gza_thumb.gif',
            alt: '[鼓掌]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d9/dizzya_thumb.gif',
            alt: '[晕]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1a/bs_thumb.gif',
            alt: '[悲伤]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/62/crazya_thumb.gif',
            alt: '[抓狂]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/91/h_thumb.gif',
            alt: '[黑线]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/yx_thumb.gif',
            alt: '[阴险]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/89/nm_thumb.gif',
            alt: '[怒骂]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/hearta_thumb.gif',
            alt: '[心]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ea/unheart.gif',
            alt: '[伤心]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/58/pig.gif',
            alt: '[猪头]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d6/ok_thumb.gif',
            alt: '[ok]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d9/ye_thumb.gif',
            alt: '[耶]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d8/good_thumb.gif',
            alt: '[good]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c7/no_thumb.gif',
            alt: '[不要]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d0/z2_thumb.gif',
            alt: '[赞]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/come_thumb.gif',
            alt: '[来]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d8/sad_thumb.gif',
            alt: '[弱]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/91/lazu_thumb.gif',
            alt: '[蜡烛]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6a/cake.gif',
            alt: '[蛋糕]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d3/clock_thumb.gif',
            alt: '[钟]'
          },
          {
            src:
              'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1b/m_thumb.gif',
            alt: '[话筒]'
          }
        ]
      },
      {
        title: 'emoji',
        type: 'emoji',
        content: [
          '😃',
          '😄',
          '😁',
          '😆',
          '☀',
          '☁',
          '☔',
          '⛄',
          '⚡',
          '🌀',
          '🌁',
          '🌂',
          '🌃',
          '🌄',
          '🌅',
          '🌆',
          '🌇',
          '🌈',
          '❄',
          '⛅',
          '🌉',
          '🌊',
          '🌋',
          '🌌',
          '🌏',
          '🌑',
          '🌔',
          '🌓',
          '🌙',
          '🌕',
          '🌛',
          '🌟',
          '🌠',
          '🕐',
          '🕑',
          '🕒',
          '🕓',
          '🕔',
          '🕕',
          '🕖',
          '🕗',
          '🕘',
          '🕙',
          '🕚',
          '🕛',
          '⌚',
          '⌛',
          '⏰',
          '⏳',
          '♈',
          '♉',
          '♊',
          '♋',
          '♌',
          '♍',
          '♎',
          '♏',
          '♐',
          '♑',
          '♒',
          '♓',
          '⛎',
          '🍀',
          '🌷',
          '🌱',
          '🍁',
          '🌸',
          '🌹',
          '🍂',
          '🍃',
          '🌺',
          '🌻',
          '🌴',
          '🌵',
          '🌾',
          '🌽',
          '🍄',
          '🌰',
          '🌼',
          '🌿',
          '🍒',
          '🍌',
          '🍎',
          '🍊',
          '🍓',
          '🍉',
          '🍅',
          '🍆',
          '🍈',
          '🍍',
          '🍇',
          '🍑',
          '🍏',
          '👀',
          '👂',
          '👃',
          '👄',
          '👅',
          '💄',
          '💅',
          '💆',
          '💇',
          '💈',
          '👤',
          '👦',
          '👧',
          '👨',
          '👩',
          '👪',
          '👫',
          '👮',
          '👯',
          '👰',
          '👱',
          '👲',
          '👳',
          '👴',
          '👵',
          '👶',
          '👷',
          '👸',
          '👹',
          '👺',
          '👻',
          '👼',
          '👽',
          '👾',
          '👿',
          '💀',
          '💁',
          '💂',
          '💃',
          '🐌',
          '🐍',
          '🐎',
          '🐔',
          '🐗',
          '🐫',
          '🐘',
          '🐨',
          '🐒',
          '🐑',
          '🐙',
          '🐚',
          '🐛',
          '🐜',
          '🐝',
          '🐞',
          '🐠',
          '🐡',
          '🐢',
          '🐤',
          '🐥',
          '🐦',
          '🐣',
          '🐧',
          '🐩',
          '🐟',
          '🐬',
          '🐭',
          '🐯',
          '🐱',
          '🐳',
          '🐴',
          '🐵',
          '🐶',
          '🐷',
          '🐻',
          '🐹',
          '🐺',
          '🐮',
          '🐰',
          '🐸',
          '🐾',
          '🐲',
          '🐼',
          '🐽',
          '😠',
          '😩',
          '😲',
          '😞',
          '😵',
          '😰',
          '😒',
          '😍',
          '😤',
          '😜',
          '😝',
          '😋',
          '😘',
          '😚',
          '😷',
          '😳',
          '😃',
          '😅',
          '😆',
          '😁',
          '😂',
          '😊',
          '☺',
          '😄',
          '😢',
          '😭',
          '😨',
          '😣',
          '😡',
          '😌',
          '😖',
          '😔',
          '😱',
          '😪',
          '😏',
          '😓',
          '😥',
          '😫',
          '😉',
          '😺',
          '😸',
          '😹',
          '😽',
          '😻',
          '😿',
          '😾',
          '😼',
          '🙀',
          '🙅',
          '🙆',
          '🙇',
          '🙈',
          '🙊',
          '🙉',
          '🙋',
          '🙌',
          '🙍',
          '🙎',
          '🙏',
          '🏠',
          '🏡',
          '🏢',
          '🏣',
          '🏥',
          '🏦',
          '🏧',
          '🏨',
          '🏩',
          '🏪',
          '🏫',
          '⛪',
          '⛲',
          '🏬',
          '🏯',
          '🏰',
          '🏭',
          '⚓',
          '🏮',
          '🗻',
          '🗼',
          '🗽',
          '🗾',
          '🗿',
          '👞',
          '👟',
          '👠',
          '👡',
          '👢',
          '👣',
          '👓',
          '👕',
          '👖',
          '👑',
          '👔',
          '👒',
          '👗',
          '👘',
          '👙',
          '👚',
          '👛',
          '👜',
          '👝',
          '💰',
          '💱',
          '💹',
          '💲',
          '💳',
          '💴',
          '💵',
          '💸',
          '🔥',
          '🔦',
          '🔧',
          '🔨',
          '🔩',
          '🔪',
          '🔫',
          '🔮',
          '🔯',
          '🔰',
          '🔱',
          '💉',
          '💊',
          '🅰',
          '🅱',
          '🆎',
          '🅾',
          '🎀',
          '🎁',
          '🎂',
          '🎄',
          '🎅',
          '🎌',
          '🎆',
          '🎈',
          '🎉',
          '🎍',
          '🎎',
          '🎓',
          '🎒',
          '🎏',
          '🎇',
          '🎐',
          '🎃',
          '🎊',
          '🎋',
          '🎑',
          '📟',
          '☎',
          '📞',
          '📱',
          '📲',
          '📝',
          '📠',
          '✉',
          '📨',
          '📩',
          '📪',
          '📫',
          '📮',
          '📰',
          '📢',
          '📣',
          '📡',
          '📤',
          '📥',
          '📦',
          '📧',
          '🔠',
          '🔡',
          '🔢',
          '🔣',
          '🔤',
          '✒',
          '💺',
          '💻',
          '✏',
          '📎',
          '💼',
          '💽',
          '💾',
          '💿',
          '📀',
          '✂',
          '📍',
          '📃',
          '📄',
          '📅',
          '📁',
          '📂',
          '📓',
          '📖',
          '📔',
          '📕',
          '📗',
          '📘',
          '📙',
          '📚',
          '📛',
          '📜',
          '📋',
          '📆',
          '📊',
          '📈',
          '📉',
          '📇',
          '📌',
          '📒',
          '📏',
          '📐',
          '📑',
          '🎽',
          '⚾',
          '⛳',
          '🎾',
          '⚽',
          '🎿',
          '🏀',
          '🏁',
          '🏂',
          '🏃',
          '🏄',
          '🏆',
          '🏈',
          '🏊',
          '🚃',
          '🚇',
          'Ⓜ',
          '🚄',
          '🚅',
          '🚗',
          '🚙',
          '🚌',
          '🚏',
          '🚢',
          '✈',
          '⛵',
          '🚉',
          '🚀',
          '🚤',
          '🚕',
          '🚚',
          '🚒',
          '🚑',
          '🚓',
          '⛽',
          '🅿',
          '🚥',
          '🚧',
          '🚨',
          '♨',
          '⛺',
          '🎠',
          '🎡',
          '🎢',
          '🎣',
          '🎤',
          '🎥',
          '🎦',
          '🎧',
          '🎨',
          '🎩',
          '🎪',
          '🎫',
          '🎬',
          '🎭',
          '🎮',
          '🀄',
          '🎯',
          '🎰',
          '🎱',
          '🎲',
          '🎳',
          '🎴',
          '🃏',
          '🎵',
          '🎶',
          '🎷',
          '🎸',
          '🎹',
          '🎺',
          '🎻',
          '🎼',
          '〽',
          '📷',
          '📹',
          '📺',
          '📻',
          '📼',
          '💋',
          '💌',
          '💍',
          '💎',
          '💏',
          '💐',
          '💑',
          '💒',
          '🔞',
          '©',
          '®',
          '™',
          'ℹ',
          '🔟',
          '📶',
          '📳',
          '📴',
          '🍔',
          '🍙',
          '🍰',
          '🍜',
          '🍞',
          '🍳',
          '🍦',
          '🍟',
          '🍡',
          '🍘',
          '🍚',
          '🍝',
          '🍛',
          '🍢',
          '🍣',
          '🍱',
          '🍲',
          '🍧',
          '🍖',
          '🍥',
          '🍠',
          '🍕',
          '🍗',
          '🍨',
          '🍩',
          '🍪',
          '🍫',
          '🍬',
          '🍭',
          '🍮',
          '🍯',
          '🍤',
          '🍴',
          '☕',
          '🍸',
          '🍺',
          '🍵',
          '🍶',
          '🍷',
          '🍻',
          '🍹',
          '↗',
          '↘',
          '↖',
          '↙',
          '⤴',
          '⤵',
          '↔',
          '↕',
          '⬆',
          '⬇',
          '➡',
          '⬅',
          '▶',
          '◀',
          '⏩',
          '⏪',
          '⏫',
          '⏬',
          '🔺',
          '🔻',
          '🔼',
          '🔽',
          '⭕',
          '❌',
          '❎',
          '❗',
          '⁉',
          '‼',
          '❓',
          '❔',
          '❕',
          '〰',
          '➰',
          '❤',
          '💓',
          '💔',
          '💕',
          '💖',
          '💗',
          '💘',
          '💙',
          '💚',
          '💛',
          '💜',
          '💝',
          '💞',
          '💟',
          '♥',
          '♠',
          '♦',
          '♣',
          '🚬',
          '🚭',
          '♿',
          '🚩',
          '⚠',
          '⛔',
          '♻',
          '🚲',
          '🚶',
          '🚹',
          '🚺',
          '🛀',
          '🚻',
          '🚽',
          '🚾',
          '🚼',
          '🚪',
          '🚫',
          '✔',
          '🆑',
          '🆒',
          '🆓',
          '🆔',
          '🆕',
          '🆖',
          '🆗',
          '🆘',
          '🆙',
          '🆚',
          '🈁',
          '🈂',
          '🈲',
          '🈳',
          '🈴',
          '🈵',
          '🈶',
          '🈚',
          '🈷',
          '🈸',
          '🈹',
          '🈯',
          '🈺',
          '㊙',
          '㊗',
          '🉐',
          '🉑',
          '➕',
          '➖',
          '✖',
          '➗',
          '💠',
          '💡',
          '💢',
          '💣',
          '💤',
          '💥',
          '💦',
          '💧',
          '💨',
          '💩',
          '💪',
          '💫',
          '💬',
          '✨',
          '✴',
          '✳',
          '⚪',
          '⚫',
          '🔴',
          '🔵',
          '🔲',
          '🔳',
          '⭐',
          '⬜',
          '⬛',
          '▫',
          '▪',
          '◽',
          '◾',
          '◻',
          '◼',
          '🔶',
          '🔷',
          '🔸',
          '🔹',
          '❇',
          '💮',
          '💯',
          '↩',
          '↪',
          '🔃',
          '🔊',
          '🔋',
          '🔌',
          '🔍',
          '🔎',
          '🔒',
          '🔓',
          '🔏',
          '🔐',
          '🔑',
          '🔔',
          '☑',
          '🔘',
          '🔖',
          '🔗',
          '🔙',
          '🔚',
          '🔛',
          '🔜',
          '🔝',
          '✅',
          '✊',
          '✋',
          '✌',
          '👊',
          '👍',
          '☝',
          '👆',
          '👇',
          '👈',
          '👉',
          '👋',
          '👏',
          '👌',
          '👎',
          '👐'
        ]
      }
    ]
    this.editor.customConfig.uploadImgShowBase64 = true
    this.editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image' // 插入图片
    ]
    /* 自定义上传图片 */
    this.editor.customConfig.showLinkImg = false
    this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024
    this.editor.customConfig.uploadImgHeaders = {
      'access-token': this.$store.getters.access_token
    }
    this.editor.customConfig.customUploadImg = (files, insert) => {
      let file = files[0]
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
      if (
        ['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) === -1
      ) {
        this.$message.error('请上传正确文件')
        return false
      }
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        let base64 = reader.result // base64就是图片的转换的结果
        const param = {
          Base64Str: base64,
          Root: this.$root.filePaths.COLLEGE_INFAST
        }
        COMMON_API_IMAGE_UPLOAD64TOOSS(param).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.editLoading = true
            setTimeout(() => {
              // 波波说延迟3秒加载
              insert(this.$root.settings.DOMAIN_IMG_FILE + res.data.Data.Path)
              this.editLoading = false
            }, 3000)
          } else {
            this.$message.error('上传失败')
          }
        })
      }
    }
    this.editor.create()
  },
  watch: {
    Note() {
      this.editor.txt.html(this.Note)
    }
  }
}
</script>
<style lang="scss" scoped>
// 还原默认值
/deep/ .w-e-text-container ol {
  display: block !important;
  list-style-type: decimal !important;
  margin-block-start: 1em !important;
  margin-block-end: 1em !important;
  margin-inline-start: 0px !important;
  margin-inline-end: 0px !important;
  padding-inline-start: 40px !important;
}
/deep/ .w-e-text-container ul {
  display: block !important;
  list-style-type: disc !important;
  margin-block-start: 1em !important;
  margin-block-end: 1em !important;
  margin-inline-start: 0px !important;
  margin-inline-end: 0px !important;
  padding-inline-start: 40px !important;
}
</style>
