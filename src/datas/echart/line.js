
export const financeLine = {
  color: ['#e66969', '#a1a1a1', '#54aae5', '#e5323e'],
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['收入(￥)', '支出(￥)', '纯利润(￥)', '投资回报率(%)'],
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
      name: '收入(￥)',
      type: 'line',
      barWidth: '10%',
      data: []
    }, {
      name: '支出(￥)',
      type: 'line',
      barWidth: '10%',
      data: []
    }, {
      name: '纯利润(￥)',
      type: 'line',
      barWidth: '10%',
      data: []
    }, {
      name: '投资回报率(%)',
      type: 'line',
      barWidth: '10%',
      data: []
    }
  ]
}
