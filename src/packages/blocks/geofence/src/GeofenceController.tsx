import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { getCenter } from "geolib";
import { Geofence } from "./interface";
import Radar from 'radar-sdk-js';
import { v4 as uuid } from "uuid";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  geofenceList: [] ;
  editMode : string;
  mapCenter: { lat: number; lng: number };
  editableCircle: Partial<Geofence> | undefined;
  lat:number | undefined;
  lng:number | undefined;
  idf:string;
  rad:number | undefined;
  deleteIndex:string | undefined;
  updateIndex:string | undefined;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class GeofenceController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  geofenceDataApiCallId: any = "";
  geofenceDeleteApiCallId: any = "";
  geofenceUpdateApiCallId:any= "";
  geofenceCreateApiCallId:any="";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.AccoutLoginSuccess),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.LocationUpdate),
      getName(MessageEnum.GeoFencingEvent)
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      updateIndex:undefined,
      deleteIndex:undefined,
      editMode : "VIEW",
      geofenceList: [] ,
      mapCenter: { lat: 0, lng: 0 },
      editableCircle:undefined,
      lat:undefined ,
      lng:undefined,
      idf:"",
      rad: undefined,
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  stringify (obj: any) {
   return JSON.stringify(obj, null, 2)
  };

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (
      this.geofenceDataApiCallId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      this.handleFetchGeofenceResponse(message)
    }

    if (
      this.geofenceDeleteApiCallId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      this.handleDeleteGeofenceResponse(message);
    }
    
    if (
      this.geofenceUpdateApiCallId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      this.handleUpdateGeofenceResponse(message)
    }

    if (
      this.geofenceCreateApiCallId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      this.handleCreateGeofenceResponse(message)
    }

    // Customizable Area End
  }

  // Customizable Area Start
  async componentDidMount() {
    super.componentDidMount();
    this.fetchCurrentLocation()
    this.fetchGeofenceData()
  }

  handleFetchGeofenceResponse = (message:any) => {
    const apiResponse = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    if(apiResponse && apiResponse.data) {
      this.setState({ geofenceList : apiResponse.data})

      interface Location {
        latitude: number;
        longitude: number;
      }
      
      const center = getCenter(
        apiResponse.data.map(({ latitude, longitude }: Location) => ({
          latitude,
          longitude,
        }))
      );

      if (!center) return;
      this.setState({ mapCenter: { lat: center.latitude , lng : center.longitude} })
    }
  }

  handleUpdateGeofenceResponse = (message:any) => {
    const apiResponse = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    if(apiResponse && apiResponse.data) {
      apiResponse.data.id && alert("Update success");
      const index = this.state.geofenceList.findIndex((fence:any) => fence.id === this.state.updateIndex);
      if(apiResponse.data.disabled ) {
        this.state.geofenceList.splice(index, 1);
      } else {
        const newGeofence:any= this.state.geofenceList;
        newGeofence[index] = apiResponse.data;
        this.setState({geofenceList:newGeofence });
      }
      this.setState({ editMode:"VIEW"})
    }
  }

  handleDeleteGeofenceResponse = (message:any) => {
    const apiResponse = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    if(apiResponse && apiResponse.data) {
      if(apiResponse.data.message === "Deleted") {
        alert("delete success");
        const index = this.state.geofenceList.findIndex((fence:any) => fence.id === this.state.deleteIndex);
        this.state.geofenceList.splice(index, 1);
        this.setState({editMode:"VIEW"})
      }
    }
  }

  handleCreateGeofenceResponse = (message:any) => {
    const apiResponse = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
    if(apiResponse && apiResponse.data) {
      apiResponse.data.id && alert("create success");
      let newGeofence:any= this.state.geofenceList;
      newGeofence = [ ...newGeofence , apiResponse.data ];
      this.setState({geofenceList:newGeofence , editMode:"VIEW"})
    }
  }

  fetchCurrentLocation = () => {
    Radar.initialize(configJSON.radarKey);
    Radar.getLocation((err: any, result: any) => {
      if (!err) {
        const { location:{latitude , longitude} } = result;
        this.setState({mapCenter:{lat:latitude , lng:longitude}});
      }
    });
  }

  fetchGeofenceData = async () => {
    const GeofenceData = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.geofenceDataApiCallId = GeofenceData.messageId;

    GeofenceData.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.geofenceListApi
    );

    const header = {
      "Content-Type": configJSON.geofenceContentType,
    };

    GeofenceData.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    GeofenceData.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.geofenceListMethod
    );

    runEngine.sendMessage(GeofenceData.id, GeofenceData);
   
  };

  apiCallUpdateGeofenceHandler = (id : string , body:any) => {

    this.setState({updateIndex:id})
    
    const GeofenceUpdate = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.geofenceUpdateApiCallId = GeofenceUpdate.messageId;

    GeofenceUpdate.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.geofenceListApi}/${id}`
    );

    const header = {
      "Content-Type": configJSON.geofenceContentType,
    };

    GeofenceUpdate.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(body)
    );

    GeofenceUpdate.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    GeofenceUpdate.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.geofenceUpdateMethodType
    );

    runEngine.sendMessage(GeofenceUpdate.id, GeofenceUpdate);
  }

  apiCallCreatGeofenceHandler = ( ) => {

    const {idf , lat, lng , rad } = this.state
    const data = {
      id: uuid(),
      identifier: idf ?? "",
      latitude: lat,
      longitude: lng,
      radius: rad,
      notify_on_entry: true,
      notify_on_exit: true,
    }
    
    const GeofenceCreate = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.geofenceCreateApiCallId = GeofenceCreate.messageId;

    GeofenceCreate.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.geofenceListApi
    );

    const header = {
      "Content-Type": configJSON.geofenceContentType,
    };
   
    GeofenceCreate.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(data)
    );

    GeofenceCreate.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    GeofenceCreate.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.geofenceCreateMethodType
    );

    runEngine.sendMessage(GeofenceCreate.id, GeofenceCreate);
  }

  updateGeofenceHandler = () => {
    const data = {
        identifier: this.state.idf,
        latitude: this.state.lat,
        longitude: this.state.lng,
        radius: this.state.rad,
    }

    if(this.state.editableCircle && this.state.editableCircle.id ) {
      const id = this.state.editableCircle.id;
      this.apiCallUpdateGeofenceHandler(id , data)
    }
  }

  createGeofenceHandler = () => {
    const { lat , lng } = this.state.mapCenter
    const data = {
      id: uuid(),
      identifier:"",
      latitude: lat,
      longitude: lng,
      radius: 100,
      notify_on_entry: true,
      notify_on_exit: true,
    }
    this.setState({editMode : "ADD" , editableCircle : data , lat , lng , rad:100  , idf:""});
  }

  disableHandler = (id: string, notify_on_entry: boolean, notify_on_exit: boolean , disabled:boolean) => {
    const body = {
      notify_on_entry:!notify_on_entry ,
      notify_on_exit:!notify_on_exit ,
      disabled:!disabled
    }
  
    this.apiCallUpdateGeofenceHandler(id , body)
  }

  HandleDelete = (id:string) => {

    this.setState({ deleteIndex : id}) ;

    const GeofenceDelete = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.geofenceDeleteApiCallId = GeofenceDelete.messageId;

    GeofenceDelete.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.geofenceListApi}/${id}`
    );

    const header = {
      "Content-Type": configJSON.geofenceContentType,
    };

    GeofenceDelete.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    GeofenceDelete.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.geofenceDeleteMethodType
    );

    runEngine.sendMessage(GeofenceDelete.id, GeofenceDelete);
  }

  HandleSubmit = () => {
    console.log(this.state.idf)
    if (!this.state.idf || !this.state.lat || !this.state.lng || !this.state.rad) {
      alert('please enter all the values')
      return;
    }
    this.state.editMode != "ADD" ?
    this.updateGeofenceHandler() : 
    this.apiCallCreatGeofenceHandler()
  }

  handleBackClick = (editMode:string) => {
    this.setState({editMode:editMode})
  }

  handleSetEditableCircle = (editCircle:any) => {
    this.setState({editableCircle : editCircle})
    this.setState({ lat: editCircle.latitude!, lng: editCircle.longitude!  ,  rad : editCircle.radius})
  }

  handleEditClick = (fence: Geofence) => {
    this.setState({ lat: fence.latitude!, lng: fence.longitude! , idf : fence.identifier! ,  rad : fence.radius,})
    this.setState({editableCircle : fence})
    this.setState({ editMode : "EDIT" , mapCenter : { lat: fence.latitude!, lng: fence.longitude!} })
  }

  handlerIdfChange = (val:string) => {
    this.setState({idf:val})
  }

  handlerRadChange = (val:number) => {
    this.setState({rad:val})
  }

  handlerLatChange = (val:number) => {
    this.setState({lat:val})
  }

  handlerLngChange = (val:number) => {
    this.setState({lng:val})
  }
  // Customizable Area End
}
