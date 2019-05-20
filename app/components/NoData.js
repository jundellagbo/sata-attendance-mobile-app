import React from "react"
import {View} from "react-native"
import {Icon, Text} from "native-base"
import PropTypes from "prop-types"
const NoData = (props) => (
    <View style={style.center}>
        <Icon name={"cloud"} />
        <Text style={{ marginTop: 15, color: "#222222" }}>{props.text}</Text>
    </View>
)
const style = {
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
}
NoData.propTypes = {
    text: PropTypes.string
}
export default NoData