import m from "mithril"
import Images from "../images.js"
import Stream from "mithril-stream"
import { rIC } from "@/Utils/request-idle.js"

const state = {
  image: Stream(0),
  start: Stream(null),
  timestamp: undefined,
}

const calcHeight = ({
  state: { navState, navSelected, subnavState },
  settings: { screenSize },
}) => {
  switch (screenSize) {
    case "desktop":
      return "440px"
    case "laptop":
      return "440px"
    case "tablet":
      return "240px"
    case "wide":
      return "240px"
    case "phone":
      return "240px"
  }
}

const calcMargin = ({
  state: { showingSubnav },
  settings: { screenSize },
}) => {

  if (showingSubnav()) {
    return '0px'
  }

  switch (screenSize) {
    case "desktop":
      return "150px"
    case "laptop":
      return "150px"
    case "tablet":
      return "0px"
    case "wide":
      return "0px"
    case "phone":
      return "0px"
  }
}

const updateBackground = (timestamp) => {
  if (Date.now() - state.start() > 5000) {
    state.start(Date.now())
    state.image() == Images.length - 1
      ? state.image(0)
      : state.image(state.image() + 1)
    m.redraw()
  }
  setTimeout(() => rIC(updateBackground))
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
      setTimeout(() => rIC(updateBackground))
    },
    view: ({ attrs: { mdl } }) =>
      m(
        "#hero",
        {
          style: {
            marginTop: calcMargin(mdl),
          },
        },
        Images.map((image, idx) =>
          m("img.hero-img.animated.fadeout", {
            alt: "hero",
            key: idx,
            loading: 'lazy',
            class: state.image() == idx ? "fadeInRight" : "fadeOutLeft",
            onload: (e) => e.target.classList.replace("fadeout", "fadeInRight"),
            style: {
              height: calcHeight(mdl),
              backgroundImage: `url(${image})`,
              backgroundSize: `100% 100%`,
            },
          })
        ),
        m(
          "header",
          m(
            "hgroup",
            m("h1", "Bonham Acres"),
            m("h2.smaller", "We are Houston's best kept secret!")
          )
        )
      ),
  }
}

export default Hero

