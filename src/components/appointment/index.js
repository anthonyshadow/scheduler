import React from "react";


import "components/appointment/styles.scss";

import Header from "components/appointment/Header";
import Empty from "components/appointment/Empty";
import Show from "components/appointment/Show";
import useVisualMode from "hooks/useVisualMode";
import Form from "components/appointment/Form";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE"

export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return <article className="appointment">
    < Header time={props.time} />
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (<Show
      student={props.interview.student}
      interviewer={props.interview.interviewer}
    />)}
    {mode === CREATE && (<Form
      interviewers={[]}
      onCancel={() => back(EMPTY)}
    />)}
  </article>;
}