import React, {useEffect} from "react";


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


export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    transition(STATUS);
    props.bookInterview(props.id, {student: name, interviewer})
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true))
  }
  
  function editInterview(name, interviewer) {
    props.editInterview(props.id, {student: name, interviewer})
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_DELETE, true))
  }

  function cancelInterview() {
    transition(STATUS);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true))
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
    <article className="appointment">
      <Header time={props.time}/>
      {(mode === EMPTY || mode === BACK) && <Empty onAdd={() => transition(CREATE)}/>}     
      {mode === SHOW && 
      <Show 
        student={props.interviewInfo ? props.interviewInfo.student:null} 
        interviewer={props.interviewInfo ? props.interviewInfo.interviewer:null}
        onDelete={() => transition(DELETE)}
        onEdit={() => transition(EDIT)}
      />}
      {mode === CREATE && 
      <Form 
        student={props.interviewInfo ? props.interviewInfo.student:null} 
        interviewers={props.interviewers}
        onCancel={() => back()}
        onSave={save}
      />}
      {mode === STATUS &&
      <Status />}
      {mode === DELETE &&
      <Confirm 
        message="Are you sure you want to delete this interview?"
        onConfirm={cancelInterview}
        onCancel={() =>  back()}
        />}
      {mode === EDIT && 
      <Form 
        name={props.interviewInfo ? props.interviewInfo.student:null} 
        interviewer={props.interviewInfo ? props.interviewInfo.interviewer.id:null}
        interviewers={props.interviewers}
        onCancel={() => back()}
        onSave={save}
      />}
      {mode === ERROR_SAVE && 
      <Error onClose={() => transition(SHOW)} message={"Error saving"}/>} 
      {mode === ERROR_DELETE && 
      <Error onClose={() => transition(SHOW)} message={"Error deleting"}/>} 
    </article>
  )
}