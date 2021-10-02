import M from "moment"

const DateTime = ({ attrs: { event } }) => {
  const formatDate = (x) => M(x).format("dddd, MMMM Do YYYY")
  const formatTime = (x) => M(x).format("h:mm a")

  return {
    view: () =>
      event.startDate == event.endDate
        ? m(
            ".",
            m("p", m("label.strong", formatDate(event.startDate))),
            m(
              "p.grouped",
              m("label", formatTime(event.start)),
              m("label", " - "),
              m("label", formatTime(event.end))
            )
          )
        : m(
            ".",
            m(
              "p",
              m("label.strong", formatDate(event.startDate)),
              m("label", " - "),
              m("label.strong", formatDate(event.endDate))
            )
          ),
  }
}

export default DateTime
