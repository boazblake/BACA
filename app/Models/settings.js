
import m from 'mithril'
import { rIC } from "@/Utils/request-idle.js"
const Settings = {
  winW: 0,
  screenSize: ''
}

const getWinSize = (w) => {
  if (w < 464) return "phone"
  if (w < 624) return "wide"
  if (w < 1140) return "tablet"
  return "desktop"
}

export const checkWidth = () => {
  const w = window.innerWidth
  if (Settings.winW !== w) {
    Settings.winW = w
    var lastProfile = Settings.screenSize
    Settings.screenSize = getWinSize(w)
    if (lastProfile != Settings.screenSize) { m.redraw() }
  }
  return rIC(checkWidth)
}

checkWidth()

export default Settings
