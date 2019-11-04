import React from "react";


import "components/Application.scss";
import DayList from "components/DayList"
import Appointment from "components/appointment"
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from '../helpers/selectors';
import useApplicationData from "../hooks/useApplicationData";





export default function Application() {

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  } = useApplicationData();
  
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
            appointments={state.appointments}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {getAppointmentsForDay(state, state.day).map((appointment) => {
          console.log(appointment)
          const interviewers = getInterviewersForDay(state, state.day)
          return <Appointment
          key={appointment.id}
          id={appointment.id}
          time={appointment.time}
          interview={getInterview(state, appointment.interview)}
          interviewers={interviewers}
          bookInterview={bookInterview}
          cancelInterview={cancelInterview} />
        })}
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}



