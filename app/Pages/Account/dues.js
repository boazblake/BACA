import m from "mithril"
import PayPal from "./paypal"
import { Table, formatDataForTable } from "@/Components/table.js"

const state = {
  paypal: null,
}

const Dues = {
  view: ({ attrs: { mdl, reload } }) =>
    m(
      "#DUES.section.p-y-50",
      m(PayPal, { mdl, data: mdl.dues, status: state, reload }),
      mdl.dues.any() &&
      m(Table, {
        mdl,
        data: formatDataForTable(
          ["userId", "objectId", "createdAt", "updatedAt"],
          mdl.dues
        ),
      })
    ),
}

export default Dues
