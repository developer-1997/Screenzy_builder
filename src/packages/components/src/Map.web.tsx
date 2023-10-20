import PropTypes from 'prop-types';
import React, { useMemo } from "react";
import { GoogleMap, MarkerClusterer } from "@react-google-maps/api";
import { BlockComponent } from "../../framework/src/BlockComponent";
import Geofence from './Geofence.web';

interface Props {
  geofences: any;
  editableCircle: any;
  mapCenter: any;
  editMode: string;
  handleSetEditableCircle:any
}

interface Geofence {
  id: string;
  notify_on_entry: boolean;
  notify_on_exit: boolean;
  created_at: string;
  updated_at: string;
}

interface S {
}

interface SS {
}

export default class Map extends BlockComponent<Props, S, SS> {
  static propTypes = {
    geofences: PropTypes.any, 
    editableCircle:PropTypes.any,
    mapCenter:PropTypes.any,
    editMode:PropTypes.string,
    handleSetEditableCircle:PropTypes.func
  };

  constructor(props: any) {
    super(props);

  }


  render() {
    const { geofences , editableCircle , mapCenter , editMode , handleSetEditableCircle} = this.props

    const mapOptions = {
      disableDefaultUI: true,
      clickableIcons: false,
    };

    console.log("editableCircle-Map" , editableCircle)
    return (
      <>
        <GoogleMap
          zoom={14}
          mapContainerClassName="map-container"
          options={mapOptions}
          center={mapCenter}
          // onLoad={onMapLoad}
        >
          <MarkerClusterer>
            {(clusterer: any) =>
              (editMode === "VIEW" ? geofences : [editableCircle]).map((fence : Geofence , index:number) => 
              
              (
               
                // @ts-ignore
                <Geofence
                  key={index}
                  {...fence}
                  editable={editMode !== "VIEW"}
                  clusterer={clusterer}
                  handleSetEditableCircle={handleSetEditableCircle}
                />
              )
              )
            }
          </MarkerClusterer>
        </GoogleMap>
      </>
    );
  }
}

