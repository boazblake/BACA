import { formatDate } from "Utils"
import { compose, lensProp, over } from "ramda"
import BlogPreview from "./blog-preview.js"

const state = {
  errors: {},
  blogs: [],
}

export const formatLensDate = (prpty) => over(lensProp(prpty), formatDate)

export const toViewModel = compose(
  formatLensDate("updatedAt"),
  formatLensDate("createdAt")
)

const loadBlogs = ({ attrs: { mdl } }) => {
  const onError = (error) => (state.errors = error)

  const onSuccess = ({ results }) => (state.blogs = results.map(toViewModel))

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
      mdl.state.isLoading()
        ? m("article.modal", "LOADING")
        : m(
            ".container",
            mdl.state.isAuth() &&
              m(
                "nav.nav",
                m(
                  ".nav-left",
                  m(
                    m.route.Link,
                    {
                      href: "/social/blog-editor:",
                      class: "button primary",
                    },
                    "Add A Blog Post"
                  )
                )
              ),
            m(
              ".row",
              state.blogs.any()
                ? state.blogs.map((post) => m(BlogPreview, { mdl, post }))
                : m(
                    "article.card",
                    mdl.state.isAuth()
                      ? m(
                          m.route.Link,
                          {
                            href: "/social/blog-editor:",
                            class: "button primary",
                          },
                          "Add The First Post !"
                        )
                      : m("h1", "Log in to add the First Post!")
                  )
            )
          ),
  }
}

export default Blog
