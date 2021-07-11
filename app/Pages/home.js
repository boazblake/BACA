import Task from "data.task"
import { head, map, prop, tail } from "ramda"

const state = {
  events: [],
  images: [],
  blogs: [],
}

const toEventViewModel = (event) => {
  let start = event.start.split("T")
  return {
    image: event.image,
    startDate: head(start),
    startTime: tail(start),
    title: event.title,
    allDay: event.allDay,
    objectId: event.objectId,
  }
}

const fetchTask = (mdl) => (url) => mdl.http.back4App.getTask(mdl)(url)

const fetchAll = ({ attrs: { mdl } }) => {
  const onError = (e) => console.error(e)
  const onSuccess = ({ events, images, blogs }) => {
    state.events = events
    state.images = images
    state.blogs = blogs
  }

  Task.of((events) => (images) => (blogs) => ({ events, images, blogs }))
    .ap(
      fetchTask(mdl)("Classes/Events")
        .map(prop("results"))
        .map(map(toEventViewModel))
    )
    .ap(fetchTask(mdl)("Classes/Gallery").map(prop("results")))
    .ap(fetchTask(mdl)("Classes/Blogs").map(prop("results")))
    .fork(onError, onSuccess)
}

const Home = () => {
  return {
    oninit: fetchAll,
    view: ({ attrs: { mdl } }) =>
      m(
        "article.grid",
        m(
          "section.row.bg-light",
          m("h2", "Upcoming Events!"),
          m(
            ".container",
            m(
              ".grouped.overflow-x-auto",
              state.events.map((event) =>
                m(
                  ".card.col-4",
                  {
                    style: {
                      backgroundImage: event.image,
                      height: "40% !important",
                    },
                  },
                  event.allDay && m(".tag", "All Day Event!"),
                  m("h3", event.startDate),
                  m("h3", event.startTime),
                  m("h4", event.title),
                  m(
                    m.route.Link,
                    {
                      selector: "label",
                      class: "tag button bg-primary text-white is-full-width",
                      href: "/social/calendar",
                      onclick: (e) =>
                        mdl.state.selectedPreviewEvent(event.objectId),
                      style: { opacity: 0 },
                      onmouseover: (e) => (e.target.style.opacity = 1),
                      onmouseleave: (e) => (e.target.style.opacity = 0),
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
            m("h2", "Recent Photos"),
            m(
              ".grouped.overflow-x-auto",
              state.images.map((img) =>
                m("img.card.col-4", {
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
            m("h2", "Recent Blogs"),
            m(
              ".grouped.overflow-x-auto",
              state.blogs.map((blog) =>
                m(
                  ".card.col-4",
                  {
                    style: {
                      backgroundImage: blog.img,
                      height: "40% !important",
                    },
                  },
                  m("h2", blog.title),
                  m(
                    m.route.Link,
                    {
                      selector: "label",
                      class: "tag button bg-primary text-white is-full-width",
                      href: `/social/blog-post:${blog.objectId}`,
                      onclick: (e) =>
                        mdl.state.selectedPreviewEvent(event.objectId),
                      style: { opacity: 0 },
                      onmouseover: (e) => (e.target.style.opacity = 1),
                      onmouseleave: (e) => (e.target.style.opacity = 0),
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
