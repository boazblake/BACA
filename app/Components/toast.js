import m from "mithril"
import { uuid } from "@/Utils/helpers"

const toastTypes = ["info", "warning", "success", "danger"]
// Toasts.js
const state = {
  list: [],
  destroy: (id) => {
    let index = state.list.findIndex((x) => x.id === id)
    state.list.splice(index, 1)
  },
}

export const addSuccess = ({ text, timeout, style }) => {
  state.list.push({ id: uuid(), type: "success", text, timeout, style })
}

export const addInfo = ({ text, timeout, style }) => {
  state.list.push({ id: uuid(), type: "info", text, timeout, style })
}
export const addWarning = ({ text, timeout, style }) => {
  state.list.push({ id: uuid(), type: "warning", text, timeout, style })
}
export const addDanger = ({ text, timeout, style }) => {
  state.list.push({ id: uuid(), type: "danger", text, timeout, style })
}

const toastType = (type) => (toastTypes.includes(type) ? type : "info")

const destroyToast = ({ dom, attrs: { id } }) => {
  dom.classList.add("destroy")
  setTimeout(() => {
    state.destroy(id)
    m.redraw()
  }, 300)
}

let Toast = (vnode) => {
  setTimeout(() => {
    destroyToast(vnode)
  }, vnode.attrs.timeout || 3000)

  return {
    view: ({ attrs: { type, text, style } }) => {
      return m(
        ".m-notification",
        {
          style,
          class: toastType(type),
          onclick: () => destroyToast(vnode),
        },
        text
      )
    },
  }
}

export default {
  view: () =>
    state.list.any() &&
    m(
      ".m-notifications",
      state.list.map((msg) => m("div", { key: msg.id }, m(Toast, msg)))
    ),
}
