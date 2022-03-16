import { prop, filter } from "ramda"
import { Table, formatDataForTable } from "Components/table.js"
import { EditLine, RemoveLine } from "@mithril-icons/clarity/cjs"
import Task from "data.task"
import { formatDate } from "Utils/helpers"
let tabs = ["blogs", "events", "images", "users", "dues"]

const state = {
  tab: "blogs",
}

const userViewmodel = ({
  objectId,
  email,
  emailVerified,
  name,
  role,
  username,
}) => ({
  name,
  username,
  email,
  emailVerified,
  role,
  action: [
    m(EditLine, { onclick: () => console.log("edit", objectId) }),
    m(RemoveLine, { onclick: () => console.log(objectId, "delete") }),
  ],
})

const eventsViewmodel = ({ objectId, title, image, startDate, startTime }) => ({
  title,
  image: m("img", { src: image }),
  startDate,
  startTime,
  action: [
    m(EditLine, { onclick: () => console.log("edit", objectId) }),
    m(RemoveLine, { onclick: () => console.log(objectId, "delete") }),
  ],
})

const blogsViewmodel = ({ objectId, title, img, text, author }) => ({
  title,
  img: m("img", { style: { maxWidth: "150px" }, src: img }),
  text: text.slice(0, 300),
  author,
  action: [
    m(EditLine, { onclick: () => console.log("edit", objectId) }),
    m(RemoveLine, { onclick: () => console.log(objectId, "delete") }),
  ],
})

const imagesViewmodel = ({ objectId, album, image }) => ({
  album,
  image: m("img", { style: { maxWidth: "150px" }, src: image }),
  action: [
    m(EditLine, { onclick: () => console.log("edit", objectId) }),
    m(RemoveLine, { onclick: () => console.log(objectId, "delete") }),
  ],
})

const displayType = {
  users: userViewmodel,
  events: eventsViewmodel,
  blogs: blogsViewmodel,
  images: imagesViewmodel,
  dues: ({ date, status, full_name, email, address }) => ({
    date: formatDate(date),
    status,
    full_name,
    email,
    address,
  }),
}

const handleType = (tab) => (data) => displayType[tab](data)

const toViewmodel = (state, mdl) => {
  let data = mdl.data[state.tab].map(handleType(state.tab))
  return formatDataForTable([], data)
}

const getUsersTask = (mdl) =>
  mdl.http.back4App
    .getTask(mdl)("Users")
    .map(prop("results"))
    .map(filter(prop("name")))
    .map(log("users"))

const getDuesTask = (mdl) =>
  mdl.http.back4App
    .getTask(mdl)("Classes/Dues")
    .map(prop("results"))
    .map(log("dues"))
// .map(filter(prop("name")))

const getData = ({ attrs: { mdl } }) => {
  Task.of((users) => (dues) => ({
    users,
    dues,
  }))
    .ap(getUsersTask(mdl))
    .ap(getDuesTask(mdl))
    .fork(log("error"), ({ users, dues }) => {
      mdl.data.users = users
      mdl.data.dues = dues
    })
}

const Admin = () => {
  return {
    oninit: getData,
    view: ({ attrs: { mdl } }) =>
      m(
        "section",
        m(
          "nav.tabs",
          tabs.map((tab) =>
            m(
              "a.tab.pointer",
              {
                class: state.tab == tab ? "active" : "",
                onclick: () => (state.tab = tab),
              },
              tab.toUpperCase()
            )
          )
        ),

        m("section.container", m(Table, { mdl, ...toViewmodel(state, mdl) }))
      ),
  }
}

export default Admin
