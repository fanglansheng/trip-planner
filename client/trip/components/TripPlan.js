import React from "react";
import PropTypes from "prop-types";

// components
import TripMap from "./TripMap";
import Itinerary from "./Itinerary";
import PlaceInfo from "./PlaceInfo";

import { Tab, Tabs } from "react-bootstrap";

export default class TripPlan extends React.Component {
  static propTypes = {
    currentTrip: PropTypes.object.isRequired,
    activityPlaces: PropTypes.array.isRequired,
    // functions
    selectMarker: PropTypes.func.isRequired,
    addActivity: PropTypes.func.isRequired, //addActivity(object)
    editActivity: PropTypes.func.isRequired,
    delActivity: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      // the route to activity places.
      directions: null
    };
  }

  calculateRoute = travelMode => {
    const { activityPlaces } = this.props;
    const directionsService = new google.maps.DirectionsService();

    const last = activityPlaces.length - 1;
    const waypoints = [];
    activityPlaces.forEach((place, index) => {
      if (index != 0 && index != last) {
        waypoints.push({
          location: place.geometry.location,
          stopover: true
        });
      }
    });

    directionsService.route(
      {
        origin: activityPlaces[0].geometry.location,
        destination: activityPlaces[last].geometry.location,
        travelMode: travelMode,
        waypoints: waypoints,
        optimizeWaypoints: true,
        provideRouteAlternatives: true
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log(response);
          this.setState({
            directions: response
          });
        } else {
          console.error(`error fetching directions ${response.status}`);
        }
      }
    );
  };

  render() {
    const { directions } = this.state;
    const {
      currentTrip,
      activityPlaces,
      addActivity,
      editActivity,
      delActivity,
      selectedPlace,
      selectMarker
    } = this.props;

    const routes = directions ? directions.routes[0].legs : [];
    return (
      <div className="full-height">
        {/* Map */}
        <TripMap
          directions={directions}
          activityPlaces={activityPlaces}
          selectMarker={selectMarker}
        />

        {/* Information and activity */}
        <Tabs id="plan-sidebar" defaultActiveKey={1}>
          <Tab eventKey={1} title="Itinerary">
            <Itinerary
              {...currentTrip}
              routes={routes}
              handleEditItinerary={() => {}}
              editActivity={editActivity}
              delActivity={delActivity}
              handleCalculateRoute={this.calculateRoute}
            />
          </Tab>
          <Tab eventKey={2} title="Place Detail">
            <PlaceInfo
              place={selectedPlace}
              handleAddPlace={() => addActivity(selectedPlace.place_id)}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}