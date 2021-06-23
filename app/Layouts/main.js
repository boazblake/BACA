const Main = () => {
  return {
    view: ({ attrs: { mdl, children } }) =>
      m("main.container", m("h1", mdl.state.route.name), children),
  }
}

export default Main
