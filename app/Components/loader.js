import { FadeBack } from "Styles/animations"

const Loader = () => {
  return {
    view: () =>
      m(
        ".logoLoader",
        { onremove: FadeBack },
        m("img.heartbeat", { src: "images/logo.webp" })
      ),
  }
}

export default Loader
