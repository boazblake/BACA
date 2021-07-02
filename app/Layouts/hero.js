import Images from "../images"
import { FadeBack } from "Styles/animations"

const state = {
  image: Stream(0),
  start: Stream(null),
}

const calcHeight = ({ settings: { screenSize } }) => {
  switch (screenSize) {
    case "desktop":
      return "540px"
    case "tablet":
      return "340px"
    case "wide":
      return "340px"
    case "phone":
      return "340px"
  }
}

const calcMargin = ({ settings: { screenSize } }) => {
  switch (screenSize) {
    case "desktop":
      return "150px"
    case "tablet":
      return "90px"
    case "wide":
      return "70px"
    case "phone":
      return "30px"
  }
}

const updateBackground = () => {
  if (Date.now() - state.start() > 5000) {
    state.start(Date.now())
    state.image() == Images.length - 1
      ? state.image(0)
      : state.image(state.image() + 1)
    m.redraw()
  }
  requestAnimationFrame(updateBackground)
}

const Hero = () => {
  return {
    onremove: () => {
      state.images(0)
      state.start(null)
      cancelAnimationFrame(updateBackground)
    },
    oncreate: ({ attrs: { mdl } }) => {
      state.start(Date.now())
      updateBackground()
    },
    view: ({ attrs: { mdl } }) =>
      m(
        ".hero",
        {
          style: {
            marginTop: calcMargin(mdl),
          },
        },
        m("img.hero-img.fade", {
          src: Images[state.image()],
          onload: (e) => e.target.classList.replace("fadeout", "fade"),
          onupdate: FadeBack,
          style: {
            height: calcHeight(mdl),
          },
        }),
        m(
          "header",
          m(
            "hgroup",
            m("h1", "Bonham Acres"),
            m("h2", "We are Houstons best kept secret")
          )
        )
      ),
  }
}

export default Hero
