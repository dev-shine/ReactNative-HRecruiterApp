import {
  INTERVIEW_EMAIL_SIGN_UP,
  INTERVIEW_EMAIL_SIGN_UP_REQUEST,
  INTERVIEW_EMAIL_SIGN_UP_FAILURE,
  INTERVIEW_EMAIL_SIGN_UP_ERROR,
  CANDIDATE_DETAILS_SUCCESS,
  CANDIDATE_DETAILS_FAILURE
} from "../actions/types";

const initialState = {
  registering: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case INTERVIEW_EMAIL_SIGN_UP_REQUEST:
      return {
        registering: true
      };
    case INTERVIEW_EMAIL_SIGN_UP:
      return { registering: false, ...action.payload };
      break;
    case INTERVIEW_EMAIL_SIGN_UP_FAILURE:
      return action.payload;
      break;
    case INTERVIEW_EMAIL_SIGN_UP_ERROR:
      return {
        success: false
      };
      break;
    case CANDIDATE_DETAILS_SUCCESS:
      return { registering: false, ...action.payload };
    break;
    case CANDIDATE_DETAILS_FAILURE:
      return { registering: false, ...action.payload };
    break;
    default:
      return initialState;
      break;
  }
}
