import React, { useEffect } from "react";


import "components/appointment/styles.scss";

import Header from "components/appointment/Header";
import Empty from "components/appointment/Empty";
import Show from "components/appointment/Show";
import useVisualMode from "hooks/useVisualMode";
import Form from "components/appointment/Form";
import Status from "components/appointment/Status";
import Confirm from "components/appointment/Confirm";
import Error from "components/appointment/Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const BACK = "BACK";
const STATUS = "STATUS";
const CREATE = "CREATE";
const DELETE = "DELETE";
const EDIT = "EDIT"
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";
const SAVING = "SAVING"
const CONFIRM = "CONFIRM"


export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    if (name && interviewer) {
      const interview = {
        student: name,
        interviewer
      };
      transition(SAVING);
      props.bookInterview(props.id, interview).then(() => transition(SHOW)).catch(() => {
        transition(ERROR_SAVE, true);
      });
    } else {
      transition(ERROR_SAVE);
    }
  }


  function cancelInterview(id) {
    transition(DELETE);
    props.cancelInterview(id).then(() => transition(EMPTY, true)).catch(() => transition(ERROR_DELETE, true));
  }

  useEffect(() => {
    if (props.interviewInfo && mode === EMPTY) {
      transition(SHOW);
    }
    if (props.interviewInfo === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [props.interviewInfo, transition, mode]);



  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}

      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}


      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={(name, interviewer) => save(name, interviewer)}
        />
      )}

      {mode === DELETE && <Status message="Deleting" />}

      {mode === EDIT &&
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={(name, interviewer) => save(name, interviewer)}
        />}

      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onDelete={() => {
            transition(DELETE);
            cancelInterview(props.id);
          }}
          onCancel={() => back()}
        />
      )}

      {mode === ERROR_SAVE && <Error message="Could not save appointment." onClose={() => back()} />}

      {mode === ERROR_DELETE && <Error message="Could not delete appointment." onClose={() => back()} />}
    </article>
  )
}