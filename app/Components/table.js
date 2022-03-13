import { toPairs, compose, map, keys, clone } from "ramda"

const toColCell = (x) => ({ col: x[0], val: x[1] })

export const formatDataForTable = (removeProps, data) => {
  let dto = clone(data)
  removeProps.forEach((prop) => dto.map((d) => delete d[prop]))
  let cols = Array.from(new Set(dto.flatMap(keys)))
  let rows = compose(map(map(toColCell)), map(toPairs))(dto)
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
      screenSize == "wide"
        ? m("tr", [
            m("td", { style: { width: "25%" } }, m("label", children[0].key)),
            m("th", children),
          ])
        : m("td", { style: { width: "20%" } }, children),
  }
}

const Row = ({ attrs: { mdl } }) => {
  return {
    view: ({ attrs: { row } }) => {
      return [
        m(
          "tr.card",
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
              mdl.settings.screenSize != "wide" &&
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
