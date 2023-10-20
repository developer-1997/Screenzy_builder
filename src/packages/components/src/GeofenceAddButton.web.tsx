import PropTypes from 'prop-types';
import React from "react";
import { BlockComponent } from "../../framework/src/BlockComponent";


interface Props {
  AddIcon: string;
  AddTitle: string;
  createGeofenceHandler:any
}

interface S {
}

interface SS {
}

export default class GeofenceAddButton extends BlockComponent<Props, S, SS> {
  static propTypes = {
    AddIcon: PropTypes.string, 
    AddTitle:PropTypes.string,
    createGeofenceHandler:PropTypes.func
  };

  constructor(props: any) {
    super(props);

  }

  render() {
    const { AddTitle , AddIcon , createGeofenceHandler} = this.props

    return (
      <>
        <button
          style={{
            position: "fixed",
            display: "flex",
            width: "5rem",
            height: "2.5rem",
            background: "#fff",
            padding: "12px",
            bottom: "1rem",
            right: "1rem",
            zIndex: 14,
            fontSize: "16px",
            color: "black",
            fontWeight: "bold",
            justifyContent: "center",
            alignItems: "center",
            // bottom: '211px',
            left: '217px'
          }}
          onClick={() => createGeofenceHandler()}
        >
      <img src={AddIcon} width={"16px"} style={{ marginRight: "4px" }} />
      <p>{AddTitle}</p>
    </button>
      </>
    );
  }
}

