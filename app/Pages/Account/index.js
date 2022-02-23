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
              state.tab == "profile" && [
                m(Profile, { mdl, data: mdl.data.profile }),
                m("#payment-request-button", {
                  oncreate: ({ dom }) =>
                    paypal
                      .Buttons({
                        style: {
                          shape: "rect",
                          color: "gold",
                          layout: "vertical",
                          label: "paypal",
                        },

                        createOrder: function (data, actions) {
                          log("createOrder")(data)
                          return actions.order.create({
                            purchase_units: [
                              { amount: { currency_code: "USD", value: 50 } },
                            ],
                          })
                        },

                        onApprove: function (data, actions) {
                          log("onApprove")(data)
                          return actions.order
                            .capture()
                            .then(function (orderData) {
                              // Full available details
                              console.log(
                                "Capture result",
                                orderData,
                                JSON.stringify(orderData, null, 2)
                              )

                              // Show a success message within this page, e.g.
                              const element = document.getElementById(
                                "paypal-button-container"
                              )
                              element.innerHTML = ""
                              element.innerHTML =
                                "<h3>Thank you for your payment!</h3>"

                              // Or go to another URL:  actions.redirect('thank_you.html');
                            })
                        },

                        onError: function (err) {
                          console.log(err)
                        },
                      })
                      .render(dom),
                }),
              ],
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
