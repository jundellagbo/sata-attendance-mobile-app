import React from "react"
import {View} from "react-native"
import {Spinner, Text} from "native-base"
import {primary} from "./../Accessible"
import PropTypes from "prop-types"
const Loading = (props) => (
    <View style={style.center}>
        <Spinner color={primary} />
        <Text style={{ color: "#222222" }}>{props.text}</Text>
    </View>
)
const style = {
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
}
Loading.propTypes = {
    text: PropTypes.string
}
export default Loading