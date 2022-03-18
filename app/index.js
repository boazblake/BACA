import { FunConfig } from "@boazblake/fun-config"
import App from "./app.js"
import Model from "Models/index.js"

window.perf = (fn) => {
  const startTime = performance.now()

  // Do the normal stuff for this function

  const duration = performance.now() - startTime
  console.log(`${fn} took ${duration}ms`)
}

FunConfig.configure()

Model.navState = Model.Routes.reduce((acc, r) => {
  if (r.children.any()) acc[r.id] = Stream(false)
  return acc
}, {})

const root = document.body
let winW = window.innerWidth

window.log = (m) => (v) => {
  console.log(m, v)
  return v
}

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
          // Notification.requestPermission(function (result) {
          //   if (result === "granted") {
          //     navigator.serviceWorker.ready.then(function (registration) {
          //       registration.showNotification("Notification with ServiceWorker")
          //     })
          //   }
          // })
          // registration.pushManager.getSubscription()

          // //Subscribes user to Push notifications
          // registration.pushManager
          //   .subscribe({
          //     userVisibleOnly: true, //Set user to see every notification
          //   })
          //   .then((subscription) => {
          //     addSuccess("Subscribed successfully.")
          //     console.info("Push notification subscribed.")
          //     console.log(subscription)
          //   })
          //   .catch((error) => {
          //     console.error("Push notification subscription error: ", error)
          //   })
        })
        .catch((registrationError) => {
          console.log("🧟 SW registration failed: ", registrationError)
        })
    })
  }
}
// set display profiles
const getProfile = (w) => {
  if (w < 464) return "phone"
  if (w < 624) return "wide"
  if (w < 1000) return "tablet"
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

if (sessionStorage.getItem("baca-session-token")) {
  const onError = (e) => {
    sessionStorage.clear()
    console.error("problem fetching user", e)
  }
  const onSuccess = (user) => {
    Model.user = user
    Model.user.routename = user.name.replaceAll(" ", "")
    user.emailVerified ? Model.state.isAuth(true) : sessionStorage.clear()
  }

  Model.http.back4App.getTask(Model)(`users/me`).fork(onError, onSuccess)
}

m.route(root, "/", App(Model))
