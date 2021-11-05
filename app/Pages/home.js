import { fetchAll } from "../Layouts"
import DateTime from "Components/DateTime"

const State = {
  events: null,
  blogs: null,
  images: null,
}

const createCarousel = (dom) => {
  console.log(tns)
  const slider = tns({
    container: dom,
    controls: true,
    nav: false,
    preventScrollOnTouch: "auto",
    slideBy: "page",
    startIndex: 0,
    useLocalStorage: true,
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
  slider.events.on("touch", (e) =>
    console.log(
      "index",
      slider.getInfo(),
      e.displayIndex,
      e.container.children,
      e.container.children.length
    )
  )
  State[dom.id] = slider
}

const SliderController = (mdl) => ({
  oncreate: ({ dom }) => createCarousel(dom),
  // onupdate: (e) => console.log(e),
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
                mdl.data.events.map((event, idx) =>
                  m(
                    ".card.is-vertical-align row",
                    {
                      key: idx,
                      style: {
                        backgroundImage: event.image,
                        height: "40% !important",
                      },
                    },
                    event.allDay && m(".tag", "All Day Event!"),
                    m("h4.text-primary", event.title),
                    m("img", { src: event.image }),
                    m(DateTime, { event })
                    // m(
                    //   m.route.Link,
                    //   {
                    //     selector: "label",
                    //     class: "button primary outline is-full-width",
                    //     href: "/social/events",
                    //   },
                    //   "...Read More"
                    // )
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
                mdl.data.images.map((img, idx) =>
                  m("img.card.auto", {
                    key: idx,
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
                mdl.data.blogs.map((blog, idx) =>
                  m(
                    ".card.opacity-overlay.is-vertical-align row",
                    { key: idx },
                    m(
                      "figure",
                      m("img", { src: blog.img || "images/main.webp" })
                    ),
                    m("h2", blog.title)
                    // m(
                    //   m.route.Link,
                    //   {
                    //     selector: "label",
                    //     class: "button primary outline is-full-width",
                    //     href: `/social/blog-post:${blog.objectId}`,
                    //   },
                    //   "...Read More"
                    // )
                  )
                )
              )
            )
        )
      ),
  }
}

export default Home
