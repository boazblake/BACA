import m from "mithril"
import PayPal from "./paypal"
import { Table, formatDataForTable } from "@/Components/table.js"
import { propEq } from "ramda"

const state = {
  paypal: null,
}

const Dues = ({ attrs: { mdl } }) => {
  const fetchDues = (mdl) => mdl.http.back4App.getTask(mdl)(`dues/${mdl.user.objectId}`).fork(log('e'), mdl.dues = dues)
  fetchDues(mdl)

  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "#DUES.section.p-y-50",
        m(PayPal, { mdl, data: mdl.dues, status: state, reload: fetchDues }),
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
}

export default Dues
