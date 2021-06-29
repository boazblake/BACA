import Images from "../images"

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
        ".hero",
        {
          style: {
            marginTop: calcMargin(mdl),
          },
        },
        m("img.hero-img", {
          src: Images[mdl.state.image()],
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
