const Carousel = () => {
  return {
    oncreate: ({ dom }) => Sirv.viewer.getInstance(dom),
    view: ({ attrs: { mdl, data } }) => {
      return m(
        "#carousel.Sirv",
        {
          "data-options": `thumbnails.position: ${
            data.length > 5 ? "bottom" : "left"
          };
            orientation:horizontal;viewer.quality:100;
            viewer.hdQuality:100;`,
        },
        data.map((img) => {
          mdl.addToCart.id(img)
          return m("#carousel-img", {
            "data-src": `${img}`,
          })
        })
      )
    },
  }
}

export default Carousel
