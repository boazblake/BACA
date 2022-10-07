
import m from 'mithril'
import { rIC } from "@/Utils/request-idle.js"

const worker = new Worker(new URL('./screen-size-worker.js', import.meta.url), {
  type: 'module'
})


const Settings = {
  winW: 0,
  screenSize: ''
}

const getSize = () => {
  worker.postMessage({ w: window.innerWidth, Settings })
  rIC(getSize)
}

worker.onmessage = ({ data: { lastProfile, size } }) => {
  // console.log(Settings)
  Settings.screenSize = size
  if (lastProfile != size) {
    m.redraw()
  }

}


getSize()


export default Settings
