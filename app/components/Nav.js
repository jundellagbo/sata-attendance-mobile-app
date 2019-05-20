import React from "react"
import {Header, Left, Body, Right, Text, Icon} from "native-base"
import {TouchableOpacity} from "react-native"
import PropTypes from "prop-types"
const Nav = (props) => (
    <Header style={style.header}>
        <Left style={style.flex}>
        {
            props.left ?
            (
                <TouchableOpacity onPress={props.left.onPress}>
                { props.left.icon ? (<Icon name={props.left.icon} style={style.white} />) : (<Text style={[style.white, { fontSize: 12 }]}>{props.left.text}</Text>) }
                </TouchableOpacity>
            ) : null
        }
        </Left>
        <Body style={[style.flex, style.center]}>
            <Text style={[style.white, { fontSize: 18} ]}>{props.title}</Text>
            { props.secondary ? (<Text style={{ color: "#ffffff" }} note>{props.secondary}</Text>) : null }
        </Body>
        <Right style={style.flex}>
        {
            props.right ?
            (
                <TouchableOpacity onPress={props.right.onPress}>
                { props.right.icon ? (<Icon style={style.white} name={props.right.icon} />) : (<Text style={[style.white, { fontSize: 12 } ]}>{props.right.text}</Text>) }
                </TouchableOpacity>
            ) : null
        }
        </Right>
    </Header>
)
const style = {
    flex: {
        flex: 1
    },
    center: {
        justifyContent: "center",
        alignItems: "center"
    },
    white: {
        color: "#ffffff"
    },
    header: {
        paddingLeft: 15,
        paddingRight: 15
    }
}

Nav.propTypes = {
    left: PropTypes.object,
    title: PropTypes.string,
    secondary: PropTypes.object,
    right: PropTypes.object
}

export default Nav