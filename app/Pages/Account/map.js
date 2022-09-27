import m from "mithril"
import L from 'leaflet'
L.Icon.Default.imagePath = 'images/leaflet-images/';


const state = {
  locations: [],
  dom: null,
  entities: [],
  input: null,
  map: null,
  opts: {
    center: { lng: 0, lat: 0 },
    zoom: 16,
  },
}

const addStamenLayers = (state) => {
  // layer
  new L.StamenTileLayer("watercolor").addTo(state.map)
  return state
}

const addOsmLayers = state => {
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(state.map)
  return state
}

const newMap = (dom, state) => {
  state.dom = dom
  state.map = L.map(dom, { dragging: false }).setView(state.opts.center, state.opts.zoom)
  return state
}

const addMarkerLayer = state => {
  state.markerLayer = L.layerGroup().addTo(state.map)
  return state
}

const toLeafletMarker = ({ lat, lng, owner, property }) => {
  const marker = L.marker({ lat, lng })
  marker.on('click', () => marker.bindPopup(`${owner}'s property at ${property}`).openPopup())
  return marker
}

const formatLocations = state => {
  state.markers = state.locations
  state.markers.map(toLeafletMarker).forEach(home => home.addTo(state.markerLayer))
  return state
}
const createMap = state => ({ dom }) => Promise.resolve(newMap(dom, state))
  .then(addOsmLayers)
  .then(addStamenLayers)
  .then(addMarkerLayer)
  .then(formatLocations)

const updateMap = state => ({ dom, attrs: { locations } }) => {
  if (state.locations.length != locations.length) {
    state.locations = locations
    state.map &&
      (state.map.off(), state.map.remove())
    createMap(state)({ dom })
  } else return false


}


const Map = () => {



  return {
    onupdate: updateMap(state),
    view: ({ attrs: { mdl, locations } }) => {
      const [lat, lng] = mdl.Map.bh
      state.opts.center = { lat, lng }
      return m("section#map", {
        oncreate: createMap(state),
        style: {
          position: "relative",
          width: "500px",
          height: "500px",
          margin: "0 auto",
        },
      })
    },
  }
}

export default Map

