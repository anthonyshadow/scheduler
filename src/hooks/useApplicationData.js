import { useState, useEffect, useReducer } from "react";
import Axios from "axios";

export default function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    const { appointments, day, days, id, interview, interviewers } = action
    switch (action.type) {
      case SET_DAY:
        return {
          ...state, day
        };
      case SET_APPLICATION_DATA:
        return {
          ...state, days, appointments, interviewers
        };
      case SET_INTERVIEW: {
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview }
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        return { ...state, id, appointments };
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });


  useEffect(() => {
    Promise
      .all([
        Axios.get(`/api/days`),
        Axios.get(`/api/appointments`),
        Axios.get(`/api/interviewers`)
      ]).then(all => {

        dispatch({
          type: SET_APPLICATION_DATA,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        })

      }, []);

    })
    function bookInterview(id, interview) {
      return Axios
        .put(`/api/appointments/${id}`, { interview })
        .then(response => {
          if (response.status === 204) {
            dispatch({ type: SET_INTERVIEW, id, interview });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }

    function cancelInterview(id) {
      return Axios
        .delete(`/api/appointments/${id}`)
        .then(response => {
          console.log(response);
        })

        .catch(error => {
          console.log("delete error");
        });
    }


  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  }
}