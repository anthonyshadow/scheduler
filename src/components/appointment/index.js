import React from "react";


import "components/appointment/styles.scss";

import Header from "components/appointment/Header"
import Empty from "components/appointment/Empty"
import Show from "components/appointment/Show"

export default function Appointment(props) {
  return <article className="appointment">
    < Header time={props.time} />
    {props.interview && <Show student={props.interview.student} interviewer={props.interview.interviewer} />}
    {!props.interview && <Empty />}
  </article>;
}