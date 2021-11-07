import { fetchAll } from "../Layouts"
import DateTime from "Components/DateTime"

const State = {
  events: null,
  blogs: null,
  images: null,
}

const createCarousel = (dom) => {
  let slides = dom.children[1]
  let prev = dom.children[2]
  let next = dom.children[3]
  const slider = new Glider(slides, {
    // `auto` allows automatic responsive
    // width calculations
    slidesToShow: "auto",
    slidesToScroll: "auto",

    // should have been named `itemMinWidth`
    // slides grow to fit the container viewport
    // ignored unless `slidesToShow` is set to `auto`
    itemWidth: "100%",

    // if true, slides wont be resized to fit viewport
    // requires `itemWidth` to be set
    // * this may cause fractional slides
    exactWidth: false,

    // speed aggravator - higher is slower
    duration: 0.5,

    // dot container element or selector
    dots: "CSS Selector",

    // arrow container elements or selector
    arrows: {
      prev,
      // may also pass element directly
      next,
    },

    // allow mouse dragging
    draggable: false,
    // how much to scroll with each mouse delta
    dragVelocity: 3.3,

    // use any custom easing function
    // compatible with most easing plugins
    easing: function (x, t, b, c, d) {
      return c * (t /= d) * t + b
    },

    // event control
    scrollPropagate: false,
    eventPropagate: true,

    // Force centering slide after scroll event
    scrollLock: false,
    // how long to wait after scroll event before locking
    // if too low, it might interrupt normal scrolling
    scrollLockDelay: 150,

    // Force centering slide after resize event
    resizeLock: true,

    // Glider.js breakpoints are mobile-first
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  })

  State[dom.id] = slider
}

const SliderController = (mdl) => ({
  oncreate: ({ dom }) => createCarousel(dom),
  // onupdate: (e) => console.log(e),
  onbeforeremove: ({ dom }) => State[dom.id].destroy(),
})

const Home = () => {
  return {
    oninit: fetchAll,
    view: ({ attrs: { mdl } }) =>
      m(
        "article.grid",
        m(
          "section.row.p-b-25.bg-light",
          mdl.data.events.any() &&
            m(
              ".container.glider-contain",
              SliderController(mdl),
              m("h2.is-center", "Upcoming Events!"),
              m(
                ".grouped.#events.glider",
                {
                  style: {
                    maxHeight: "60vh",
                  },
                },
                mdl.data.events.map((event, idx) =>
                  m(
                    ".card.is-vertical-align row",
                    {
                      key: idx,
                      style: {
                        backgroundImage: event.image,

                        alignContent: "stretch",
                      },
                    },
                    event.allDay && m(".tag", "All Day Event!"),
                    m("h4.text-primary", event.title),
                    m("img", {
                      style: {
                        maxHeight: "100px",
                      },
                      src: event.image,
                    }),
                    m(DateTime, { event }),
                    m(
                      m.route.Link,
                      {
                        selector: "label",
                        class: "button primary outline is-full-width",
                        onclick: () =>
                          mdl.state.selectedPreviewEvent(event.objectId),
                        href: "/social/events",
                      },
                      "...Read More"
                    )
                  )
                )
              ),
              m("button.button.outline.dark", "PREV"),
              m("button.button.outline.dark", "NEXT")
            )
        ),
        m(
          "section.row.p-b-25.bg-primary.text-white",
          mdl.data.images.any() &&
            m(
              ".container.glider-contain",
              SliderController(mdl),
              m("h2.is-center", "Recent Photos"),
              m(
                ".grouped.#images.glider",
                {
                  style: {
                    maxHeight: "60vh",
                  },
                },
                mdl.data.images.map((img, idx) =>
                  m("img.card.auto", {
                    key: idx,
                    src: img.thumb,
                    style: {
                      alignContent: "stretch",
                    },
                  })
                )
              ),
              m("button.button.outline", "PREV"),
              m("button.button.outline", "NEXT")
            )
        ),
        m(
          "section.row.p-b-25.bg-light",
          mdl.data.blogs.any() &&
            m(
              ".container.glider-contain",
              SliderController(mdl),
              m("h2.is-center", "Recent Blogs"),
              m(
                ".grouped.#blogs.glider",
                {
                  style: {
                    maxHeight: "60vh",
                  },
                },
                mdl.data.blogs.map((blog, idx) =>
                  m(
                    ".card.opacity-overlay.is-vertical-align row",
                    {
                      key: idx,
                      style: {
                        alignContent: "stretch",
                      },
                    },
                    m(
                      "figure",
                      m("img", {
                        style: {
                          maxHeight: "100px",
                        },
                        src: blog.img || "images/main.webp",
                      })
                    ),
                    m("h2", blog.title),
                    m(
                      m.route.Link,
                      {
                        selector: "label",
                        class: "button primary outline is-full-width",
                        href: `/social/blog-post:${blog.objectId}`,
                      },
                      "...Read More"
                    )
                  )
                )
              ),
              m("button.button.outline.dark", "PREV"),
              m("button.button.outline.dark", "NEXT")
            )
        )
      ),
  }
}

export default Home
