import { toPairs, compose, map, keys } from "ramda"

const toColCell = (x) => ({ col: x[0], val: x[1] })

export const formatDataForTable = (data) => {
  let cols = Array.from(new Set(data.flatMap(keys)))
  let rows = compose(map(map(toColCell)), map(toPairs))(data)
  return { cols, rows }
}

const Cell = () => {
  return {
    view: ({
      attrs: {
        mdl: {
          settings: { screenSize },
        },
      },
      children,
    }) =>
      screenSize == "phone"
        ? m("tr", [
            m("td", { style: { width: "25%" } }, m("label", children[0].key)),
            children,
          ])
        : m("td", { style: { width: "20%" } }, children),
  }
}

const Row = ({ attrs: { mdl } }) => {
  return {
    view: ({ attrs: { row } }) => {
      return [
        m(
          "tr",
          row.map((cell) =>
            m(Cell, { mdl }, m("", { key: cell.col }, cell.val))
          )
        ),
      ]
    },
  }
}

export const Table = () => {
  return {
    view: ({ attrs: { mdl, cols, rows } }) =>
      m(
        "section.table",
        {
          style: {
            minWidth: "100%",
            overflow: "auto",
          },
        },
        rows.any()
          ? m(
              "table.dash-table",
              mdl.settings.screenSize != "phone" &&
                m(
                  "thead.dash-nav",
                  m(
                    "tr.mb-5",
                    cols.map((col) => m("th.primary", col.toUpperCase()))
                  )
                ),
              m(
                "tbody",
                rows.map((row) => m(Row, { mdl, row }))
              )
            )
          : m("h2", "No data")
      ),
  }
}
