import Task from "data.task"
import { Paypal, Back4App } from "../../.secrets.js"

const updatePayPalAuth = (mdl) => (paypal) => (mdl.state.paypal = paypal)

const onProgress = (mdl) => (e) => {
  if (e.lengthComputable) {
    mdl.state.loadingProgress.max = e.total
    mdl.state.loadingProgress.value = e.loaded
    m.redraw()
  }
}

function onLoad() {
  return false
}

const onLoadStart = (mdl) => (e) => {
  mdl.state.isLoading(true)
  return false
}

const onLoadEnd = (mdl) => (e) => {
  mdl.state.isLoading(false)
  mdl.state.loadingProgress.max = 0
  mdl.state.loadingProgress.value = 0
  return false
}

const xhrProgress = (mdl) => ({
  config: (xhr) => {
    xhr.onprogress = onProgress(mdl)
    xhr.onload = onLoad
    xhr.onloadstart = onLoadStart(mdl)
    xhr.onloadend = onLoadEnd(mdl)
  },
})

export const parseHttpError = (mdl) => (rej) => (e) => {
  mdl.state.isLoading(false)
  return rej(e.response)
}

export const parseHttpSuccess = (mdl) => (res) => (data) => {
  mdl.state.isLoading(false)
  return res(data)
}

const HttpTask = (_headers) => (method) => (mdl) => (url) => (body) => {
  mdl.state.isLoading(true)
  return new Task((rej, res) =>
    m
      .request({
        method,
        url,
        headers: {
          ..._headers,
        },
        body,
        withCredentials: false,
        ...xhrProgress(mdl),
      })
      .then(parseHttpSuccess(mdl)(res), parseHttpError(mdl)(rej))
  )
}

const lookupLocationTask = (query) => {
  return new Task((rej, res) =>
    m
      .request({
        method: "GET",
        url: `https://nominatim.openstreetmap.org/search?q=${query}&format=json`,
      })
      .then(res, rej)
  )
}

const getTask = (mdl) => (url) => HttpTask({})("GET")(mdl)(url)(null)

const paypalUrl = `${Paypal.sandbox.baseUrl}/`
const paypal = {
  getTokenTask: (mdl) =>
    HttpTask(Paypal.sandbox.headers())("POST")(mdl)(
      paypalUrl + "v1/oauth2/token/"
    )(`grant_type=client_credentials`).map(updatePayPalAuth(mdl)),
  getTask: (mdl) => (url) =>
    HttpTask(Paypal.sandbox.headers(mdl))("GET")(mdl)(paypalUrl + url)(null),
  postTask: (mdl) => (url) => (dto) =>
    HttpTask(Paypal.sandbox.headers(mdl))("POST")(mdl)(paypalUrl + url)(dto),
  putTask: (mdl) => (url) => (dto) =>
    HttpTask(Paypal.sandbox.headers(mdl))("PUT")(mdl)(paypalUrl + url)(dto),
}

const back4App = {
  getTask: (mdl) => (url) =>
    HttpTask(Back4App.headers(mdl, Back4App))("GET")(mdl)(
      `${Back4App.baseUrl}/${url}`
    )(null),
  postTask: (mdl) => (url) => (dto) =>
    HttpTask(Back4App.headers(mdl, Back4App))("POST")(mdl)(
      `${Back4App.baseUrl}/${url}`
    )(dto),
  putTask: (mdl) => (url) => (dto) =>
    HttpTask(Back4App.headers(mdl, Back4App))("PUT")(mdl)(
      `${Back4App.baseUrl}/${url}`
    )(dto),
}

const http = {
  back4App,
  paypal,
  HttpTask,
  getTask,
  lookupLocationTask,
}

export default http
