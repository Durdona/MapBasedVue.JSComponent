<template>
  <div class="section is-desktop">
    <div class="container">
      <div class="tabs is-toggle">
        <ul>
          <li>
            <a @click="changeActiveTab(1)" :class="[activetab === 1 ? 'active' : '']">
              <span>Radial Search</span>
            </a>
          </li>
          <li>
            <a @click="changeActiveTab(2)" :class="[activetab === 2 ? 'active' : '']">
              <span>GeoJSON Search</span>
            </a>
          </li>
        </ul>
      </div>

      <fieldset class="fieldset box">
        <legend class="label"></legend>
        <div v-if="activetab === 1" class="radial-search-tab">
          <p
            id="validationError"
            class="content"
            v-if="radialTab.requiredFieldErrors.length"
          >
            <b class="info" v-if="radialTab.requiredFieldErrors.length <= 1"
              >Please correct following error</b
            >
            <b class="info" v-else>Please correct following errors</b>
          <ul>
            <li v-for="requiredFieldError in radialTab.requiredFieldErrors" v-bind:key="requiredFieldError">
              {{ requiredFieldError }}
            </li>
          </ul>
          </p>
          <!-- custom required field error message on missing input fields for radial search tab -->
          <div class="columns is-desktop radial-first-row">
            <div class="field column is-8">
              <p class="control has-icons-left">
                <input
                  id="searchString"
                  class="input search-city"
                  type="text"
                  placeholder="Please enter street address or zip code"
                  v-model="radialTab.search_string"
                  :disabled="!allow_update"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-globe-americas"></i>
                </span>
              </p>
            </div>

            <div class="field column is-3">
              <p class="control">
                <input
                  id="searchRadius"
                  class="input"
                  type="number"
                  placeholder="Miles"
                  min="0"
                  v-model="radialTab.search_radius"
                  :disabled="!allow_update"
                />
              </p>
            </div>

            <div v-if="allow_search" class="column" @click="submitRadialSearchRequest()">
              <p class="control">
                <a class="button is-primary is-fullwidth">Submit</a>
              </p>
            </div>
          </div>
        </div>

        <div class="geojson-search-tab">
          <div v-if="activetab === 2" class="columns is-desktop geojson-first-row">
            <div class="column is-9 geojson-editor">
              <v-jsoneditor
                @error="jsonEditorError"
                v-model="geojsonTab.json_input"
                :plus="true"
                v-bind:style="{ 'min-height': '190px' }"
              ></v-jsoneditor>
            </div>
            <div v-if="allow_search" class="column" @click="submitGeoJSONSearchRequest()">
              <p class="control">
                <a class="button is-primary is-fullwidth">Submit</a>
              </p>
            </div>
          </div>

          <div class="columns geojson-second-row">
            <div class="column is-9">
              <l-map
                ref="the_map"
                :zoom="zoom"
                style="border: 1px solid lightgrey; border-radius: 5px"
              >
                <l-tile-layer :url="tileUrl" :attribution="attribution"></l-tile-layer>
                <l-marker
                  v-if="activetab === 1 && radialTab.circle.center "
                  :lat-lng="radialTab.circle.center"
                ></l-marker>
                <l-circle
                  v-if="activetab === 1 && radialTab.circle.center"
                  :lat-lng="radialTab.circle.center"
                  :radius="radialTab.circle.radius"
                />
                <!-- for Radial Search-->
                <l-geo-json
                  v-if="activetab === 2"
                  :geojson="geojsonTab.geojson"
                  :options="options"
                  :options-style="styleFunction"
                />
                <!-- GeoJSON Search -->
              </l-map>
            </div>

            <div class="column">
              <div class="label result-text">
                <div class="column">
                  <label class="title is-5">Result:</label>
                </div>

                <div
                  class="has-text-danger has-text-weight-medium column"
                  v-if=" isError == true &&
                  responseStatus > 200 &&
                  responseStatus <= 504"
                >
                  <i class="fas fa-exclamation-triangle"></i>
                  {{ geojsonTab.errorMessage }}
                </div>
                <!-- displays error message if smth. is wrong with request -->
              </div>
              <div class="column">
                <div class="box result-box" v-bind:style="{ 'min-height': '190px' }">
                  <p>Household: {{ household }}</p>
                  <p>Individuals: {{ individual }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import L from "leaflet";
import { LMap, LTileLayer, LMarker, LGeoJson, LCircle } from "vue2-leaflet";
import VJsoneditor from "v-jsoneditor";
Vue.use(VJsoneditor);

export default {
  name: "MemberTargetingVersion2",
  data() {
    return {
      radialTab: {
        search_string: "",
        search_radius: null,
        search_results: null,
        circle: {
          radius: null
        },
        requiredFieldErrors: []
      },
      geojsonTab: {
        geojson: null,
        json_input: null,
        errorMessage:
          "  Sorry, we couldn't process your request. Please try again"
      },
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 1,
      activetab: 1,
      household: null,
      individual: null,
      isError: false,
      responseStatus: null
    }; // return ends here
  }, // data ends here
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LCircle,
    LGeoJson,
    VJsoneditor
  },
  props: {
    $axios: {
      type: [Function, Object],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    tileUrl: {
      type: String,
      required: true
    },
    targetingResults: {
      type: Object,
      required: false
    },
    allow_search: {
      type: Boolean,
      required: false,
      default: true
    },
    allow_update: {
      type: Boolean,
      required: false,
      default: true
    },
    search_on_load: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    changeActiveTab(num) {
      this.activetab = num;
      this.resetControl();
    },
    convertMilesToMeters(miles) {
      return 1609 * miles;
    },
    jsonEditorError(event) {
      console.log(event);
      console.log("json-editor throws an error");
    },
    resetControl() {
      this.radialTab.search_string = "";
      this.radialTab.search_radius = null;
      this.radialTab.search_results = null;
      this.household = null;
      this.individual = null;
      this.isError = false;
      this.zoom = 1;
      this.radialTab.circle = {
        radius: null
      };
      this.geojsonTab.json_input = null;
      this.geojsonTab.geojson = null;
    },

    submitRadialSearchRequest() {
      this.$emit("targeting-submit");
      this.radialTab.requiredFieldErrors = [];
      if (this.isSearchStringValid && this.isSearchRadiusValid) {
        // construct query payload
        let searchPayload = {
          query: {
            AND: [
              {
                type: "geo",
                meta: {
                  function: "radialDistanceFromTextLocation",
                  payload: {
                    search_string: this.actualSearchString,
                    units: "miles",
                    distance: this.search_radius
                  }
                }
              }
            ]
          }
        };

        this.$axios
          .post(this.url, searchPayload)
          .then(response => {
            console.log(response);
            this.responseStatus = response.status; // saving HTTP status
            this.radialTab.search_results = response.data; // success 200 response
            this.processResults(response.data); // passing response data as a parameter
            this.$emit("targeting-submit-result", response); // emit event to my parent component so that it knows what is happening
            console.log("things went well success");
          })
          .catch(error => {
            console.log(error);
            this.isError = true;
            this.responseStatus = error.response.status;
            if (error.response.data) {
              this.geojsonTab.errorMessage = error.response.data;
            }
            // emit to indicate query if finished, with errors
            this.$emit("targeting-submit-result", {
              error: error,
              errorResponse: error.response
            });
          });
      } else {
        // emit to indicate query is finished
        this.$emit("targeting-submit-result", false);
        if (!this.isSearchStringValid)
          this.radialTab.requiredFieldErrors.push("No Location chosen");
        if (!this.isSearchRadiusValid)
          this.radialTab.requiredFieldErrors.push("No Miles chosen");
      }
    }, // Radial Search Submit Resquest Ends here

    submitGeoJSONSearchRequest() {
      if (this.geojsonTab.json_input) {
        let searchPayload = {
          query: {
            AND: [
              {
                type: "geo",
                meta: {
                  function: "geojsonShape",
                  payload: {
                    json_input: this.geojsonTab.json_input // check key name `json_input` w/ Graham
                  }
                }
              }
            ]
          }
        };

        console.log("before axios");
        this.$axios
          .post(this.url, searchPayload)
          .then(response => {
            console.log(response);
            this.responseStatus = response.status;
            this.processResults(response.data); // processResults() method will be used for both Radial and GeoJSON Searches on mount() lifecycle
            this.$emit("targeting-submit-result", response);
            console.log("after axios");
          })
          .catch(error => {
            console.log(" we got an error");
            console.log(error);
            this.isError = true;
            this.responseStatus = error.response.status;
            if (error.response.data) {
              this.geojsonTab.errorMessage = error.response.data;
            }
            // emit to indicate query if finished, with errors
            this.$emit("targeting-submit-result", {
              error: error,
              errorResponse: error.response
            });
          });
      }
    },
    processResults(resultsToProcess) {
      // processResults function is passing PROP targetingResults as a parameter
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Radial Search
      if (resultsToProcess !== null) {
        if (
          resultsToProcess.query_payload.AND[0].meta.function ===
          "radialDistanceFromTextLocation"
        ) {
          this.activetab = 1; // setting activetab to 1 if condition above is true
          this.radialTab.search_string =
            resultsToProcess.query_payload.AND[0].meta.payload.search_string;
          this.radialTab.search_radius =
            resultsToProcess.query_payload.AND[0].meta.payload.distance;

          this.household = resultsToProcess.results.household.count;
          this.individual = resultsToProcess.results.individual.count;

          this.radialTab.circle.radius = this.convertMilesToMeters(
            resultsToProcess.query_payload.AND[0].meta.payload.distance
          );

          this.radialTab.circle.center = L.latLng(
            resultsToProcess.results.geojson.features[0].geometry
              .coordinates[1],
            resultsToProcess.results.geojson.features[0].geometry.coordinates[0]
          );
          const calculateZoombyDistance = function(miles) {
            if (miles > 150 && miles <= 200) {
              return 5;
            } else if (miles >= 0 && miles <= 150) {
              return 6;
            } else {
              return 4;
            }
          };
          this.zoom = calculateZoombyDistance(
            resultsToProcess.query_payload.AND[0].meta.payload.distance
          );
          var cor1 = L.latLng(
            resultsToProcess.results.geojson.bbox[1],
            resultsToProcess.results.geojson.bbox[0]
          );
          var cor2 = L.latLng(
            resultsToProcess.results.geojson.bbox[3],
            resultsToProcess.results.geojson.bbox[2]
          );
          var bounds = L.latLngBounds(cor1, cor2);
          this.$refs.the_map.fitBounds(bounds);
        }
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GeoJSON Search
        if (
          resultsToProcess.query_payload.AND[0].meta.function === "geojsonShape"
        ) {
          this.activetab = 2;
          if (resultsToProcess.results.message) {
            this.isError = true;
            this.geojsonTab.errorMessage = this.errorMessage; // display server error message
          }
          this.household = resultsToProcess.results.household.count;
          this.individual = resultsToProcess.results.individual.count;

          this.geojsonTab.json_input = resultsToProcess.results.geojson;
          this.geojsonTab.geojson = this.geojsonTab.json_input;

          this.zoom = 10;

          let cor1 = L.latLng(
            this.geojsonTab.geojson.bbox[1],
            this.geojsonTab.geojson.bbox[0]
          );
          let cor2 = L.latLng(
            this.geojsonTab.geojson.bbox[3],
            this.geojsonTab.geojson.bbox[2]
          );
          let bounds = L.latLngBounds(cor1, cor2);
          this.$refs.the_map.fitBounds(bounds);
        }
      }
    }
  }, // method ends here

  computed: {
    actualSearchString: function() {
      // used for Radial Search
      return this.radialTab.search_string.trim(); //leading and trailing space of search_string input field is being removed
    },

    isSearchStringValid: function() {
      // used for Radial Search
      if (this.actualSearchString.length > 0) {
        return true; // won't allow to submit if search_string has a leading empty space
      }
      return false;
    },
    isSearchRadiusValid: function() {
      // used for Radial Search
      if (
        this.radialTab.search_radius !== null &&
        !isNaN(this.radialTab.search_radius)
      ) {
        return true;
      }
      return false;
    },
    options() {
      // used for GeoJSON
      return {
        onEachFeature: this.onEachFeatureFunction
      };
    },
    styleFunction() {
      // used for GeoJSON
      const fillColor = this.fillColor; // important! need touch fillColor in computed for re-calculate when change fillColor
      return () => {
        return {
          weight: 2,
          color: "#FF7E00 ",
          opacity: 1,
          fillColor: fillColor,
          fillOpacity: 0.15
        };
      };
    },
    onEachFeatureFunction() {
      // can be used for enabling a tooltip on the map
      if (!this.enableTooltip) {
        return () => {};
      }
      return (feature, layer) => {
        layer.bindTooltip(
          "<div>code:" +
            feature.properties.code +
            "</div><div>nom: " +
            feature.properties.nom +
            "</div>",
          { permanent: false, sticky: true }
        );
      };
    }
  }, // computed ends here

  mounted: function() {
    if (this.targetingResults !== undefined) {
      this.processResults(this.targetingResults);
    }
    // adding a full screen mode functionality to my map
    const myMap = this.$refs.the_map.mapObject;
    myMap.addControl(new L.Control.Fullscreen());

    // if search_on_load, submit search
    if (this.search_on_load) {
      this.submitRadialSearchRequest(), this.submitRadialSearchRequest();
    }
  }
};
</script>

<style>
.info {
  color: red;
  font-weight: 400;
  font-size: 1.1rem;;
}

.fieldset {
  /* background: rgba(228, 241, 254, 0.8); */
  background: rgba(255, 248, 237, 0.6);
  border-radius: 4px;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.4),
    0 0 0 1px rgba(10, 10, 10, 0.06);
}
/* active tab style */
.tabs.is-toggle li a.active {
  background-color: #3273dc;
  border-color: #3273dc;
  color: #fff;
  z-index: 1;
}
.tabs:not(:last-child) {
  margin-bottom: 0;
}
.result-box {
  box-shadow: 0 0.5em 1em -0.25em rgba(10, 10, 10, 0.4);
}
/* jsoneditor styles */
.jsoneditor-menu {
  background-color: rgba(37, 116, 169, 0.8);
  border-bottom: 1px solid rgba(1, 50, 67, 0.4);
}
.jsoneditor {
  border: thin solid rgba(52, 73, 94, 0.2);
}
</style>