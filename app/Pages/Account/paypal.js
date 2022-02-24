const PayPal = () => {
  const state = {
    paydues: false,
  }
  const togglePaypal = () => (state.paydues = !state.paydues)
  return {
    view: () =>
      m(
        "section",
        state.paydues
          ? m(
              "#payment-request-button",
              {
                oncreate: ({ dom }) => {
                  console.log(paypal)
                  paypal

                    .Buttons({
                      style: {
                        shape: "rect",
                        color: "silver",
                        layout: "vertical",
                        label: "pay",
                      },

                      createOrder: function (data, actions) {
                        let res = actions.order.create({
                          purchase_units: [
                            { amount: { currency_code: "USD", value: 50 } },
                          ],
                        })
                        log("createOrder")(res)
                        return res
                      },

                      onApprove: function (data, actions) {
                        log("onApprove")(data)
                        return actions.order
                          .capture()
                          .then(function (orderData) {
                            // Full available details
                            log("Capture result")(
                              JSON.stringify(orderData, null, 2)
                            )
                          })
                      },

                      onError: function (err) {
                        log("onError with paypal")(err)
                      },
                    })
                    .render(dom)
                },
              },
              m("button.button", { onclick: togglePaypal }, "Close")
            )
          : m("button.button", { onclick: togglePaypal }, "Pay Dues")
      ),
  }
}

export default PayPal
