import React, { Component, Fragment } from "react";
import { Image, Alert } from "react-native";
import {
  Container,
  Content,
  Text,
  Thumbnail,
  Card,
  CardItem,
  Spinner
} from "native-base";
import { connect } from "react-redux";
import { getQuestions } from "../actions";
import styles from "../styles";
import CustomButton from "../components/CustomButton";
import HorizontalLine from "../components/HorizontalLine";
import { setItem } from "../helper/storage";
import { SUCCESS_STATUS } from "../helper/constant";

class Instructions extends Component {
  componentDidMount() {
    const fb_id = this.props.navigation.getParam("fb_id");
    const email = this.props.navigation.getParam("email");
    this.props.getQuestions(email,fb_id);
  }
  static getDerivedStateFromProps(nxtprops) {
    if (nxtprops.questions !== null && nxtprops.questions !== undefined) {
      const { data } = nxtprops.questions;
      if (data !== undefined && data.status == SUCCESS_STATUS) {
        setItem("question", JSON.stringify({ data: data }));
      }
    }
    return null;
  }
  componentDidUpdate() {
    const { error, message } = this.props.questions;
    if (error !== undefined) {
      if (error === 1) {
        Alert.alert(
          "Alert",
          `${message}`,
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
  }
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
  handlePress = () => {
    this.props.navigation.navigate("TestPage", {
      ...this.props.questions,
      ...this.props.navigation.state.params
    });
  };
  render() {
    const name = this.props.navigation.getParam("name");
    const { questions } = this.props;
    return (
      <Container style={styles.container}>
        <Content padder>
          <Card style={styles.blockView}>
            <CardItem>
              <Text style={styles.headerText}>Instructions</Text>
            </CardItem>
            <HorizontalLine />
            {questions !== null ? (
              <Fragment>
                <CardItem>
                  {questions.data !== undefined ? (
                    <Text style={styles.text}>
                      {questions.data.instructions}
                    </Text>
                  ) : (
                    <Text style={styles.text}>No data found</Text>
                  )}
                </CardItem>
                <CustomButton text="Continue" onPress={this.handlePress} />
              </Fragment>
            ) : (
              <Spinner color="#2196f3" />
            )}
          </Card>
        </Content>
      </Container>
    );
  }
}
const mapStatetoProps = ({ questions }) => ({ questions });

export default connect(
  mapStatetoProps,
  { getQuestions }
)(Instructions);
