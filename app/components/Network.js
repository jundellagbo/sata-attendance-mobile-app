import React from "react"
import {View} from "react-native"
import {Icon, Text} from "native-base"
const Network = () => (
    <View style={style.center}>
        <Icon name={"backup"} />
        <Text style={{ marginTop: 15, color: "#222222" }}>please check your network connection.</Text>
    </View>
)
const style = {
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
}
export default Network