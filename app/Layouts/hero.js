import Toolbar from "./toolbar.js"
const Hero = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        ".hero",
        // m(Toolbar, { mdl }),
        m("header", [
          m(
            "hgroup",
            { style: { backgroundColor: "rgba(255,255,255, 0.3)" } },
            [m("h1", "Bonham Acres"), m("h2", "Houstons best kept secret")]
          ),
          // m(
          //   "p",
          //   m(
          //     "a",
          //     { href: "#", role: "button", onclick: "event.preventDefault()" },
          //     "Call to action"
          //   )
          // ),
        ])
      ),
  }
}

export default Hero
