import React, {Component} from 'react';
import {View} from 'react-native';
import {Container, Text, Content} from "native-base"
import Nav from "./../../components/Nav"
import { primary } from "./../../Accessible"
class HelpDeskContent extends Component {
  constructor( props ) {
    super( props )
    this.state = {
      title: props.navigation.state.params.item.title,
      content: props.navigation.state.params.item.content
    }
  }
  render() {
    const { title, content } = this.state
    return (
      <Container>
      <Nav
      left={{ icon: "arrow-back", onPress: () => this.props.navigation.goBack() }}
      />
      <Content padder>
        <Text style={{ fontSize: 18, color: primary, paddingTop: 5, paddingBottom: 5 }}>{title}</Text>
        {content}
      </Content>
      </Container>
    )
  }
}
export default HelpDeskContent