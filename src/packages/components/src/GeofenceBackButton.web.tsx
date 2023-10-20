import PropTypes from 'prop-types';
import React, { Component } from "react";
import { BlockComponent } from "../../framework/src/BlockComponent";


interface Props {
  handleBackClick:any ,
  backButtonTitle:string
}

interface S {
}

interface SS {
}

export default class GeofenceBackButton extends BlockComponent<Props, S, SS> {
  static propTypes = {
    handleBackClick:PropTypes.func,
    backButtonTitle:PropTypes.string
  };

  constructor(props: any) {
    super(props);

  }

  render() {
    const { handleBackClick , backButtonTitle} = this.props

    return (
      <>
        <button
          className="back-button"
          onClick={() => handleBackClick("VIEW")}
        >
          &#8592; {backButtonTitle}
        </button>
      </>
    );
  }
}

