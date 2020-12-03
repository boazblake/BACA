import Task from "data.task"
import { getTotal, toProducts, jsonCopy, saveStorageTask } from "Utils"
import { newCart } from "Models"

const makePaymentTask = (actions) =>
  new Task((rej, res) => actions.order.capture().then(res, rej))

const formatInvoice = ({ cart, state: { prices } }) => ({
  orderID,
  payerID,
}) => (details) => ({
  orderID,
  payerID,
  purchaseTime: details.create_time,
  status: details.status,
  customer: details.payer,
  shipping: details.purchase_units[0].shipping,
  cart: cart,
  prices,
})

const setTempUser = (user) =>
  sessionStorage.setItem("sb-user-token", user["user-token"])

const unSetTempUser = () => sessionStorage.clear()

const updateCartTask = (mdl) => (_) => {
  mdl.cart = jsonCopy(newCart)
  return saveStorageTask(mdl)("sb-cart")(mdl.cart)
}

const linkInvoiceUserTask = (mdl) => (user) => (invoice) =>
  mdl.http.backEnd.postTask(mdl)(
    `data/Users/${user.objectId}/invoices%3AInvoices%3A1`
  )([invoice.objectId])

const linkInvoiceUnregisteredTask = (mdl) => (invoice) =>
  mdl.http.backEnd
    .postTask(mdl)("users/login")({
      login: mdl.http.backEnd.unregistered.email,
      password: btoa(mdl.http.backEnd.unregistered.password),
    })
    .map(setTempUser)
    .chain((_) => saveInvoiceTask(mdl)(invoice))
    .chain(linkInvoiceUserTask(mdl)(mdl.http.backEnd.unregistered))
    .map(unSetTempUser)

const addInvoiceTask = (mdl) => (invoice) => {
  return mdl.state.isAuth()
    ? saveInvoiceTask(mdl)(invoice).chain(linkInvoiceUserTask(mdl)(mdl.user))
    : linkInvoiceUnregisteredTask(mdl)(invoice)
}

const saveInvoiceTask = (mdl) => (invoice) =>
  mdl.http.backEnd.postTask(mdl)("data/Invoices")(invoice)

const onSuccess = (mdl) => (_) => {
  console.log("succc", _)
}

const onError = (error) => console.log("error", error)

export const PayPal = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(".", {
        style: {
          maxHeight: "500px",
          overflowY: "auto",
          minWidth: "80vw",
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
              onApprove: (data, actions) =>
                makePaymentTask(actions)
                  .map(formatInvoice(mdl)(data))
                  .chain(addInvoiceTask(mdl))
                  .chain(updateCartTask(mdl))
                  .fork(onError, onSuccess(mdl)),
            })
            .render(dom),
      }),
  }
}
