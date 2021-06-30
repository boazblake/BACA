import { formatDate } from "Utils"
import { compose, lensProp, over } from "ramda"
import BlogPreview from "./blog-preview.js"
import { AddTextLine, EditLine, NoteEditLine } from "@mithril-icons/clarity"

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
                "nav.nav.marg-y-6",
                m(
                  ".nav-center",
                  m(
                    m.route.Link,
                    {
                      selector: "button.button.primary",
                      href: "/social/blog-editor:",
                      class: mdl.settings.screenSize == "phone" ? "col-12" : "",
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
