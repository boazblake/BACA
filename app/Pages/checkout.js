import { NavLink } from "Components/nav-link"
import { PayPal } from "Components/paypal"
import {
  isActiveRoute,
  getTotal,
  getQuantity,
  getPrice,
  toProducts,
} from "Utils/helpers"

const Gender = () => {
  return {
    view: ({
      attrs: {
        mdl,
        gender: [sex, quantity],
      },
    }) => {
      return quantity
        ? m(".", [
            m("img", { src: "https://via.placeholder.com/80" }),
            m("h4", `${sex} : ${quantity}`),
          ])
        : null
    },
  }
}

const Product = ({
  attrs: {
    mdl,
    p: [title, genders],
  },
}) => {
  let amount = getQuantity(genders)

  let price = getPrice(mdl, title, genders)

  return {
    view: ({
      attrs: {
        mdl,
        p: [title, genders],
      },
    }) => {
      return amount
        ? m(".frow column-start mt-10", [
            m(
              "span.underline",
              m(
                "h3.mb-10",
                `${amount} ${title} for ${mdl.state.currency()}${price}`
              )
            ),
            m(
              ".frow cart-item row-around",
              genders.map((gender) => m(Gender, { mdl, gender }))
            ),
          ])
        : null
    },
  }
}

const Checkout = ({ attrs: { mdl } }) => {
  return {
    oninit: ({ attrs: { mdl } }) => mdl.state.showNavModal(false),
    view: ({ attrs: { mdl } }) =>
      m(`.frow-container frow-center`, [
        getTotal(mdl, toProducts(mdl.cart))
          ? m(NavLink, {
              mdl,
              href: `/cart`,
              classList: `${isActiveRoute(`/cart`)} para button m-0`,
              link: "Update Cart",
            })
          : null,

        toProducts(mdl.cart).map((p) => m(Product, { mdl, p })),

        getTotal(mdl, toProducts(mdl.cart))
          ? [
              m(
                ".frow centered-column",

                m(
                  "h1.bold text-center.mt-20.mb-20",
                  `Total of ${getQuantity(
                    toProducts(mdl.cart)
                  )} for ${mdl.state.currency()}${getTotal(
                    mdl,
                    toProducts(mdl.cart)
                  )}`
                ),
                m(PayPal, { mdl })
              ),
            ]
          : m("h1.bold", "Your Cart is Empty"),
      ]),
  }
}

export default Checkout
