import { PencilLine } from "@mithril-icons/clarity/cjs"
import { states, stateDict } from "Models"

const submitAddressTask = (mdl) => (data) => {
  console.log(data)
  return mdl.http.backEnd.putTask(mdl)(
    `data/Accounts/${mdl.user.account.objectId}`
  )({
    address: JSON.stringify(data),
  })
}

const Account = () => {
  const state = {
    address: { street1: "", street2: "", city: "", state: "", zip: "" },
    editAddress: Stream(false),
    showAddress: Stream(false),
    errors: {},
  }
  const toggleEditAddress = (state) => state.editAddress(!state.editAddress())

  const submitAddress = (mdl) => (state) => {
    const onError = (errors) => console.log("e", e)
    const onSuccess = (mdl) => (s) => {
      mdl.user.address = JSON.parse(s.address)
    }
    submitAddressTask(mdl)(state.address).fork(onError, onSuccess(mdl))
  }

  return {
    oninit: ({ attrs: { mdl } }) => {
      state.address = mdl.user.address
      if (state.address) {
        state.showAddress(true)
        state.editAddress(false)
      } else {
        state.address = {}
        state.showAddress(false)
        state.editAddress(false)
      }
    },
    view: ({ attrs: { mdl } }) => {
      console.log('wtf',Object.keys(state.address).length)
      return m(".frow-container frow-center", [
        m("h2", "Welcome ", mdl.user.name),

        m("section.m-5", [
          m(
            "span.frow row-start",
            m("h3.pr-10", "Shipping Address"),
            m(PencilLine, {
              class: "clickable",
              onclick: () => toggleEditAddress(state),
              width: "16px",
            }),
            Object.keys(state.address).length
            ? m('pre', `${state.address.street1} ${state.address.street2||''} ${state.address.city} ${state.address.state} ${state.address.zip}`)
            : m("h4", "No Address on File")
          ),
          state.editAddress() &&
            m(
              "form.frow column-start m-5 px-20",
              {
                oninput: (e) => {
                  console.log(mdl, state)
                  state.address[e.target.id] = e.target.value
                },
              },
              [
                m("input.col-xs-1-2", {
                  type: "text",
                  id: "street1",
                  placeholder: "street1",
                  value: state.address.street1,
                }),
                m("input.col-xs-1-2", {
                  type: "text",
                  id: "street2",
                  placeholder: "street2",
                  value: state.address.street2,
                }),
                m(".frow row", [
                  m("input.col-xs-1-3", {
                    type: "text",
                    id: "city",
                    placeholder: "city",
                    value: state.address.city,
                  }),
                  m(
                    ".col-xs-1-3",

                    m(
                      "select",
                      {
                        id: "state",
                        placeholder: "state",
                        value: state.address.state || "state",
                      },
                      Object.keys(states).map((state) => [
                        m(
                          "option",
                          { key: "placeholder", value: "state" },
                          "state"
                        ),
                        m(
                          "option",
                          {
                            key: state,
                            placeholder: "state",
                            value: stateDict(state),
                          },
                          `${stateDict(state)}`
                        ),
                      ]),
                      state.address.state || "state"
                    )
                  ),
                  m("input.col-xs-1-3", {
                    type: "number",
                    inputmode: "numeric",
                    pattern: "[0-9]*",
                    id: "zip",
                    value: state.address.zip,
                    placeholder: "zip",
                  }),
                ]),
                m(
                  "a.button",
                  {
                    type: "submit",
                    class: "clickable",
                    onclick: () => submitAddress(mdl)(state),
                  },
                  "Submit"
                ),
              ]
            ),
        ]),
        m("section", [m("h3", "Past Orders")]),
        m("section"),
        m("section"),
      ])
    },
  }
}

export default Account
