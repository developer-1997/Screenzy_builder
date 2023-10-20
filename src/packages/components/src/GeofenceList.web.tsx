import PropTypes from 'prop-types';
import React, { Component } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { BlockComponent } from "../../framework/src/BlockComponent";


interface Props {
  geofenceList: any;
  title: string;
  handleEditClick:any
}

interface S {
}

interface SS {
}

export default class GeofenceList extends BlockComponent<Props, S, SS> {
  static propTypes = {
    geofenceList: PropTypes.any, 
    title:PropTypes.string,
    handleEditClick:PropTypes.func,
  };

  constructor(props: any) {
    super(props);

  }

  render() {
    const { geofenceList , title , handleEditClick} = this.props

    return (
      <>
        <h2>{title}</h2>
        {geofenceList.map((fence:any , index:number) => (
          <div data-test-id={`GeofenceList${index}`} onClick={() => handleEditClick(fence)} style={{cursor: 'pointer'}} key={fence.id} className={`${fence.notify_on_entry || fence.notify_on_exit ? 'active' : 'inactive'} fence-box`}>
            <p>{fence.identifier}</p>
          </div>
        ))}
      </>
    );
  }
}

