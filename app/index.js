import App from "./app.js"
import Model from "./Models.js"
import { FP } from "FP"
FP.configure()

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
        .register("./service-worker.js")
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
  if (w < 668) return "phone"
  if (w < 920) return "tablet"
  return "desktop"
}

const checkWidth = (winW) => {
  const w = window.innerWidth
  if (winW !== w) {
    winW = w
    var lastProfile = Model.settings.profile
    Model.settings.profile = getProfile(w)
    if (lastProfile != Model.settings.profile) m.redraw()
  }
  return requestAnimationFrame(checkWidth)
}

Model.settings.profile = getProfile(winW)

checkWidth(winW)

m.route(root, "/", App(Model))
