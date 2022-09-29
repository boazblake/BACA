import m from 'mithril'
import {
  compose,
  last,
  join,
  values,
  props,
  assoc,
  test,
  prop,
  filter,
  sortBy,
  toLower,
  identity,
  reverse,
  slice,
  split,
  trim,
  max,
  toPairs,
  min,
  add,
  map,
  flatten,
  reduce,
  type,
  equals,
} from "ramda"
import Task from "data.task"

export const makeRoute = compose(join("-"), split(" "), trim(), toLower())

export const isEmpty = (data) => data.length == 0

export const infiniteScroll = (mdl) => (e) => {
  let route = mdl.state.route
  let length = mdl.data[route].data.length
  let setpoint = 10 * length * mdl.state.scrollPos
  if (e.target.scrollTop - mdl.state.scrollPos >= setpoint) {
    mdl.state.scrollPos++ + e.target.scrollTop
  }
}

export const addTerms = (item) => {
  const terms = compose(join(" "), values, props(["uuid", "id", "name"]))(item)

  return assoc("_terms", terms, item)
}

const byTerms = (query) => compose(test(new RegExp(query, "i")), prop("name"))

export const _search = (query) => compose(filter(byTerms(query)))

export const _sort = (p) => sortBy(compose(toLower, toString, prop(p)))

export const _direction = (dir) => (dir == "asc" ? identity : reverse)

export const _paginate = (offset) => (limit) => (data) =>
  slice(
    max(0, min(offset, data.length)),
    min(offset + limit, data.length),
    data
  )

export const filterTask =
  (query) => (prop) => (direction) => (offset) => (limit) =>
    compose(
      Task.of,
      map(_paginate(offset)(limit)),
      map(_direction(direction)),
      map(_sort(prop)),
      _search(query)
    )

export const debounce = (wait, now) => (fn) => {
  let timeout = undefined
  return function () {
    let context = this
    let args = arguments
    let later = function () {
      timeout = undefined
      if (!now) fn.apply(context, args)
    }
    let callNow = now && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    console.log(fn)
    if (callNow) fn.apply(context, args)
  }
}

export const getRoute = () => last(m.route.get().split("/"))

export const scrollToAnchor = (anchor) => {
  let is = (el) => el !== undefined && el !== null
  //if you pass an undefined anchor it will scroll to the top of the body
  let targetEl = is(anchor) ? document.getElementById(anchor) : document.body
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop
  let target = is(targetEl) ? targetEl.getBoundingClientRect().top : 0

  return window.scroll({
    top: target + scrollTop - 150,
    left: 0,
    behavior: "smooth",
  })
}

export const randomEl = (list) => list[Math.floor(Math.random() * list.length)]

export const jsonCopy = (src) => structuredClone(src)

export const isActiveRoute = (route) =>
  m.route.get() == route ? "is-active" : ""

export const uuid = () => {
  return "xxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const listOf = (x) => (y) => Array(x).fill(y)

export const DAYSOFWEEK = ["Sun", "Mon", "Teus", "Wed", "Thurs", "Fri", "Sat"]

export const formatDate = (date) =>
  date.split("T")[0]


export const handlers = (types, fn) =>
  types.reduce((acc, type) => Object.assign(acc, { [type]: fn }), {})

export const exists = (xs) => xs.length >= 1
export const oneExists = (xs, ys) => exists(xs) || exists(ys)

export const ScrollToPageTitle = () =>
  document.getElementById("page-title")
    ? document.getElementById("page-title").scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    })
    : window.scroll({
      top: 160,
      left: 0,
      behavior: "smooth",
    })

export const AVATAR_URL = "https://i.ibb.co/6W0zsZH/avatar.webp"

export const getUserByUserId = (userId, mdl) =>
  mdl.data.users.find((u) => u.objectId == userId)

export const confirmTask = (msg) =>
  new Task((rej, res) => (window.confirm(msg) ? res() : rej()))

export const isAdminOrMod = (mdl) => ["admin", "mod"].includes(mdl.user.role)

const getBase64 = file => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => res(reader.result))
    reader.readAsDataURL(file)
  })
}

const resizeBase64Img = (base64) => {
  const MAX_WIDTH = 960;
  const MAX_HEIGHT = 540;
  const MIME_TYPE = navigator.userAgent.includes('Safari') ? "image/png" : "image/webp"
  // const QUALITY = 0.7;
  return new Promise((res, rej) => {
    const img = new Image()
    img.src = base64;
    return img.onload = function () {
      URL.revokeObjectURL(img.src)
      const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT)
      const canvas = document.createElement("canvas")
      canvas.width = newWidth
      canvas.height = newHeight
      const context = canvas.getContext("2d")
      context.drawImage(img, 0, 0, newWidth, newHeight);
      return canvas.toBlob(
        (blob) => {
          if (blob === null) {
            return rej(blob);
          } else {
            res(canvas.toDataURL(MIME_TYPE));
          }
        },
        MIME_TYPE, 0.8
      );
    }

  })
}

function calculateSize(img, maxWidth, maxHeight) {
  let width = img.width;
  let height = img.height;

  // calculate the width and height, constraining the proportions
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }
  return [width, height];
}

export const toWebpFormat = file => getBase64(file).then(resizeBase64Img)

export const ofP = x => new Promise((resolve) => resolve(x))

export const toUploadB64 = b64 => {
  const MIME_TYPE = navigator.userAgent.includes('Safari') ? "image/png" : "image/webp"
  return b64.replace(`data:${MIME_TYPE};base64,`, '')
}

export const resizeImageTask = img => new Task((rej, res) =>
  toWebpFormat(img).then(toUploadB64).then(res, rej))

export const requestCallBack = fn => isChrome() ? requestIdleCallback(fn) : requestAnimationFrame(fn)

export const isChrome = () => !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)

