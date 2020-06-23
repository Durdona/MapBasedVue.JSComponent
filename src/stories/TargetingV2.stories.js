import Vue from "vue";
import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { storiesOf } from "@storybook/vue";
import TargetingV2 from "../components/TargetingV2.vue";

import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen/dist/Leaflet.fullscreen";

// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
const mock = new MockAdapter(axios);

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});
Vue.config.productionTip = false;

const radialTargetingResults = {
  elapsed: 7.135929107666016,
  query_payload: {
    AND: [
      {
        meta: {
          function: "radialDistanceFromTextLocation",
          payload: {
            distance: 120,
            search_string: "Portland, OR",
            units: "miles"
          }
        },
        type: "geo"
      }
    ]
  },
  results: {
    geojson: {
      bbox: [-122.4980103, 45.4609449, -122.3675171, 45.5608827],
      features: [
        {
          bbox: [-122.4980103, 45.4609449, -122.3675171, 45.5608827], // using for center & circle.center
          geometry: {
            coordinates: [-122.4347608, 45.5098502], // used for marker
            type: "Point"
          },
          properties: {
            accuracy: "APPROXIMATE",
            address: "Gresham, OR, USA",
            bbox: [-122.4980103, 45.4609449, -122.3675171, 45.5608827],
            city: "Gresham",
            confidence: 3,
            country: "US",
            county: "Multnomah County",
            lat: 45.5098502,
            lng: -122.4347608,
            ok: true,
            place: "ChIJu2AuXeh1lVQRL13OrRgKw58",
            quality: "locality",
            raw: {
              address_components: [
                {
                  long_name: "Gresham",
                  short_name: "Gresham",
                  types: ["locality", "political"]
                },
                {
                  long_name: "Multnomah County",
                  short_name: "Multnomah County",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "Oregon",
                  short_name: "OR",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United States",
                  short_name: "US",
                  types: ["country", "political"]
                }
              ],
              administrative_area_level_1: {
                long_name: "Oregon",
                short_name: "OR"
              },
              administrative_area_level_2: {
                long_name: "Multnomah County",
                short_name: "Multnomah County"
              },
              country: {
                long_name: "United States",
                short_name: "US"
              },
              formatted_address: "Gresham, OR, USA",
              geometry: {
                bounds: {
                  northeast: {
                    lat: 45.5608827,
                    lng: -122.3675171
                  },
                  southwest: {
                    lat: 45.4609449,
                    lng: -122.4980103
                  }
                },
                location: {
                  lat: 45.5098502,
                  lng: -122.4347608
                },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: {
                    lat: 45.5608827,
                    lng: -122.3675171
                  },
                  southwest: {
                    lat: 45.4609449,
                    lng: -122.4980103
                  }
                }
              },
              locality: {
                long_name: "Gresham",
                short_name: "Gresham"
              },
              place_id: "ChIJu2AuXeh1lVQRL13OrRgKw58",
              political: {
                long_name: "United States",
                short_name: "US"
              },
              types: ["locality", "political"]
            },
            state: "OR",
            status: "OK"
          },
          type: "Feature"
        }
      ],
      type: "FeatureCollection"
    },
    household: {
      count: 55
    },
    individual: {
      count: 77
    }
  }
};
const geojsonTargetingResults = {
  elapsed: 3.850895881652832,
  query_payload: {
    AND: [
      {
        meta: {
          function: "geojsonShape",
          payload: {
            features: [
              {
                geometry: {
                  coordinates: [
                    [
                      [-122.47833251953125, 45.487094732298374],
                      [-122.38426208496094, 45.487094732298374],
                      [-122.38426208496094, 45.544110148533896],
                      [-122.47833251953125, 45.544110148533896],
                      [-122.47833251953125, 45.487094732298374]
                    ]
                  ],
                  type: "Polygon"
                },
                properties: {},
                type: "Feature"
              },
              {
                geometry: {
                  coordinates: [
                    [
                      [-122.45635986328124, 45.51789504294005],
                      [-122.58098602294922, 45.50201573698665],
                      [-122.55901336669923, 45.421829095772765],
                      [-122.44606018066406, 45.39893211771299],
                      [-122.31044769287111, 45.43435824755581],
                      [-122.3111343383789, 45.48107707969552],
                      [-122.45635986328124, 45.51789504294005]
                    ]
                  ],
                  type: "Polygon"
                },
                properties: {},
                type: "Feature"
              }
            ],
            type: "FeatureCollection"
          }
        },
        type: "geo"
      }
    ]
  },
  results: {
    geojson: {
      bbox: [
        -122.58098602294922,
        45.39893211771299,
        -122.31044769287111,
        45.544110148533896
      ],
      features: [
        {
          geometry: {
            coordinates: [
              [
                [-122.47833251953125, 45.487094732298374],
                [-122.38426208496094, 45.487094732298374],
                [-122.38426208496094, 45.544110148533896],
                [-122.47833251953125, 45.544110148533896],
                [-122.47833251953125, 45.487094732298374]
              ]
            ],
            type: "Polygon"
          },
          properties: {},
          type: "Feature"
        },
        {
          geometry: {
            coordinates: [
              [
                [-122.45635986328124, 45.51789504294005],
                [-122.58098602294922, 45.50201573698665],
                [-122.55901336669923, 45.421829095772765],
                [-122.44606018066406, 45.39893211771299],
                [-122.31044769287111, 45.43435824755581],
                [-122.3111343383789, 45.48107707969552],
                [-122.45635986328124, 45.51789504294005]
              ]
            ],
            type: "Polygon"
          },
          properties: {},
          type: "Feature"
        }
      ],
      type: "FeatureCollection"
    },
    household: {
      count: 66
    },
    individual: {
      count: 88
    },
    message:
      " Sorry, couldn't process your request. Server Error. Please try again"
  }
};
// setup mocked request/responses

// Radial Search Tab NO PROPS
const MEMBER_TARGETING_URL_SUCCESS_RADIAL_NO_PROPS =
  "https://member_targeting_service/success/radial/no/props";
mock
  .onPost(MEMBER_TARGETING_URL_SUCCESS_RADIAL_NO_PROPS)
  .reply(200, radialTargetingResults);

//  GeoJSON Search Tab NO PROP
const MEMBER_TARGETING_URL_SUCCESS_GEOJSON_NO_PROPS =
  "https://member_targeting_service/success/geojson/no/props";
mock
  .onPost(MEMBER_TARGETING_URL_SUCCESS_GEOJSON_NO_PROPS)
  .reply(200, geojsonTargetingResults);

//  GeoJSON Search Server ERROR
const MEMBER_TARGETING_URL_SUCCESS_GEOJSON_ERROR =
  "https://member_targeting_service/success/geojson/server/error";
mock
  .onPost(MEMBER_TARGETING_URL_SUCCESS_GEOJSON_ERROR)
  .reply(200, geojsonTargetingResults);

// Radial Search Tab PROPS
const MEMBER_TARGETING_URL_SUCCESS_RADIAL_PROPS =
  "https://member_targeting_service/success/radial/props";
mock
  .onPost(MEMBER_TARGETING_URL_SUCCESS_RADIAL_PROPS)
  .reply(200, radialTargetingResults);

//  GeoJSON Search Tab PROPS
const MEMBER_TARGETING_URL_SUCCESS_GEOJSON_PROPS =
  "https://member_targeting_service/success/geojson/props";
mock
  .onPost(MEMBER_TARGETING_URL_SUCCESS_GEOJSON_PROPS)
  .reply(200, geojsonTargetingResults);

//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Adding Stories ...
// Radial Search NO PROPS
storiesOf("TargetingV2/TargetingV2", module).add("Radial Search", () => ({
  name: "RadialSearchTab",
  components: {
    TargetingV2
  },
  template: `<TargetingV2 :url="MEMBER_TARGETING_URL_SUCCESS_RADIAL_NO_PROPS" :$axios="axios" :tileUrl="tileUrl" ></TargetingV2>`,
  data: () => ({
    MEMBER_TARGETING_URL_SUCCESS_RADIAL_NO_PROPS: MEMBER_TARGETING_URL_SUCCESS_RADIAL_NO_PROPS,
    axios: axios,
    tileUrl: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
  })
}));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  GeoJSON  Search NO  Props
storiesOf("TargetingV2/TargetingV2", module).add("GeoJSON Search", () => ({
  name: "GeoJSONSearchTab",
  components: {
    TargetingV2
  },
  template: `<TargetingV2 :url="MEMBER_TARGETING_URL_SUCCESS_GEOJSON_NO_PROPS" :tileUrl="tileUrl"  :$axios="axios"></TargetingV2>`,
  data: () => ({
    MEMBER_TARGETING_URL_SUCCESS_GEOJSON_NO_PROPS: MEMBER_TARGETING_URL_SUCCESS_GEOJSON_NO_PROPS, // turn into a string to get an error message
    axios: axios,
    tileUrl: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
  })
}));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  GeoJSON  Server Error
storiesOf("TargetingV2/TargetingV2", module).add("Server Error", () => ({
  name: "GeoJSONSearchTab",
  components: {
    TargetingV2
  },
  template: `<TargetingV2 :url="MEMBER_TARGETING_URL_SUCCESS_GEOJSON_ERROR" :$axios="axios" :tileUrl="tileUrl"></TargetingV2>`,
  data: () => ({
    MEMBER_TARGETING_URL_SUCCESS_GEOJSON_ERROR: "String format causes an ERROR", // turn into a string to get 404 server error
    axios: axios,
    tileUrl: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
  })
}));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Radial Search passing Props
storiesOf("TargetingV2/TargetingV2", module).add(
  "Radial Search Showing Previously Saved Data",
  () => ({
    name: "RadialSearchTab",
    components: {
      TargetingV2
    },
    template: `<TargetingV2 :url="MEMBER_TARGETING_URL_SUCCESS_RADIAL_PROPS" :$axios="axios" :tileUrl="tileUrl" :targetingResults="targetingResults" ></TargetingV2>`,
    data: () => ({
      MEMBER_TARGETING_URL_SUCCESS_RADIAL_PROPS: MEMBER_TARGETING_URL_SUCCESS_RADIAL_PROPS,
      axios: axios,
      tileUrl: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      targetingResults: radialTargetingResults
    })
  })
);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  GeoJSON  Search passing Props
storiesOf("TargetingV2/TargetingV2", module).add(
  "GeoJSON Search Showing Previously Saved Data",
  () => ({
    name: "GeoJSONSearchTab",
    components: {
      TargetingV2
    },
    template: `<TargetingV2 :url="MEMBER_TARGETING_URL_SUCCESS_GEOJSON_PROPS" :$axios="axios" :tileUrl="tileUrl"   :targetingResults="targetingResults"></TargetingV2>`,
    data: () => ({
      MEMBER_TARGETING_URL_SUCCESS_GEOJSON_PROPS: MEMBER_TARGETING_URL_SUCCESS_GEOJSON_PROPS, // turn into a string to get an error message
      axios: axios,
      tileUrl: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      targetingResults: geojsonTargetingResults
    })
  })
);
