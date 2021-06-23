import Task from "data.task"
import { listOf } from "Utils"
import Images from "../images"

const blogs = listOf(20)({
  src: Images[2],
  title: "minim veniam, quis nostrud",
  date: "11/12/2020",
  author: "Boaz Blake",
  title: "minim veniam, quis nostrud",
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
})

const fetchBlopgsTask = (mdl) => Task.of(blogs)

const onPageInit =
  (state) =>
  ({ attrs: { mdl } }) => {
    const onError = (s) => (error) => {
      s.errors.init = error
      console.log("errror", error)
    }

    const onSuccess = (s) => (data) => {
      s.data = data
    }

    fetchBlopgsTask(mdl).fork(onError(state), onSuccess(state))
  }

const Blog = () => {
  const state = {
    errors: {},
    data: [],
  }
  return {
    oninit: onPageInit(state),
    onremove: () => {
      state.errors = {}
      state.data = []
    },
    view: ({ attrs: { mdl } }) =>
      m(
        ".container",
        mdl.state.isAuth() &&
          m(
            "nav",
            m(
              "ul",
              m(
                "li",
                m(
                  m.route.Link,
                  {
                    selector: "a",
                    href: "/social/blog-editor",
                    role: "button",
                  },
                  "Add A Blog"
                )
              )
            )
          ),
        state.data.map(({ title, text, img, date, author }) =>
          m(
            "article",
            m(
              ".grid",
              m(
                "hgroup",
                m("h2", title),
                m("h3", date),
                m("h4", "Written By ", author)
              ),
              m("img", {
                src: img,
                style: {
                  border: "1px solid black",
                  borderRadius: "2%",
                  width: "100%",
                },
              })
            ),
            m("hgroup", m("h4", text))
          )
        )
      ),
  }
}

export default Blog
