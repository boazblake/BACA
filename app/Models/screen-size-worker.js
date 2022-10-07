
import { rIC } from "@/Utils/request-idle.js"


const getWinSize = (w) => {
  if (w < 464) return "phone"
  if (w < 624) return "wide"
  if (w < 1100) return "tablet"
  if (w < 1420) return "laptop"
  return "desktop"
}

onmessage = ({ data: { w, Settings } }) => {
  const checkWidth = () => {
    if (Settings.winW !== w) {
      Settings.winW = w
      const lastProfile = Settings.screenSize
      // console.log({ lastProfile, size: getWinSize(w) })
      postMessage({ lastProfile, size: getWinSize(w) })
    }
    return rIC(checkWidth)
  }

  return checkWidth()
}
