import M from "moment"

const DateTime = ({ attrs: { event } }) => {
  const formatDate = (x) => M(x).format("dddd, MMMM Do YYYY")
  const formatTime = (x) => M(x).format("h:mm a")

  return {
    view: () =>
      event.startDate == event.endDate
        ? m(
            ".",
            m("h3", m("label.strong", formatDate(event.startDate))),
            m(
              "h4.grouped",
              m("label", formatTime(event.start)),
              m("label", " - "),
              m("label", formatTime(event.end))
            )
          )
        : m(
            "h4.grouped",
            m("label.strong", formatDate(event.startDate)),
            m("label", " - "),
            m("label.strong", formatDate(event.endDate))
          ),
  }
}

export default DateTime
