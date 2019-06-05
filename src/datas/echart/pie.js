export const pie = {
  title: {
    text: '',
    subtext: '',
    x: 'center',
    y: 'center',
    textStyle: {
      color: '#333',
      fontSize: '18'
    },
    subtextStyle: {
      color: '#888',
      fontSize: '14'
    }
  },
  color: ['#0099cc', '#cccccc', '#ffcc33', '#666699', '#009999', '#cc0066', '#cc6600', '#ff6666', '#990033', '#74c052'],
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: ['45%', '80%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center'
        },
        emphasis: {
          show: false,
          textStyle: {
            fontSize: '20',
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: []
    }
  ]
}
