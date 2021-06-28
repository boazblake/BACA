import Images from "../images"

const calcHeight = ({ settings: { screenSize } }) => {
  switch (screenSize) {
    case "desktop":
      return "540px"
    case "tablet":
      return "340px"
    case "phone":
      return "340px"
  }
}

const updateBackground = (mdl) => {
  mdl.state.image() == Images.length - 1
    ? mdl.state.image(0)
    : mdl.state.image(mdl.state.image() + 1)
}

const Hero = () => {
  return {
    onremove: () => clearInterval(updateBackground),
    oncreate: ({ attrs: { mdl } }) =>
      setInterval(() => updateBackground(mdl), 500),
    view: ({ attrs: { mdl } }) =>
      m(
        "section.hero",
        m("img.hero-img", {
          src: Images[mdl.state.image()],
          style: { height: calcHeight(mdl) },
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
