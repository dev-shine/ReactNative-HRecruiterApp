import PubSub from 'pubsub-js';
import * as firebase from "firebase";
import { modifyEmail, modifyDate } from "../helper/index";
var today = new Date();
var todayDate = today.toLocaleDateString("en-IN");
var modify_Date = modifyDate(todayDate);

firebaseSignup = (msg,data) => {

    const {API_URL, email } = data;
    let modify_Email = modifyEmail(email);    
    let signupPath = `${modify_Date.toString()}`+"/signUp/" + modify_Email ;
    let apiData = msg == "FIREBASE_SIGNUP_FAILURE" ? data.err.response.data : data.res.data;

    return firebase.database().ref(signupPath).set({
        API_URL:API_URL,
        res: apiData,
    })
} 

firebaseVerifyOtp = (msg,data) => {

    const {API_URL, email, res, examToken,fb_id  } = data;
    let modify_Email = modifyEmail(email);    
    let verfiyOtp = `${modify_Date.toString()}`+"/verfiyOtp/" + modify_Email ;

    return firebase.database().ref(verfiyOtp).set({
        API_URL:API_URL,
        res: res.data,
        examToken:examToken,
        status:res.status,
        fb_id:fb_id
    })
}

firebaseGetQuestion = (msg,data) => {

    const {API_URL, email, res,fb_id  } = data;
    let modify_Email = modifyEmail(email);    
    let getQuestion = `${modify_Date.toString()}`+"/getquestion/" + modify_Email ;
    let apiData = msg == "FIREBASE_GET_QUESTION_FAILURE" ? data.err.response.data : data.res.data;

    return firebase.database().ref(getQuestion).set({
        API_URL:API_URL,
        res: apiData,
        fb_id:fb_id
    })
}

firebaseSubmitTest = (msg,data) => {
    
    const {API_URL, email, res,fb_id  } = data;
    let modify_Email = modifyEmail(email);    
    let submitTest = `${modify_Date.toString()}`+"/submitTest/" + modify_Email ;

    return firebase.database().ref(submitTest).set({
        API_URL:API_URL,
        res: res.data,
        status:res.status,
        fb_id:fb_id
    })
}

// Firebase Action for Sign up 
var SIGN_UP_SUCCESS = PubSub.subscribe('FIREBASE_SIGNUP_SUCCESS', firebaseSignup);
var SIGN_UP_FAILURE = PubSub.subscribe('FIREBASE_SIGNUP_FAILURE', firebaseSignup);

// Firebase Action for OTP Verification 
var VERIFY_OTP_SUCCESS = PubSub.subscribe('FIREBASE_VERIFY_OTP_SUCCESS', firebaseVerifyOtp); 
var VERIFY_OTP_FAILURE = PubSub.subscribe('FIREBASE_VERIFY_OTP_FAILURE', firebaseVerifyOtp);

// Firebase Action for GetQuestions  
var GET_QUESTION_SUCCESS = PubSub.subscribe('FIREBASE_GET_QUESTION_SUCCESS', firebaseGetQuestion); 
var GET_QUESTION_FAILURE = PubSub.subscribe('FIREBASE_GET_QUESTION_FAILURE', firebaseGetQuestion);

// firebase Action for submitTest SUBMIT_TEST
var SUBMIT_TEST_SUCCESS = PubSub.subscribe('FIREBASE_SUBMIT_TEST_SUCCESS', firebaseSubmitTest); 
var SUBMIT_TEST_FAILURE = PubSub.subscribe('FIREBASE_SUBMIT_TEST_FAILURE', firebaseSubmitTest);