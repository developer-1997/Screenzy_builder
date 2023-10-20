import React from "react";

// Customizable Area Start
import './geofence.css'
// Customizable Area End

// Customizable Area Start
import GeofenceList from "../../../components/src/GeofenceList.web";
import Map from "../../../components/src/Map.web";
import GeofenceEditor from "../../../components/src/GeofenceEditor.web";
import GeofenceBackButton from "../../../components/src/GeofenceBackButton.web";
import { AddIcon } from "./assets"
import GeofenceAddButton from "../../../components/src/GeofenceAddButton.web";
// Customizable Area End

import GeofenceController, {
  Props,
  configJSON,
} from "./GeofenceController";

export default class Geofence extends GeofenceController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  
  // Customizable Area End

  render() {
    return (
      // Customizable Area Start
      <>
        <div className="container">
          <div className="controls">

          {this.state.editMode === "VIEW" ? (
            <>
              
              <GeofenceList 
                data-test-id="geofenceListId"
                title={configJSON.geofenceListTitle}
                geofenceList={this.state.geofenceList}
                handleEditClick={this.handleEditClick}
              />


              <GeofenceAddButton 
                data-test-id="addButtonId"
                AddTitle={configJSON.geofenceAddTitle}
                AddIcon={AddIcon}
                createGeofenceHandler={this.createGeofenceHandler}
              />
            </>
          ) : (
            <>
              <GeofenceBackButton 
                data-test-id="backButtonId"
                handleBackClick={this.handleBackClick}
                backButtonTitle={configJSON.backButtonTitle}
              />
              <GeofenceEditor 
                data-test-id="geofenceEditor"
                editMode={this.state.editMode}
                editableCircle={this.state.editableCircle}
                lat={this.state.lat}
                lng={this.state.lng}
                rad={this.state.rad}
                idf={this.state.idf}
                handlerIdfChange={this.handlerIdfChange}
                handlerRadChange={this.handlerRadChange}
                handlerLatChange={this.handlerLatChange}
                handlerLngChange={this.handlerLngChange}
                HandleSubmit={this.HandleSubmit}
                disableHandler={this.disableHandler}
                HandleDelete={this.HandleDelete}
                editTitle={configJSON.editTitle}
              />
            </>
          )}
          </div>
          <div className="map">
            <Map
              geofences={this.state.geofenceList}
              editMode={this.state.editMode}
              mapCenter={this.state.mapCenter}
              editableCircle={this.state.editableCircle}
              handleSetEditableCircle={this.handleSetEditableCircle}
            />
          </div>
        </div>
      </>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
// Customizable Area End
