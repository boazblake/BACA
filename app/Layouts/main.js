const Main = () => {
  return {
    view: ({ attrs: { mdl, children } }) =>
      m(
        "main.container",
        m("header", m("h1.bold", mdl.state.route.name)),
        children
      ),
  }
}

export default Main
