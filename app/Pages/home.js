import { fetchAll } from "../Layouts"

const State = {
  events: null,
  blogs: null,
  images: null,
}

const createCarousel = (dom) => {
  var slider = tns({
    container: dom,
    controls: true,
    nav: false,
    sessionStorage,
    preventScrollOnTouch: "auto",
    slideBy: "page",
    responsive: {
      200: {
        items: 2,
      },
      640: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1400: {
        items: 4,
      },
    },
  })
  State[dom.id] = slider
}

const SliderController = (mdl) => ({
  oncreate: ({ dom }) => createCarousel(dom),
  onremove: ({ dom }) => State[dom.id].destroy(),
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
              ".container",
              m("h2.is-center", "Upcoming Events!"),
              m(
                ".grouped.#events",
                SliderController(mdl),
                mdl.data.events.map((event) =>
                  m(
                    ".card.is-vertical-align row",
                    {
                      style: {
                        backgroundImage: event.image,
                        height: "40% !important",
                      },
                    },
                    event.allDay && m(".tag", "All Day Event!"),
                    m("h3", event.startDate),
                    m("h3", event.startTime),
                    m("img", { src: event.image }),
                    m("h4", event.title),
                    m(
                      m.route.Link,
                      {
                        selector: "label",
                        class: "tag button bg-primary text-white is-full-width",
                        href: "/social/calendar",
                        onclick: (e) =>
                          mdl.state.selectedPreviewEvent(event.objectId),
                      },
                      "...Read More"
                    )
                  )
                )
              )
            )
        ),
        m(
          "section.row.p-b-25.bg-primary.text-white",
          mdl.data.images.any() &&
            m(
              ".container",
              m("h2.is-center", "Recent Photos"),
              m(
                ".grouped.#images",
                SliderController(mdl),
                mdl.data.images.map((img) =>
                  m("img.card.auto", {
                    src: img.thumb,
                    style: {},
                  })
                )
              )
            )
        ),
        m(
          "section.row.p-b-25.bg-light",
          mdl.data.blogs.any() &&
            m(
              ".container",
              m("h2.is-center", "Recent Blogs"),
              m(
                ".grouped.#blogs",
                SliderController(mdl),
                mdl.data.blogs.map((blog) =>
                  m(
                    ".card.opacity-overlay.is-vertical-align row",

                    m(
                      "figure",
                      m("img", { src: blog.img || "images/main.webp" })
                    ),
                    m("h2", blog.title),
                    m(
                      m.route.Link,
                      {
                        selector: "label",
                        class: "tag button bg-primary text-white is-full-width",
                        href: `/social/blog-post:${blog.objectId}`,
                      },
                      "...Read More"
                    )
                  )
                )
              )
            )
        ),
        m(
          "section.row.bg-primary.text-white",
          m(".container", "Some more info...")
        )
      ),
  }
}

export default Home
