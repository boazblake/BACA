const Main = () => {
  return {
    view: ({ attrs: { mdl, children } }) =>
      m(
        "main",
        m("section", m("h1#page-title.is-center.bold", mdl.state.route.name)),
        children
      ),
  }
}

export default Main
