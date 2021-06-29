const Home = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        ".",
        m("section", "Upcoming Events"),
        m("section", "Carousel of Latest Album Images uploaded"),
        m("section", "Latest Blog Post"),
        m("section", "Latest Blog Post")
      ),
  }
}

export default Home
