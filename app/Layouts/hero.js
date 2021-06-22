const images = [
  "images/IMG_4029.webp",
  "images/IMG_3989.webp",
  "images/IMG_3990.webp",
  "images/IMG_3991.webp",
  "images/IMG_3992.webp",
  "images/IMG_3993.webp",
  "images/IMG_3994.webp",
  "images/IMG_3995.webp",
  "images/IMG_3996.webp",
  "images/IMG_3997.webp",
  "images/IMG_3998.webp",
  "images/IMG_3999.webp",
  "images/IMG_4001.webp",
  "images/IMG_4002.webp",
  "images/IMG_4003.webp",
  "images/IMG_4004.webp",
  "images/IMG_4005.webp",
  "images/IMG_4006.webp",
  "images/IMG_4007.webp",
  "images/IMG_4008.webp",
  "images/IMG_4009.webp",
  "images/IMG_4010.webp",
  "images/IMG_4011.webp",
  "images/IMG_4012.webp",
  "images/IMG_4013.webp",
  "images/IMG_4014.webp",
  "images/IMG_4015.webp",
  "images/IMG_4016.webp",
  "images/IMG_4017.webp",
  "images/IMG_4018.webp",
  "images/IMG_4019.webp",
  "images/IMG_4020.webp",
  "images/IMG_4021.webp",
  "images/IMG_4022.webp",
  "images/IMG_4023.webp",
  "images/IMG_4024.webp",
  "images/IMG_4025.webp",
  "images/IMG_4026.webp",
  "images/IMG_4027.webp",
  "images/IMG_4028.webp",
]

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

const Hero = () => {
  return {
    onremove: ({ attrs: { mdl } }) => {
      state.timer && clearInterval(state.timer)
    },
    oncreate: ({ attrs: { mdl } }) => {
      mdl.state.image() > images.length - 1
        ? mdl.state.image(0)
        : mdl.state.image(mdl.state.image() + 1)
    },
    view: ({ attrs: { mdl } }) =>
      m(
        "section.hero",
        m("img.hero-img", {
          src: images[mdl.state.image()],
          style: { height: calcHeight(mdl) },
        }),
        m("header", [
          m(
            "hgroup",
            {
              style: { zIndex: 10, backgroundColor: "rgba(255,255,255, 0.7)" },
            },
            [m("h1", "Bonham Acres"), m("h2", "Houstons best kept secret")]
          ),
        ])
      ),
  }
}

export default Hero
