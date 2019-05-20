import React, {Component} from 'react';
import {AsyncStorage, Alert, View} from "react-native"
import { Text, Button } from "native-base"
import Loading from "./../components/Loading"
import axios from "axios"
import {server} from "./../Accessible"
class Logout extends Component {
    constructor() {
        super()
        this.mounted = false
        this.state = { islogout: false, token: null }
    }
    static navigationOptions = {
        tabBarVisible: false
    }
    startMount = async () => {
        const token = await AsyncStorage.getItem("token")
        if( token ) {
            const json = JSON.parse( token )
            if(this.mounted) {
                this.setState({ token: {headers: {"Authorization": "Bearer " + json.response.token}} })
            }
        } else {
            Alert.alert("Message", "Session Timeout please login back.", [
                {text: "Login", onPress: () => this.logout()}
            ])
        }
    }
    componentDidMount() {
        this.mounted = true
        if( this.mounted ) {
            this.startMount()
        }
    }
    tokenRemover = () => {
        axios.get(server + "api/auth/logout", this.state.token )
        .then(response => {
            this.logout()
        })
        .catch(error => {
            this.logout()
        })
    }
    confirmLogout = () => {
        this.setState({ islogout: true })
        setTimeout(() => { this.tokenRemover() }, 1000)
    }
    cancelLogout = () => {
        this.props.navigation.navigate("Tracks")
    }
    componentWillUnmount() {
        this.mounted = false;
    }
    render() {
        const { islogout } = this.state
        if( islogout ) {
            return (<Loading text={"Logging out"} />)
        }
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Are you sure you want to logout?</Text>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <View style={{ flex: 1 }}>
                        <Button style={{ alignSelf: "flex-end", margin: 10 }} small onPress={() => this.confirmLogout() }>
                            <Text>Confirm</Text>
                        </Button>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button style={{ margin: 10 }} small onPress={() => this.cancelLogout()}>
                            <Text>Cancel</Text>
                        </Button>
                    </View>
                </View>
            </View>
        )
    }
    logout = async () => {
        await AsyncStorage.removeItem("token")
        this.props.navigation.navigate("Login")
    }
}

export default Logout