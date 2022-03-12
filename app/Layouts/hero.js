import Images from "../images.js"

const state = {
  image: Stream(0),
  start: Stream(null),
  timestamp: undefined,
}

const calcHeight = ({
  state: { showNavMenu, distanceFromTop },
  settings: { screenSize },
}) => {
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

const calcMargin = ({
  state: { showNavMenu, distanceFromTop },
  settings: { screenSize },
}) => {
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

const updateBackground = (timestamp) => {
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
      requestAnimationFrame(updateBackground)
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
            src: image,
            key: idx,
            class: state.image() == idx ? "fadeInRight" : "fadeOutLeft",
            onload: (e) => e.target.classList.replace("fadeout", "fadeInRight"),
            style: {
              height: calcHeight(mdl),
            },
          })
        ),
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
