import Task from "data.task"
import { paths, path, prop, map } from "ramda"

export const defaultPushPin = (mdl) => [
  toPushPin({
    property: "BACA",
    lat: Microsoft.Maps.Location.parseLatLong(mdl.Map.bh).latitude,
    lng: Microsoft.Maps.Location.parseLatLong(mdl.Map.bh).longitude,
  }).getLocation(),
]

export const getCenterView = (locations) =>
  Microsoft.Maps.LocationRect.fromLocations(locations)

export const setCenterView = (state) => (bounds) =>
  state.map.setView({ bounds, minZoom: 16 })

export const loadMapConfig = (mdl) => (state) => {
  const getCenterViewFromStateEntities = () => {
    let locations = state.entities.map((e) => e.getLocation())
    return getCenterView(locations)
  }

  let centerPoint = getCenterViewFromStateEntities()

  let lat = centerPoint.center.latitude
  let lng = centerPoint.center.longitude

  state.opts.center = new Microsoft.Maps.Location(lat, lng)
  state.map = new Microsoft.Maps.Map(state.dom, state.opts)
  console.log(state)
  state.map.entities.push(state.entities)
  setCenterView(state)(centerPoint)
  return state
}

export const toPushPin = ({ property, lat, lng }) =>
  new Microsoft.Maps.Pushpin(
    {
      altitude: 0,
      altitudeReference: -1,
      latitude: lat,
      longitude: lng,
    },
    {
      title: property,
    }
  )

const updateStateEntities = (state) => (entities) => {
  if (entities.any()) {
    state.entities = entities
  }
  return state
}

const addEventHandlers = (pushPin) => {
  const highlight = (id) => {
    console.log(id)
    // //Highlight the mouse event div to indicate that the event has fired.
    dom.style.background = "LightGreen"

    // //Remove the highlighting after a second.
    setTimeout(function () {
      dom.style.background = "white"
    }, 1000)
  }
  // //Add mouse events to the pushPin.
  Microsoft.Maps.Events.addHandler(pushPin, "click", function () {
    console.log("event", pushPin)
    highlight("pushpinClick")
  })
  // Microsoft.Maps.Events.addHandler(pushPin, "mousedown", function () {
  //   console.log(pushPin)
  //   highlight("pushpinMousedown")
  // })
  // Microsoft.Maps.Events.addHandler(pushPin, "mouseout", function () {
  //   console.log(pushPin)
  //   highlight("pushpinMouseout")
  // })
  // Microsoft.Maps.Events.addHandler(pushPin, "mouseover", function () {
  //   console.log(pushPin)
  //   highlight("pushpinMouseover")
  // })
  // Microsoft.Maps.Events.addHandler(pushPin, "mouseup", function () {
  //   console.log(pushPin)
  //   highlight("pushpinMouseup")
  // })

  return pushPin
}

export const loadResidentsTask = (mdl, state) =>
  mdl.http.back4App
    .getTask(mdl)("classes/Addresses")
    .map(prop("results"))
    .map(map(toPushPin))
    .map(map(addEventHandlers))
    .map(updateStateEntities(state))

export const findLatLongTask = (mdl, query) =>
  mdl.http.openCage
    .getLocationTask(mdl)(query)
    .map(path(["results", 0]))
    .map(paths([["formatted"], ["geometry"]]))
    .chain((xs) => (xs.includes(undefined) ? Task.rejected() : Task.of(xs)))
    .map(([property, { lat, lng }]) => toPushPin({ property, lat, lng }))

