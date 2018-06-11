import React, { Component } from "react";
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Item,
  Input,
  Spinner
} from "native-base";
import { NetInfo, AsyncStorage } from "react-native";
import { Grid, Row } from "react-native-easy-grid";
import Logo from "../components/Logo";
import CustomButton from "../components/CustomButton";
import styles from "../styles";
import { notify } from "../helper/notify";
import { COLOR } from "../styles/color";
import { connect } from "react-redux";
import { verifyingOTP } from "../actions";
import { SUCCESS_STATUS } from "../helper/constant";
import { GOOGLE_ANALYTICS_TRACKER } from "../config/dev";
import { getItem, setItem } from "../helper/storage";

class OTPpage extends Component {
  constructor(props) {
    super();
    this.state = {
      otp: "",
      fb_id: props.fb_id,
      email: props.email,
      errors: {},
      isOnline: true
    };
  }
  static navigationOptions = {
    title: "Enter OTP"
  };
  async componentDidMount() {
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleNetwork
    );
    const get_email = await getItem("email");
    if (get_email !== undefined && get_email.email !== this.state.email) {
      AsyncStorage.removeItem("solution");
      AsyncStorage.removeItem("remaining_time");
    }
    setItem("email", JSON.stringify({ email: this.state.email }));
  }

  handleNetwork = isconnect => {
    this.setState({ isOnline: isconnect });
  };

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleNetwork
    );
  }

  validate(data) {
    const errors = {};
    if (!data) {
      errors.data = "Enter OTP";
      alert(errors.data);
    }
    return errors;
  }

  handleSubmit = async () => {
    const errors = this.validate(this.state.otp);

    if (Object.keys(errors).length === 0) {
      if (this.state.isOnline) {
        await this.props.verifyingOTP(
          this.state.email,
          this.state.otp,
          this.state.fb_id
        );

        if (this.props.otp.data !== undefined) {
          const { status, data } = this.props.otp.data;
          if (status === SUCCESS_STATUS) {
            GOOGLE_ANALYTICS_TRACKER.trackEvent(
              this.state.fb_id.toString(),
              status.toString()
            );
            this.props.navigation.navigate("Instructions", {
              fb_id: data.fb_id,
              profile_pic: data.profile_pic,
              name: data.name,
              email: this.state.email
            });
            this.textInput._root.clear();
          }
        }
      }
    }
  };
  static getDerivedStateFromProps(nextProps) {
    const { success, msg } = nextProps.otp;
    if (success !== undefined && !success) {
      notify("Something went wrong");
    }
    if (msg !== undefined) {
      alert(msg);
    }
    return null;
  }
  render() {
    const {
      otp: { registering, message }
    } = this.props;
console.log(this.props,"otppros")
    return (
      <Container style={styles.container}>
        <Content padder>
          <Grid>
            <Row style={styles.logoView}>
              <Logo />
            </Row>
            <Row>
              <Card style={styles.blockView}>
                <CardItem>
                  <Text style={styles.text}>
                    You are are about to start your test. Since all tests are
                    confidential, it's mandatory that you do it after approval
                    of our HR. Confirm the same, please ask HR for OTP password
                  </Text>
                </CardItem>
                <CardItem>
                  {message ? (
                    <Text style={{ color: COLOR.Red }}> {message}</Text>
                  ) : null}
                </CardItem>
                <Item style={styles.inputTextView}>
                  <Input
                    ref={input => (this.textInput = input)}
                    style={styles.inputText}
                    placeholder="Enter OTP"
                    placeholderTextColor={COLOR.Grey}
                    maxLength={4}
                    name="otp"
                    value={this.state.otp}
                    keyboardType="numeric"
                    selectionColor={COLOR.Grey}
                    underlineColorAndroid={COLOR.Grey}
                    onChangeText={text => this.setState({ otp: text })}
                  />
                </Item>
                {registering ? (
                  <Spinner color="#2196f3" />
                ) : (
                  <CustomButton text="Submit" onPress={this.handleSubmit} />
                )}
              </Card>
            </Row>
          </Grid>
        </Content>
      </Container>
    );
  }
}
const mapStateToProps = state => ({
  fb_id: state.interviewSignUp.fb_id,
  email: state.interviewSignUp.email,
  otp: state.otp
});
export default connect(
  mapStateToProps,
  { verifyingOTP }
)(OTPpage);
