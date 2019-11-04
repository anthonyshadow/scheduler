import { useState, useEffect } from "react";
import Axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}, 
    interviewers:{}
  });

  const setDay = day => setState(prev => ({ ...prev, day }));
  const setDays = days => setState(prev => ({ ...prev, days }));
  const setAppointments = appointments => {
    console.log("set aPpointments", appointments)
    setState(prev => ({ ...prev, appointments}));
  }
  const setInterviewers = interviewers => setState(prev => ({ ...prev, interviewers}));

  useEffect(() => {
    Promise
    .all([
      Axios.get(`/api/days`),
      Axios.get(`/api/appointments`),
      Axios.get(`/api/interviewers`)
     ])
    .then((res) => {
      setAppointments(res[1].data)
      setInterviewers(res[2].data)
      setDays(res[0].data)
    })
  }, [])


  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };


    return Axios
      .put(`/api/appointments/${id}`, { interview })
      .then(response => {
        if (response.status === 204) {
          setState(prev => ({ ...prev, appointments }));
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  function cancelInterview(id) {
    return Axios.delete(`/api/appointments/${id}`)
      .then((response) => {
        console.log(response)
      }).catch(error => {
        console.log("delete error")
      })
    }

  function editInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return (
      Axios
        .put(`/api/appointments/${id}`, {interview})
        .then((res) => 
          setState({
            ...state,
            appointments
        })))
  }

  return {
    state, 
    setDay,
    bookInterview, 
    cancelInterview,
    editInterview,

  }

}