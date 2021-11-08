import { fetchAll } from "../Layouts"
import DateTime from "Components/DateTime"
import { AngleDoubleLine } from "@mithril-icons/clarity"

const State = {
  events: null,
  blogs: null,
  images: null,
}

const createCarousel = (dom) => {
  let slides = dom.children[1]
  let prev = dom.children[2].children[0]
  let next = dom.children[2].children[1]
  const slider = new Glider(slides, {
    // `auto` allows automatic responsive
    // width calculations
    slidesToShow: "auto",
    itemWidth: "100%",
    slidesToScroll: "auto",

    // should have been named `itemMinWidth`
    // slides grow to fit the container viewport
    // ignored unless `slidesToShow` is set to `auto`
    itemWidth: "100%",
    itemWidth: "100vw",

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
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          itemWidth: "100%",
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 3,
          itemWidth: "100%",
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 624,
        settings: {
          slidesToShow: 2,
          itemWidth: "100%",
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 424,
        settings: {
          slidesToShow: 1,
          itemWidth: "100%",
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
              ".glider-contain",
              SliderController(mdl),
              m("h2.is-center", "Upcoming Events!"),
              m(
                ".grouped.#events.glider",
                mdl.data.events.map((event, idx) =>
                  m(
                    ".card.is-vertical-align m-x-6 row",
                    {
                      key: idx,
                      style: {
                        backgroundImage: event.image,

                        alignContent: "stretch",
                      },
                    },
                    m(
                      "header",
                      event.allDay && m(".tag", "All Day Event!"),
                      m("h5.text-primary text-wrap", event.title)
                    ),

                    m(
                      "p",
                      m("img", {
                        style: {
                          maxHeight: "250px",
                        },
                        src: event.image,
                      }),
                      m(DateTime, { event })
                    ),

                    m(
                      m.route.Link,
                      {
                        selector: "footer",
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
              m(
                "nav.nav.p-t-25",
                m(
                  "button.button.nav-left.outline.dark",
                  m(AngleDoubleLine, {
                    style: { transform: "rotate(270deg)" },
                  })
                ),
                m(
                  "button.button.nav-right.outline.dark",
                  m(AngleDoubleLine, {
                    style: { transform: "rotate(90deg)" },
                  })
                )
              )
            )
        ),
        m(
          "section.row.p-b-25.bg-primary.text-white",
          mdl.data.images.any() &&
            m(
              ".glider-contain",
              SliderController(mdl),
              m("h2.is-center", "Recent Photos"),
              m(
                ".grouped.#images.glider",
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
              m(
                "nav.nav.p-t-25",
                m(
                  "button.button.nav-left.light.outline",
                  m(AngleDoubleLine, {
                    style: { transform: "rotate(270deg)" },
                  })
                ),
                m(
                  "button.button.nav-right.light.outline",
                  m(AngleDoubleLine, {
                    style: { transform: "rotate(90deg)" },
                  })
                )
              )
            )
        ),
        m(
          "section.row.p-b-25.bg-light",
          mdl.data.blogs.any() &&
            m(
              ".glider-contain",
              SliderController(mdl),
              m("h2.is-center", "Recent Blogs"),
              m(
                ".grouped.#blogs.glider",
                mdl.data.blogs.map((blog, idx) =>
                  m(
                    ".card.opacity-overlay.is-vertical-align m-x-6 row",
                    {
                      key: idx,
                    },
                    m(
                      "header",
                      m("img", {
                        src: blog.img || "images/main.webp",
                        style: {
                          objectFit: "contain",
                          maxHeight: "250px",
                        },
                      })
                    ),
                    m("h2", blog.title),
                    m(
                      m.route.Link,
                      {
                        selector: "footer",
                        class: "button primary outline is-full-width",
                        href: `/social/blog-post:${blog.objectId}`,
                      },
                      "...Read More"
                    )
                  )
                )
              ),
              m(
                "nav.nav.p-t-25",
                m(
                  "button.button.nav-left.outline.dark",
                  m(AngleDoubleLine, {
                    style: { transform: "rotate(270deg)" },
                  })
                ),
                m(
                  "button.button.nav-right.outline.dark",
                  m(AngleDoubleLine, {
                    style: { transform: "rotate(90deg)" },
                  })
                )
              )
            )
        )
      ),
  }
}

export default Home
