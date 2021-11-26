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
          registration.addEventListener('updatefound', function() {
            // If updatefound is fired, it means that there's
            // a new service worker being installed.
            var installingWorker = registration.installing;
            console.log('A new service worker is being installed:',
              installingWorker);

            // You can listen for changes to the installing service worker's
            // state via installingWorker.onstatechange
          });
        })
        .catch(function(error) {
          console.log('Service worker registration failed:', error);
        })
        })
        .catch((registrationError) => {
          console.log("🧟 SW registration failed: ", registrationError)
        })
    })
  }
}

// set display profiles
const getProfile = (w) => {
  if (w < 424) return "phone"
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
    console.error("shit", e)
  }
  const onSuccess = (user) => {
    Model.user = user
    user.emailVerified ? Model.state.isAuth(true) : sessionStorage.clear()
  }

  Model.http.back4App.getTask(Model)(`users/me`).fork(onError, onSuccess)
}

m.route(root, "/", App(Model))
m.route.set("/about")
