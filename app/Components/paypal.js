import Task from "data.task"
import { log, getTotal, toProducts, jsonCopy, saveStorageTask } from "Utils"

const makePaymentTask = (actions) => {
  log("makePaymentTask")(actions)
  return new Task((rej, res) => actions.order.capture().then(res, rej))
}

const formatInvoice =
  ({ user, cart, state: { prices } }) =>
  ({ orderID, payerID }) =>
  (details) => {
    log("formatInvoice")(user)
    return {
      userId: user.objectId,
      orderID,
      payerID,
      purchaseTime: details.create_time,
      status: details.status,
      customer: details.payer,
      shippingDestination: details.purchase_units[0].shipping,
      cart: cart,
      prices,
    }
  }

const setTempUser = (user) =>
  sessionStorage.setItem("baca-session-token", user["sessionToken"])

const unSetTempUser = () => sessionStorage.clear()

const saveUnregisteredInvoiceTask = (mdl) => (invoice) =>
  mdl.http.back4App
    .postTask(mdl)("login")({
      username: mdl.http.back4App.unregistered.email,
      password: btoa(mdl.http.back4App.unregistered.password),
    })
    .map(setTempUser)
    .chain((_) => saveInvoiceTask(mdl)(invoice))
    .map(unSetTempUser)

const addInvoiceTask = (mdl) => (invoice) => {
  log("addInvoiceTask")(invoice)
  return mdl.state.isAuth()
    ? saveInvoiceTask(mdl)(invoice)
    : saveUnregisteredInvoiceTask(mdl)(invoice)
}

const saveInvoiceTask = (mdl) => (invoice) =>
  mdl.http.back4App.postTask(mdl)("classes/Invoices")(invoice)

const onSuccess = (mdl, state) => (_) => {
  console.log("succc", state, _)
  setTimeout(() => (state.isPaying = "success"))
}

const onError = (state) => (error) => {
  log("state")(state)
  state.error = error
  setTimeout(() => (state.isPaying = "failed"))
  console.log("error", error)
}

export const PayPal = () => {
  return {
    view: ({ attrs: { mdl, state } }) =>
      m(".", {
        style: {
          maxHeight: "500px",
          overflowY: "auto",
          minWidth: "400px",
        },
        oncreate: ({ dom }) =>
          paypal
            .Buttons({
              createOrder: (_, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: getTotal(mdl, toProducts(mdl.cart)),
                      },
                    },
                  ],
                })
              },
              onApprove: (data, actions) => {
                state.isPaying = "start"
                log("onapprove")(JSON.stringify(state))
                return makePaymentTask(actions)
                  .map(formatInvoice(mdl)(data))
                  .chain(addInvoiceTask(mdl))
                  .fork(onError(state), onSuccess(mdl, state))
              },
            })
            .render(dom),
      }),
  }
}
