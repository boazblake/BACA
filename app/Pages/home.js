import { fetchAll } from "../Layouts"

const Home = () => {
  return {
    oninit: fetchAll,
    view: ({ attrs: { mdl } }) =>
      m(
        "article.grid",
        m(
          "section.row.bg-light",
          m(
            ".container",
            m("h2.is-center", "Upcoming Events!"),
            m(
              ".grouped.overflow-x-auto",
              mdl.data.events.map((event) =>
                m(
                  ".card.col-2.is-vertical-align row",
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
                      // style: { opacity: 0 },
                      // onmouseover: (e) => (e.target.style.opacity = 1),
                      // onmouseleave: (e) => (e.target.style.opacity = 0),
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
          m(
            ".container",
            m("h2.is-center", "Recent Photos"),
            m(
              ".grouped.overflow-x-auto",
              mdl.data.images.map((img) =>
                m("img.card.col-2 auto", {
                  src: img.thumb,
                  style: {
                    // width: "40% !important",
                  },
                })
              )
            )
          )
        ),
        m(
          "section.row.bg-light",
          m(
            ".container",
            m("h2.is-center", "Recent Blogs"),
            m(
              ".grouped.overflow-x-auto",
              mdl.data.blogs.map((blog) =>
                m(
                  ".card.col-2.opacity-overlay.is-vertical-align row",
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
                      // style: { opacity: 0 },
                      // onmouseover: (e) => (e.target.style.opacity = 1),
                      // onmouseleave: (e) => (e.target.style.opacity = 0),
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
