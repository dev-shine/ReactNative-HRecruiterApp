import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import interviewReducer from "./interviewReducer";
import otpReducer from "./otpReducer";
import addCandidateReducer from "./addCandidateReducer";
import questionsReducer from "./questionsReducer";
import callHelpReducer from "./callHelpReducer";
import testReducer from "./testReducer";
import netInfoReducer from "./netInfo"
import candidateRoundReducer from "./candidateRoundReducer";

export default combineReducers({
  form: formReducer,
  interviewSignUp: interviewReducer,
  otp: otpReducer,
  candidate: addCandidateReducer,
  questions: questionsReducer,
  callHelp: callHelpReducer,
  test: testReducer,
  network: netInfoReducer,
  candidateInfo : candidateRoundReducer
});
