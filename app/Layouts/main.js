const Main = () => {
  return {
    view: ({ attrs: { mdl, children } }) =>
      m(
        "main",
        m(
          "section#page-title.is-marginless.bg-primary.text-white.is-vertical-align.is-horizontal-align.is-center",
          m("h1.text-center.bold.p-t-25", mdl.state.route.name)
        ),
        children
      ),
  }
}

export default Main
