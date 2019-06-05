export function hasClass(obj, cls) {
  return obj.className.match(new RegExp(`(\\s|^)${cls}(\\s|$)`))
}

export function addClass(obj, cls) {
  if (!hasClass(obj, cls)) {
    obj.className += ` ${cls}`
  }
}

export function removeClass(obj, cls) {
  if (hasClass(obj, cls)) {
    const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`)
    obj.className = obj.className.replace(reg, ' ')
  }
}
export function removeElement(_element) {
  const _parentElement = _element.parentNode
  if (_parentElement) {
    _parentElement.removeChild(_element)
  }
}
export function offset(target) {
  let top = 0
  let left = 0
  while (target.offsetParent) {
    top += target.offsetTop
    left += target.offsetLeft
    target = target.offsetParent
  }
  return {
    top,
    left
  }
}
export function compare(property) {
  return function(a) {
    return a[property] - a[property]
  }
}

export function DataGroup (arr, id) {
  const map = {
  }
  const dest = []
  for (let i = 0; i < arr.length; i++) {
    const ai = arr[i]
    if (!map[ai[id]]) {
      const obj = {
      }
      obj[id] = ai[id]
      obj.data = [ai]
      dest.push(obj)
      map[ai[id]] = ai
    } else {
      for (let j = 0; j < dest.length; j++) {
        const dj = dest[j]
        if (dj[id] === ai[id]) {
          dj.data.push(ai)
          break
        }
      }
    }
  }
  return dest
}
