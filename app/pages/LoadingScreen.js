import React from "react"
import {AsyncStorage, View, Image, Text, Dimensions} from "react-native"
import { server, timeout } from "./../Accessible"
import axios from "axios"
class LoadingScreen extends React.Component {
    static navigationOptions = {
        header: null,
        tabBarVisible: false
    }
    constructor() {
        super()
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem("token")
        if( userToken ) {
            const json = JSON.parse( userToken )
            axios.get( server + "api/auth/user", { headers: {"Authorization": "Bearer " + json.response.token } }, timeout )
            .then( response => {
                json.user = response.data.success
                AsyncStorage.setItem("token", JSON.stringify( json ))
                this.props.navigation.navigate("App")
            })
            .catch( error => {
                AsyncStorage.removeItem("token")
                this.props.navigation.navigate("Auth")
            })
        } else {
            this.props.navigation.navigate("Auth")
        }
    }

    render() {
        const { width } = Dimensions.get("window")
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Image style={{ width: width - 300, height: width - 300, marginBottom: 10 }} source={require('./../img/material-ui-logo.png')} />
                <Text style={{ color: "#4AB0F9", fontSize: 20 }}>Attendance Application</Text>
            </View>
        )
    }
}

export default LoadingScreen