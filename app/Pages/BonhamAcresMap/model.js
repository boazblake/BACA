// import Task from "data.task"
import { path, prop, map, paths, } from "ramda"
import Stream from 'mithril-stream'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Task from "data.task";
L.Icon.Default.imagePath = 'images/leaflet-images/';

const state = {
  status: 'loading',
  layerType: 'watercolor',
  findLocationResults: [],
  locations: [],
  newLocation: null,
  dom: null,
  markers: [],
  input: null,
  map: null,
  isEdit: Stream(false),
  opts: {
    zoom: 16,
    center: [],
    bounds: null
  },
}


const addStamenLayers = (state) => {
  // layer
  new L.StamenTileLayer(state.layerType).addTo(state.map)
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
  state.map = L.map(dom, {
    maxBounds: L.latLngBounds(state.opts.bounds),
    dragging: state.isEdit()
  }).setView(state.opts.center, state.opts.zoom)

  if (state.opts.bounds) { state.map.maxBounds = L.latLngBounds(state.opts.bounds) } else {
    state.opts.bounds = state.map.getBounds()
  }
  return state
}

const addMarkerLayer = state => {
  state.markerLayer = L.layerGroup().addTo(state.map)
  return state
}

const createMap = state => ({ dom }) => Promise.resolve(newMap(dom, state))
  .then(addOsmLayers)
  .then(addStamenLayers)
  .then(addMarkerLayer)


const toLeafletMarker = location => {
  const marker = L.marker([location.lat, location.lng, {
    location,
    id: location.objectId,
    dragging: (marker) => {
      var position = marker.getLatLng()
      console.log(position)
      marker.setLatLng(position, {
      }).bindPopup(position).update()
    },
    riseOnHover: true,
  }])
  marker.options.draggable = state.isEdit()
  marker.on('click', () => marker.bindPopup(`${location.owner}'s property at ${location.property}`).openPopup())
  marker.on('dragend', e => {
    const { lat, lng } = e.target.getLatLng()
    location.lat = lat
    location.lng = lng
    marker.bindPopup(`You moved ${location.owner}'s property at ${location.property}`).openPopup()
  })

  return { marker, location }
}

const updateStateLocations = (state) => ({ locations, markers }) => {
  state.locations = locations
  state.markers = markers
  return state
}

const toMarkerVM = entities => entities.reduce((dto, { marker, location }) => {
  dto.markers.push(marker)
  dto.locations.push(location)
  return dto
}, { markers: [], locations: [] })


const attachMarkers = state => {
  state.markers.forEach(m => m.addTo(state.markerLayer))
  return state
}

const loadResidentsTask = (mdl, state) =>
  mdl.http.back4App
    .getTask(mdl)("geo/addresses")
    .map(prop("results"))
    .map(map(toLeafletMarker))
    .map(toMarkerVM)
    .map(updateStateLocations(state))
    .map(attachMarkers)

const toLocationViewModel = ([property, { lat, lng }]) => ({ property, lat, lng })

const findLocationTask = (mdl, query) =>
  mdl.http.openCageTask(mdl)(query)
    .map(path(['results', 'results', 0]))
    .map(paths([["formatted"], ["geometry"]]))
    .chain(xs => xs.includes(undefined) ? Task.rejected(xs) : Task.of(xs))
    .map(toLocationViewModel)
    .map(toLeafletMarker(mdl))
    .map(
      m => m.marker.addTo(state.map)
    )

const addAddressTask = (mdl, location) =>
  mdl.http.back4App
    .postTask(mdl)("geo/addresses")(location)
    .map(prop("results"))

const updateAddressTask = (mdl, location, id) =>
  mdl.http.back4App
    .putTask(mdl)(`geo/addresses/${id}`)(location)
    .map(prop("results"))

const saveResidentTask = (mdl, location) => {
  let currentAddress = mdl.data.addresses.find(
    (l) => l.property == location.property
  )

  return currentAddress
    ? updateAddressTask(mdl, location, currentAddress.objectId)
    : addAddressTask(mdl, location)
}



export {
  state, newMap, loadResidentsTask, findLocationTask, createMap
}
