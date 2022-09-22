import m from "mithril"
import Profile from "./profile"
import Dues from "./dues"
import Messages from "./messages"

const Account = ({ attrs: { mdl } }) => {
  const nav = () => ["PROFILE", "DUES"]

  const state = {
    tab: mdl.state?.anchor ?? "PROFILE",
  }

  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "section",

        m(
          "section",
          m(
            "nav.nav.tabs",
            nav(mdl.user.role).map((tab) =>
              m(
                m.route.Link,
                {
                  class:
                    state.tab == tab ? "active tab.pointer" : "tab.pointer",
                  href: `/account/${mdl.user.routename}#${tab}`,
                },
                tab.toUpperCase()
              )
            )
          ),
          m(
            "section.container",
            state.tab == "PROFILE" && m(Profile, { mdl }),
            state.tab == "DUES" && m(Dues, { mdl }),
            state.tab == "MESSAGES" && m(Messages, { mdl })
          )
        )
      ),
  }
}

export default Account

