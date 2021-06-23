import m from "mithril"

const state = {
  errors: {},
  blogs: [],
}

const loadBlogs = ({ attrs: { mdl } }) => {
  const onError = (error) => (state.errors = error)

  const onSuccess = ({ results }) => (state.blogs = results)

  mdl.http.back4App.getTask(mdl)("Classes/Blogs").fork(onError, onSuccess)
}

const Blog = () => {
  return {
    oninit: loadBlogs,
    onremove: () => {
      state.errors = {}
      state.data = []
    },
    view: ({ attrs: { mdl } }) =>
      m(
        ".container",
        state.blogs.any()
          ? state.blogs.map(
              ({
                title,
                text,
                img,
                thumb,
                createdAt,
                updatedAt,
                author,
                objectId,
              }) =>
                m(
                  "article",
                  m(
                    ".grid",
                    m(
                      "hgroup",
                      m("h2", title),
                      m(
                        "h3",
                        createdAt,
                        updatedAt !== createdAt && "updated on: ",
                        updatedAt
                      ),
                      m("h4", "Written By ", author)
                    ),
                    m("img", {
                      src: thumb || "images/main.webp",
                      style: {
                        border: "1px solid black",
                        borderRadius: "2%",
                        width: "182px",
                      },
                    })
                  ),
                  m(
                    "hgroup",
                    m("h4", text.slice(0, 100), "...."),
                    m("a", { role: "button" }, "continue reading")
                  ),
                  author == mdl.user.name &&
                    m(
                      "footer",

                      m(
                        "button",
                        {
                          onclick: () => {
                            mdl.state.editBlog(objectId)
                            m.route.set(`/social/blog-editor:${objectId}`)
                          },
                        },
                        "Edit"
                      )
                    )
                )
            )
          : m(
              "article",
              m(
                m.route.Link,
                {
                  selector: "a",
                  href: "/social/blog-editor:",
                  role: "button",
                },
                "Add The First Blog Post !"
              )
            )
      ),
  }
}

export default Blog
