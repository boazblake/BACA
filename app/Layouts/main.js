const Main = () => {
  return {
    view: ({ attrs: { mdl, children } }) =>
      m(
        "main",
        m(
          "section#page-title.is-marginless.bg-primary.card.text-white",
          m("h1.is-center.bold", mdl.state.route.name)
        ),
        children
      ),
  }
}

export default Main
