import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import QuestionDataService from "../services/question-service";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types";

// Register User
export const registerUser = (userData, history) => async dispatch => {
  try {
    const res = await QuestionDataService.register(userData);
    if (res) {
      history.push("/login")
    }
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })

  }
  // axios
  //   .post("/api/register", userData)
  //   .then(res => history.push("/login")) // re-direct to login on successful register
  //   .catch(err =>
  //     dispatch({
  //       type: GET_ERRORS,
  //       payload: err.response.data
  //     })
  //   );
};

// Login - get user token
export const loginUser = userData => async dispatch => {
  try {
    const res = await QuestionDataService.login(userData);
    // Save to localStorage
    // Set token to localStorage
    const { token } = res.data;
    localStorage.setItem("jwtToken", token);
    // Set token to Auth header
    setAuthToken(token);
    // Decode token to get user data
    const decoded = jwt_decode(token);
    console.log(decoded)

    // Set current user
    dispatch(setCurrentUser(decoded));
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })

  }
};

export const submitResult = resultData => async (dispatch, getState) => {
  try {
    let authtemp = getState().auth;
    authtemp.attempt = authtemp.attempt + 1;
    dispatch(setCurrentUser(authtemp));
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err
    })

  }
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};