import React, {Component} from 'react';
import {View} from 'react-native';
import { Container, Content, Text } from "native-base"
import Nav from "./../components/Nav"
import Loading from "./../components/Loading"
import Network from "./../components/Network"
import NoData from "./../components/NoData"
import axios from "axios"
import {server, primary, secondary} from "./../Accessible"
class Summary extends Component {
  constructor(props) {
    super( props )
    this.state = {
      room: props.navigation.state.params.room,
      token: props.navigation.state.params.token,
      loadinginfo: true,
      infodata: [],
      errorInfo: false,
    }
    this.mounted = false
  }

  fetchInfo = async() => {
    const { room, token } = this.state
    axios.get(server+"api/attendance/summary?roomid=" + room.id, token)
    .then( response => {
      if( this.mounted ) {
        this.setState({ errorInfo: false, loadinginfo: false, infodata: response.data.response })
      }
    })
    .catch( error => {
      if( this.mounted ) {
        this.setState({ errorInfo: true, loadinginfo: false })
      }
    })
  }

  componentDidMount() {
    this.mounted = true
    if( this.mounted ) {
      this.fetchInfo()
    }
  }
  
  componentWillUnmount() {
    this.mounted = false
  }
  
  render() {
    const {loadinginfo, infodata, errorInfo, room} = this.state
    return (
      <Container>
        <Nav 
          title={"Summary"}
          left={{ icon: "arrow-back", onPress: () => this.props.navigation.goBack() }}
        />
        {
            loadinginfo ? (<Loading text={"Loading"}/>) : errorInfo ? (<Network />) : 
            infodata.length ?
            <Content padder>
            <Text style={{ fontSize: 20, color: primary, fontWeight: "600" }}>{room.roomname} Summary</Text>
            {infodata.map((row, index) => (
                <View key={"summary-" + index} style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}>
                    <Text style={{fontSize: 18, color: primary }}>{row.getSubject}</Text>
                    <View style={{ flexDirection: "row", paddingTop: 3, paddingBottom: 3 }}>
                        <View style={{ flex: 1 }}>
                        <Text>Present</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                        <Text style={{ color: secondary }}>{row.present}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", paddingTop: 3, paddingBottom: 3 }}>
                        <View style={{ flex: 1 }}>
                        <Text>Late</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                        <Text style={{ color: secondary }}>{row.late}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", paddingTop: 3, paddingBottom: 3 }}>
                        <View style={{ flex: 1 }}>
                        <Text>Absent</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                        <Text style={{ color: secondary }}>{row.absent}</Text>
                        </View>
                    </View>
                </View>
            ))}</Content> : (<NoData text={"There is no record for today."} />)
        }
      </Container>
    )
  }
}

export default Summary