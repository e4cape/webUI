export const saleBar = {
  color: ['#e66969', '#a1a1a1', '#54aae5', '#e5323e'],
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['销售', '退货', '实销'],
    bottom: '5%'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '13%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '销售',
      type: 'bar',
      barWidth: '10%',
      data: []
    }, {
      name: '退货',
      type: 'bar',
      barWidth: '10%',
      data: []
    }, {
      name: '实销',
      type: 'bar',
      barWidth: '10%',
      data: []
    }
  ]
}

export const profitBar = {
  color: ['#0099cc'],
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['毛利报表'],
    bottom: '5%'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '13%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '毛利',
      type: 'bar',
      barWidth: '10%',
      data: []
    }
  ]
}

export const profitRate = {
  title: {
    text: ''
  },
  color: ['#0099cc', '#cccccc', '#ffcc33', '#666699', '#009999', '#cc0066', '#cc6600', '#ff6666', '#990033', '#74c052'],
  tooltip: {
    trigger: 'axis',
    formatter: '{a} <br/>{b}: {c} %'
  },
  legend: {
    data: [],
    bottom: '5%'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: 'category',
    data: []
  },
  series: []
}

export const giftSaleBar = {
  color: ['#B65F7F', '#39A0E5', '#FFC045', '#95c746', '#DF5A5B',],
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['订单数量', '礼品数量', '人数', '积分兑换', '礼金兑换'],
    bottom: '5%'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '13%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '订单数量',
      type: 'bar',
      barWidth: '10%',
      data: []
    }, {
      name: '礼品数量',
      type: 'bar',
      barWidth: '10%',
      data: []
    }, {
      name: '人数',
      type: 'bar',
      barWidth: '10%',
      data: []
    },
    {
      name: '积分兑换',
      type: 'bar',
      barWidth: '10%',
      data: []
    },
    {
      name: '礼金兑换',
      type: 'bar',
      barWidth: '10%',
      data: []
    }
  ]
}
