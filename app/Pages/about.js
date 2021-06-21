const About = (mdl) => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        ".",
        m("section", m("p", "sec1")),
        m("section", m("p", "sec2")),
        m("section", m("p", "sec3")),
        m("section", m("p", "sec1")),
        m("section", m("p", "sec2")),
        m("section", m("p", "sec3")),
        m("section", m("p", "sec2")),
        m("section", m("p", "sec3")),
        m("section", m("p", "sec1")),
        m("section", m("p", "sec2")),
        m("section", m("p", "sec3"))
      ),
  }
}

export default About
