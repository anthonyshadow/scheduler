import React from "react";


import "components/appointment/styles.scss";

import Header from "components/appointment/Header";
import Empty from "components/appointment/Empty";
import Show from "components/appointment/Show";
import useVisualMode from "hooks/useVisualMode";
import Form from "components/appointment/Form";
import Status from "components/appointment/Status";
import Confirm from "components/appointment/Confirm";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVE";
const DELETING = "DELETE";
const CONFIRM = "CONFIRM";

export default function Appointment(props) {

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    return interview
  }

  function cancel() {
    return props.cancelInterview(props.id)
  }

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
    {mode === CREATE && (
      <Form
        interviewers={props.interviewers}
        onCancel={() => back(EMPTY)}
        onSave={(name, interviewer) => {transition(SAVING);
          props.bookInterview(props.id, save(name, interviewer)).then(() => transition(SHOW))
      }}
         />)}
    {mode === CONFIRM && <Confirm
      message="Are You Sure You Want To Delete?"
      onDelete={() => {
        transition(DELETING)
        cancel().then(() => transition(EMPTY))
      }}
      onCancel={() => back()}
    />}
    {mode === DELETING && <Status message="Deleting" />}
    {mode === SAVING && <Status message="Saving" />}
  </article>;
}