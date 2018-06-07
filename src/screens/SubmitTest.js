import React, { Component } from "react";
import { BackHandler, NetInfo, Alert } from "react-native";
import {
  Container,
  Content,
  Text,
  Button,
  Card,
  CardItem,
  Thumbnail,
  Spinner
} from "native-base";
import HorizontalLine from "../components/HorizontalLine";
import CustomButton from "../components/CustomButton";
import styles from "../styles";
import { connect } from "react-redux";
import forEach from "lodash/forEach";
import { submitTest } from "../actions";
import { getItem } from "../helper/storage";
import { SUCCESS_STATUS } from "../helper/constant";
import { notify } from "../helper/notify";
import TimerCountdown from "react-native-timer-countdown";
import { StackActions, NavigationActions } from "react-navigation";

class SubmitTest extends Component {
  constructor() {
    super();
    this.state = {
      isOnline: false
    };
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleNetwork
    );
  }
  handleNetwork = isconnect => {
    //functinality for net connection at time of answering paper
    this.setState({ isOnline: isconnect });
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleNetwork
    );
  }

  componentDidUpdate() {
    if (this.props.test.data !== undefined) {
      if (this.props.test.data.status === SUCCESS_STATUS) {
        Alert.alert(
          "Thank You",
          "Your response has been recorded. Please contact HR for for further instructions.",
          [
            {
              text: "OK",
              onPress: () => this.props.navigation.popToTop()
            }
          ],
          { cancelable: false }
        );
      }
    }
    const { success } = this.props.test;
    if (success !== undefined) {
      if (success === false) {
        notify("Something went wrong");
      }
    }
  }

  handleBackButton = () => {
    alert("Not Allowed");
    return true;
  };
  static navigationOptions = ({ navigation }) => {
    const name = navigation.getParam("name");
    const profile_pic = navigation.getParam("profile_pic");
    return {
      title: name,
      headerLeft: (
        <Content padder>
          <Thumbnail small source={{ uri: profile_pic }} />
        </Content>
      )
    };
  };

  handleTestSubmit = async () => {
    const ans = await getItem("solution");
    const { params } = this.props.navigation.state;
    const fb_id = params.fb_id;
    const job_profile = params.data.job_profile;
    const questionIds = [];
    _.forEach(params.data.data, value => {
      _.forEach(value.questions, value => {
        questionIds.push(value._id);
      });
    });
    const taken_time_minutes = params.taken_time_minutes;
    const data = {
      answers: ans.solution,
      fb_id: fb_id,
      job_profile: job_profile,
      questionIds: questionIds,
      taken_time_minutes: taken_time_minutes
    };
    this.props.submitTest(data);
  };

  render() {
    const { isOnline } = this.state;
    const {
      test: { submitting }
    } = this.props;

    return (
      <Container style={styles.container}>
        <Content padder>
          <Card style={styles.blockView}>
            <CardItem>
              <Text style={styles.headerText}>Submit Test</Text>
            </CardItem>
            <HorizontalLine />
            <CardItem>
              <Text style={styles.text}>
                To Submit your Test, please turn on your Internet connection.
              </Text>
            </CardItem>
            {!isOnline ? (
              <Button disabled block>
                <Text>Click Here</Text>
              </Button>
            ) : submitting ? (
              <Spinner color="#2196f3" />
            ) : (
              <CustomButton text="Click Here" onPress={this.handleTestSubmit} />
            )}
          </Card>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ test }) => ({ test });
export default connect(
  mapStateToProps,
  { submitTest }
)(SubmitTest);