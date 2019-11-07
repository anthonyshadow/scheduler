import { useState, useEffect, useReducer } from "react";
import Axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducer/application";

export default function useApplicationData() {



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
          throw new Error(error);
        });
    }

    function cancelInterview(id) {
      return Axios
        .delete(`/api/appointments/${id}`)
        .then(response => {
          console.log(response);
        })

        .catch(error => {
          throw new Error(error);
        });
    }

    function getSpotsForDay(appointments, days, day) {
      const appointmentsSpread = { ...appointments };
      const specificDay = days.find(target => target.name === day.name);
      const appointmentList = [...specificDay.appointments];
      const numberOfSpots = appointmentList.length;
  
      const fullSpots = Object.values(appointmentsSpread).reduce(
        (result, appointment) => {
          if (appointmentList.includes(appointment.id)) {
            if (appointment.interview) {
              return result + 1;
            }
          }
          return result;
        },
        0
      );
      return numberOfSpots - fullSpots;
    }


  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    getSpotsForDay
  }
}