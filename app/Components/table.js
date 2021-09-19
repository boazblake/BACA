import { AngleLine } from "@mithril-icons/clarity/cjs"

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
          ),

          m(
            "td",
            m(AngleLine, {
              class: `clickable ${!row.isSelected && "point-down"}`,
              onclick: () => (row.isSelected = !row.isSelected),
              width: "16px",
            })
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
                    cols.map((col) => m("th", col)),
                    m("th")
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
