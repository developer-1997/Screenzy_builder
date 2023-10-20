import PropTypes from 'prop-types';
import React from "react";
import { BlockComponent } from "../../framework/src/BlockComponent";


interface Props {
  editMode:string;
  editableCircle: any;
  lat:number | undefined;
  lng:number | undefined;
  rad:number | undefined;
  idf:string | undefined;
  handlerIdfChange:any,
  handlerRadChange:any,
  handlerLatChange:any,
  handlerLngChange:any,
  HandleSubmit:any ,
  disableHandler:any ,
  HandleDelete:any,
  editTitle:string
}

interface S {
}

interface SS {
}

export default class GeofenceEditor extends BlockComponent<Props, S, SS> {
  static propTypes = {
    editMode:PropTypes.string,
    editableCircle: PropTypes.any, 
    lat: PropTypes.number, 
    lng: PropTypes.number, 
    rad: PropTypes.number, 
    idf: PropTypes.string, 
    handlerIdfChange:PropTypes.func,
    handlerRadChange:PropTypes.func,
    handlerLatChange:PropTypes.func,
    handlerLngChange:PropTypes.func,
    HandleSubmit:PropTypes.func ,
    disableHandler:PropTypes.func , 
    HandleDelete:PropTypes.func ,
    editTitle:PropTypes.string
  };

  constructor(props: any) {
    super(props);

  }

  render() {
    const { editTitle , editMode , lat , lng , idf , rad , handlerIdfChange , handlerRadChange , handlerLatChange , handlerLngChange , HandleSubmit , HandleDelete,disableHandler ,  editableCircle:{notify_on_entry , notify_on_exit , id , disabled} } = this.props
    return (
      <>
         <>
          <h2>{editTitle}</h2>
          <div className="form">
            <input
              placeholder="identifier"
              className={!idf ? "error" : ""}
              value={idf}
              onChange={e => handlerIdfChange(e.target.value)}
            />
            <input
              placeholder="latitude"
              className={!lat ? "error" : ""}
              value={lat}
              onChange={e => handlerLatChange(e.target.value)}
            />
            <input
              placeholder="longitude"
              className={!lng ? "error" : ""}
              value={lng}
              onChange={e => handlerLngChange(e.target.value)}
            />
            <input
              placeholder="radius"
              className={!rad ? "error" : ""}
              value={rad}
              type="number"
              onChange={e => handlerRadChange(+e.target.value)}
            />
              <button onClick={HandleSubmit}>{editMode === "ADD" ? "Add" : "Update"}</button>
              {editMode === 'EDIT' && <button style={{backgroundColor: notify_on_entry || notify_on_exit ? 'gray' : 'green'}} onClick={() => disableHandler(id!, notify_on_entry!, notify_on_exit! , disabled!)}>{notify_on_entry || notify_on_exit ? 'Disable' : 'Enable'}</button>}
              {editMode === 'EDIT' && <button style={{backgroundColor: 'red'}} onClick={() => HandleDelete(id!)}>Delete</button>}
            </div>
        </>
      </>
    );
  }
}

