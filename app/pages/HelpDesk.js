import React, {Component} from 'react';
import {Text, View, FlatList} from 'react-native';
import {Container, ListItem, Left, Right, Icon} from "native-base"
import Nav from "./../components/Nav"
class HelpDesk extends Component {
  constructor() {
    super()
    this.state = {
      helps
    }
  }
  render() {
    const { helps } = this.state
    return (
      <Container>
          <Nav 
          title={"Help Desk"}
          left={{ icon: "arrow-back", onPress: () => this.props.navigation.goBack() }}
          />
          <FlatList
          keyboardShouldPersistTaps={'handled'}
          removeClippedSubviews={false}
          data={helps}
          keyExtractor={(item,index) => 'list-item-helps-' + index}
          renderItem={({ item }) => (
            <Helps 
            dataSource={item}
            onPress={() => this.props.navigation.navigate("HelpDeskContent", { item }) }
            />
          )}
          />
      </Container>
    )
  }
}

const Helps = (props) => (
  <ListItem onPress={props.onPress}>
    <Left>
      <Text style={{ fontWeight: "500" }} numberOfLines={1}>
        {props.dataSource.title}
      </Text>
    </Left>
    <Right>
      <Icon name={"chevron-right"} />
    </Right>
  </ListItem>
)

const helps = [
  {
    title: "How to manage section.",
    content: (
      <View>
      <Text style={{fontWeight: "600", paddingTop: 5, paddingBottom: 5}}>Adding section.</Text>
      <Text>Navigate section with the home icon, then click the "New Section" button.</Text>
      <Text style={{fontWeight: "600", paddingTop: 5, paddingBottom: 5}}>Section options.</Text>
      <Text>Click the section on the list, the menu will popup then click the selected options.</Text>
      </View>
    )
  },
  {
    title: "How to manage students.",
    content: (
      <View>
      <Text style={{fontWeight: "600", paddingTop: 5, paddingBottom: 5}}>Go to Section > Select section > Go to this section.</Text>
      <Text style={{fontWeight: "600", paddingTop: 5, paddingBottom: 5}}>Adding student.</Text>
      <Text>click the "New Student" button.</Text>
      <Text style={{fontWeight: "600", paddingTop: 5, paddingBottom: 5}}>Student options.</Text>
      <Text>Click the student on the list, the menu will popup then click the selected options you want to execute.</Text>
      </View>
    )
  },
  {
    title: "How to manage subjects",
    content: (
      <View>
      <Text style={{fontWeight: "600", paddingTop: 5, paddingBottom: 5}}>Go to Section > Select section > Go to this section > Check Attendance > Subjects.</Text>
      <Text style={{fontWeight: "600", paddingTop: 5, paddingBottom: 5}}>Adding subject.</Text>
      <Text>click the <Icon name={"add-circle"} /> icon on the right side of header.</Text>
      <Text style={{fontWeight: "600", paddingTop: 5, paddingBottom: 5}}>Subject options.</Text>
      <Text>Click the subject on the list, the menu will popup then click the selected options you want to execute.</Text>
      <Text note>Note: These subjects will be assigned only on this section.</Text>
      </View>
    )
  },
  {
    title: "Checking attendance",
    content: (
      <View>
      <Text style={{fontWeight: "600", paddingTop: 5, paddingBottom: 5}}>Go to Section > Select section > Go to this section > Check Attendance > Select Subject > Set Attendance.</Text>
      <Text>click each student ( select if student is present or late, if it is not set the student will be absent ).</Text>
      <Text style={{fontWeight: "600", paddingTop: 5, paddingBottom: 5}}>Submit Attendance.</Text>
      <Text>It will be added to attendance record, Now you can send sms after submitting the attendance.</Text>
      </View>
    )
  },
  {
    title: "How to Send SMS or notify the parents after submitting the attendance?",
    content: (
      <View>
      <Text style={{fontWeight: "600", paddingTop: 5, paddingBottom: 5}}>Go to Section > Select section > Go to this section > Send SMS button.</Text>
      <Text>Sending SMS needs a confirmation after clicking the button, it will notify the SMS Credits( the limits of sending sms ) and the number of attendance records on that session.</Text>
      <Text style={{ paddingTop: 10 }}>To add SMS credits you may ask your administrator.</Text>
      </View>
    )
  },
  {
    title: "Where can I find those messages to be sent.",
    content: (
      <View>
      <Text style={{fontWeight: "600", paddingTop: 5, paddingBottom: 5}}>Logs > Messages</Text>
      <Text>Filter the date from and end then click the <Icon name={"search"} /> Icon Button, then the message will retrieve on that date range.</Text>
      <Text style={{ paddingTop: 10 }}>Click those message you want to check. ( Note: you can't delete the messages. )</Text>
      </View>
    )
  },
  {
    title: "How to review my activity log?",
    content: (
      <View>
      <Text style={{fontWeight: "600", paddingTop: 5, paddingBottom: 5}}>Go to Logs</Text>
      <Text>Click the <Icon name={"assignment"} /> icon and enter date to filter your activity logs.</Text>
      <Text>You can check those users including their usernames and the logs that they have taken.</Text>
      <Text note style={{ paddingTop: 10 }}>Note: you can't remove the activity logs.</Text>
      </View>
    )
  },
  {
    title: "Manage accounts",
    content: (
      <View>
      <Text style={{fontWeight: "600", paddingTop: 5, paddingBottom: 5}}>Go to Accounts</Text>
      <Text>If you want to change your information, you can set your data and click "Save Data".</Text>
      </View>
    )
  },
  {
    title: "How to change my password",
    content: (
      <View>
      <Text style={{fontWeight: "600", paddingTop: 5, paddingBottom: 5}}>Go to Accounts then click the <Icon name={"lock"} /> icon.</Text>
      <Text>Enter your desired password then "Save password".</Text>
      </View>
    )
  },
  {
    title: "I can't login after registration",
    content: (
      <View>
      <Text>If you receive this message ("Please wait for confirmation") the administrator did not confirm your registration yet, you can login later.</Text>
      <Text style={{ paddingTop: 10 }}>"Invalid Login, please try again", If you receive this message after registration - means the administrator decline your request.</Text>
      </View>
    )
  },
  {
    title: "How to send SMS?",
    content: (
      <View>
      <Text>Go to Logs > Messages > Send SMS.</Text>
      </View>
    )
  },
  {
    title: "How to check attendance records?",
    content: (
      <View>
      <Text>Go to Section > Select Section | Go to Section > Check Attendance > Select Subject > Attendance Records.</Text>
      <Text>Filter Date to retrieve your attendance records.</Text>
      </View>
    )
  }
]

export default HelpDesk