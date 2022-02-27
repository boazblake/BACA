import { Table, formatDataForTable } from "Components/table.js"
const Messages = {
  view: ({ attrs: { mdl } }) =>
    m(Table, { mdl, ...formatDataForTable([], mdl.data.messages) }),
}

export default Messages
