const Home = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(".masonry", {
        style: { height: "100vh", width: "100vw" },
      }),
  }
}

export default Home
