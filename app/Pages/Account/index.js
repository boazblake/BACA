import Profile from "./profile"
import { loadAllTask } from "./model"
import { Table, formatDataForTable } from "Components/table.js"

const nav = () => [
  "profile",
  // "dues", "messages"
]

const state = {
  tab: "profile",
  status: "loading",
}

const loadAll = (mdl) => {
  const onSuccess = ({ profile, dues, messages }) => {
    mdl.data.profile = profile
    mdl.data.dues = dues
    mdl.data.messages = messages
    state.status = "success"
    console.log(mdl)
  }
  const onError = (e) => {
    state.status = "error"
    console.error("issues w fetching data", e)
  }

  loadAllTask(mdl).fork(onError, onSuccess)
}

const Account = () => {
  return {
    //future add param to quick nav the state.tab to messages pane.
    oninit: ({ attrs: { mdl } }) => loadAll(mdl),
    view: ({ attrs: { mdl } }) =>
      m(
        "section",
        state.status == "error" && m("ERROR"),
        state.status == "loading" && m("loading"),
        state.status == "success" &&
          m(
            "section",
            m(
              "nav.tabs",
              nav(mdl.user.role).map((tab) =>
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
            m(
              "section.container",
              state.tab == "profile" &&
                m(Profile, { mdl, data: mdl.data.profile }),
              state.tab == "dues" &&
                m(Table, { mdl, ...formatDataForTable(mdl.data.dues) }),
              state.tab == "messages" &&
                m(Table, { mdl, ...formatDataForTable(mdl.data.messages) })
            )
          )
      ),
  }
}

export default Account
