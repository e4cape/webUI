// 任务类型;
export const QuartzJobType = {
  'Timer': 1,
  'Queue': 3,
  'Types': {
    '1': '定时任务',
    '3': '侦听队列'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '定时任务'},
    {'KeyId': '3', 'Value': '侦听队列'}
  ]
}
// 任务状态;
export const QuartzJobState = {
  'Remove': 1,
  'Stop': 3,
  'Running': 5,
  'Types': {
    '1': '已删除',
    '3': '未启动',
    '5': '已启动'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '已删除'},
    {'KeyId': '3', 'Value': '未启动'},
    {'KeyId': '5', 'Value': '已启动'}
  ]
}