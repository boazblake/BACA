import { FunConfig } from "@boazblake/fun-config"
import App from "./app.js"
import Model from "Models/index.js"

FunConfig.configure()

Model.navState = Model.Routes.reduce((acc, r) => {
  if (r.children.any()) acc[r.id] = Stream(false)
  return acc
}, {})

const root = document.body
let winW = window.innerWidth

if (module.hot) {
  module.hot.accept()
}

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!")
} else {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((registration) => {
          console.log("⚙️ SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("🧟 SW registration failed: ", registrationError)
        })
    })
  }
}

// set display profiles
const getProfile = (w) => {
  if (w < 624) return "phone"
  if (w < 944) return "tablet"
  return "desktop"
}

const checkWidth = (winW) => {
  const w = window.innerWidth
  if (winW !== w) {
    winW = w
    var lastProfile = Model.settings.screenSize
    Model.settings.screenSize = getProfile(w)
    if (lastProfile != Model.settings.screenSize) m.redraw()
  }
  return requestAnimationFrame(checkWidth)
}

Model.settings.screenSize = getProfile(winW)

checkWidth(winW)

if (sessionStorage.getItem("user")) {
  Model.user = JSON.parse(sessionStorage.getItem("user"))
  Model.state.isAuth(true)
}

m.route(root, "/", App(Model))
