import m from "mithril"
import Task from "data.task"
import { values } from "ramda"
import { addSuccess } from "@/Components/toast"

const makePaymentTask = (actions) =>
  new Task((rej, res) => actions.order.capture().then(res, rej))

const formatInvoice =
  (mdl) =>
    ({
      create_time,
      status,
      payer: { email_address },
      purchase_units: {
        0: {
          shipping: {
            address,
            name: { full_name },
          },
        },
      },
    }) => ({
      date: create_time,
      status,
      full_name,
      email: email_address,
      address: values(address).join(" "),
      userId: mdl.user.objectId,
    })

const saveInvoiceTask = (mdl) => (invoice) =>
  mdl.http.back4App.postTask(mdl)("Dues")(invoice)

const PayPal = ({ attrs: { mdl, reload } }) => {
  const state = {
    paydues: false,
  }

  const togglePaypal = status => () => {
    mdl.modal.header(m(
      ".modal-header",
      m(
        "button.button",
        {
          onclick: () =>
            mdl.toggleLayoutModal(mdl)
        },
        "Cancel Payment"
      )
    ))

    mdl.modal.content(
      m(
        ".modal-content",
        m("#payment-request-button.is-center", {
          oncreate: ({ dom }) => {
            paypal
              .Buttons({
                style: {
                  shape: "rect",
                  color: "silver",
                  layout: "vertical",
                  label: "pay",
                },

                createOrder: (data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: { currency_code: "USD", value: 50 },
                      },
                    ],
                  })
                },

                onApprove: (data, actions) => {
                  status.paypal = "start"
                  return makePayment(actions)
                },
              })
              .render(dom)
          },
        })
      )
    )

    mdl.toggleLayoutModal(mdl)

  }

  const onSuccess = (mdl, reload) => (data) => {
    addSuccess({ text: "Dues Successfully Paid" })
    log("on success", [state, data])
    mdl.toggleLayoutModal(mdl)
    reload(mdl)
  }

  const onError = (mdl, state) => (error) => {
    log("on onErrpr", [state, error])
    addError(
      "There was an error with your payment. Please contact an administrator."
    )
  }

  const makePayment = (actions) => {
    makePaymentTask(actions)
      .map(formatInvoice(mdl))
      .chain(saveInvoiceTask(mdl))
      .fork(onError(mdl, state), onSuccess(mdl, reload))
  }

  return {
    view: ({ attrs: { mdl, status } }) =>
      m(
        "section",
        m("button.button", { onclick: togglePaypal(status) }, "Pay Dues")
      ),
  }
}

export default PayPal

