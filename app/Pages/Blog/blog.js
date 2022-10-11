import m from "mithril"
import { prop, } from "ramda"
import BlogPreview from "./blog-preview.js"

const state = {
  errors: {},
  blogs: [],
}



const loadBlogs = ({ attrs: { mdl } }) => {
  const onError = (error) => (state.errors = error)

  const onSuccess = (results) => (state.blogs = results.reverse())

  mdl.http.back4App
    .getTask(mdl)("blogs")
    .map(prop("results"))
    .fork(onError, onSuccess)
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
        "article.grid.p-y-6.fade",
        m(
          "section.container",
          mdl.state.isAuth() &&
          m(
            "nav.nav.m-y-6",
            m(
              ".nav-center",
              m(
                m.route.Link,
                {
                  selector: "button.button.primary",
                  href: "/social/blog-editor/new-post",
                  class:
                    mdl.settings.screenSize == "phone" ? "col-12" : "",
                },
                "Add A Blog Post"
              )
            )
          ),
          m(
            ".row",
            state.blogs.any()
            && state.blogs.map((post, key) => m(BlogPreview, { key, mdl, post }))
          )
        )
      ),
  }
}

export default Blog
