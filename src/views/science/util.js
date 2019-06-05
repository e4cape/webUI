import _ from 'lodash'

export function rearrangeDict(dicts) {
  const groupObjHasChildren = _.groupBy(dicts, item => item.ParentId === 0)

  function findChild(parent, ary) {
    return !ary
      ? []
      : ary.filter(({ ParentId }) => {
        return ParentId === parent.DictId
      })
  }

  function sort(aDict, bDict) {
    return -aDict.SortId + bDict.SortId
  }

  return groupObjHasChildren.true.sort(sort).map(item => ({
    ...item,
    items: findChild(item, groupObjHasChildren.false)
      .sort(sort)
      .map(o => ({ ...o, parent: item }))
  }))
}
export function dictFilterItems(dicts) {
  function removeItemField(item) {
    if (item.items && item.items.length) {
      return { ...item, items: item.items.map(removeItemField) }
    }
    delete item.items
    return item
  }
  return dicts.map(removeItemField)
}

export function dictToCascaderOptions(dicts) {
  return dicts.map(dict => {
    const obj = {
      value: dict.DictId,
      label: dict.DictName
    }
    if (dict.items && dict.items.length) {
      obj.children = dictToCascaderOptions(dict.items)
    }
    return obj
  })
}

export function getTree(
  source, // 源数据数组
  {
    id = 'id', // 源数据id对应名字
    parentId = 'parentId', // 源数据parentId对应名字
    levelOnelVal = 0, // 源数据一级时parentId的值
    children = 'children', // 子级名字
    hideNoChild = true // 是否隐藏没有子级的项
  }
) {
  const cloneSource = JSON.parse(JSON.stringify(source)) // 为了不破坏源数据结构，进行数据clone
  const tree = cloneSource.filter(item => {
    // 为筛选项添加子级
    const childArr = cloneSource.filter(childItem => {
      return childItem[parentId] == item[id]
    })
    if (childArr.length > 0) {
      item[children] = childArr
    }
    // 返回一级数据，数据在上有子级的话，上面已经筛选添加
    if (hideNoChild) {
      return item[children] && item[parentId] == levelOnelVal
    }
    return item[parentId] == levelOnelVal
  })
  return tree
}
// 特殊。数据还得根据另一个字段排列。用法参考，考试报表分类下拉框
export function getTreeSp(
  source,
  {
    id = 'id',
    parentId = 'parentId',
    levelOnelVal = 0,
    children = 'children',
    other // 另一个排序字段
  }
) {
  const cloneSource = JSON.parse(JSON.stringify(source))
  const tree = cloneSource.filter(item => {
    const childArr = cloneSource.filter(childItem => {
      return (
        (childItem[parentId] == item[id] && item[id]) ||
        childItem[other] == -item[id]
      )
    })
    if (childArr.length > 0) {
      item[children] = childArr
    }
    return item[parentId] === levelOnelVal
  })
  return tree
}
