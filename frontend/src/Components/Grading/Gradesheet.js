//Event Grade sheet

//External Imports
import React, { useState, useEffect } from "react";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";

//Internal imports
import { EventForm } from "./useEventForm";
import ManeuversForm from "./ManeuversForm";
import NavGradesheets from "./NavGradesheets";
import { mockGradesheetData } from "./mockGradesheetData";
import { getGradesheet } from "../../Store/grades";
import { toggleManeuverMode } from "../../Store/formControl";
import { fetchStudent } from "../../Store/students";

function Gradesheet({ ...props }) {
  //Manage event dropdown state
  const [dropdown, setDropDown] = useState(false);
  const toggleDropDown = () => {
    setDropDown(!dropdown);
  };

  //Manage maneuver dropdown states
  const [expand, setExpansion] = useState(false);
  const expandCollapse = () => setExpansion(!expand);

  //Controls Event Detail edits
  const [edit, setEditMode] = useState(false);
  const toggleEditMode = () => {
    if (!edit) {
      setDropDown(true);
    }
    setEditMode(!edit);
  };

  //Accessing REDUX state & methods
  const dispatch = useDispatch();
  const details = useSelector((state) => state.grades.details);
  const { student } = useSelector((state) => state.students);

  //Controls Maneuver edits
  const maneuverEdit = useSelector((state) => state.formControls.maneuverMode);
  const toggleManeuverEdits = () => dispatch(toggleManeuverMode());

  //FETCH gradesheet data
  useEffect(() => {
    async function getData() {
      await dispatch(getGradesheet(props.match.params.gradesheetId));
    }
    getData();
  }, [dispatch, props.match.params.gradesheetId]);

  //FETCH student data if not already loaded
  useEffect(() => {
    if (!student?.first_name) {
      dispatch(fetchStudent("bb7cefa2936648bdaab12ea89b048bec"));
    }
  }, [dispatch, student]);

  // MANAGE FORM DATA
  const [values, setValues] = useState({
    date: details?.grade_sheet.date,
    grade: details?.grade_sheet?.grade,
    status: details?.grade_sheet.status,
    comments: details?.grade_sheet.comments,
    // clearedForSolo: mockGradesheetData.clearedForSolo,
    instructor_first_name: details?.grade_sheet.instructor.first_name,
    instructor_last_name: details?.grade_sheet.instructor.last_name,
    hours: details?.grade_sheet.event.hours,
    media_type: details?.grade_sheet.event.media_type.media_type,
  });

  useEffect(() => {
    setValues({
      date: details?.grade_sheet?.date,
      grade: details?.grade_sheet?.grade,
      status: details?.grade_sheet.status,
      comments: details?.grade_sheet.comments,
      // clearedForSolo: mockGradesheetData.clearedForSolo,
      instructor_first_name: details?.grade_sheet.instructor.first_name,
      instructor_last_name: details?.grade_sheet.instructor.last_name,
      hours: details?.grade_sheet.event.hours,
      media_type: details?.grade_sheet.event.media_type.media_type,
    });
    console.log("Updated!");
  }, [details]);

  // Displays LOADING page if props from redux haven't been received yet
  if (!details?.grade_sheet.grade) {
    return <div className="Gradesheet container">Loading...</div>;
  }

  const EIB = details?.grade_sheet.event.event_in_block;
  const total_EIB = student?.grade_sheets.length;

  return (
    <>
      <div className="Gradesheet-wrap d-flex flex-column container-fluid">
        <div className="grade-nav-container container d-flex justify-content-between">
          <NavGradesheets
            direction={"prev"}
            EIB={EIB}
            sheet_id={
              EIB > 1 ? student?.grade_sheets[EIB - 2]?.grade_sheet_id : ""
            }
            sheet_code={
              EIB > 1 ? student?.grade_sheets[EIB - 2].event.event_code : ""
            }
            length={total_EIB}
          />
          <NavGradesheets
            direction={"next"}
            EIB={details?.grade_sheet.event.event_in_block}
            sheet_id={
              EIB < total_EIB ? student?.grade_sheets[EIB]?.grade_sheet_id : ""
            }
            sheet_code={
              EIB < total_EIB ? student?.grade_sheets[EIB].event.event_code : ""
            }
            length={total_EIB}
          />
        </div>
        <div className="Gradesheet container my-4">
          <h2
            className="student-name"
            title="Student Name"
          >{`${mockGradesheetData.student.rank} ${details.grade_sheet.student.last_name}, ${details.grade_sheet.student.first_name}`}</h2>
          <div className="d-flex justify-content-between flex-column flex-md-row">
            <h4 className="event-identifier" title="Event Identifier and title">
              {`[${details.grade_sheet.event.event_code}][${details.grade_sheet.event.event_in_block}] - ${details.grade_sheet.event.title}` ||
                "[Event ID] - [Event Name]"}
            </h4>
            <div className="edit-controls align-self-center align-self-md-end">
              <div className="btn-group">
                {edit ? (
                  <button
                    type="submit"
                    form="event-details-form"
                    title="Save event details"
                  >
                    Save
                  </button>
                ) : (
                  ""
                )}
                <button
                  type="button"
                  onClick={toggleEditMode}
                  title={
                    edit === true ? "Cancel changes" : "Edit event details"
                  }
                >
                  {edit === true ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>
          </div>
          <div className="gradesheet-submission">
            <div title="Date submitted">
              {new Date(details?.grade_sheet.date).toLocaleDateString("en-US", {
                month: "long",
                day: "2-digit",
                year: "numeric",
                timeZone: "UTC",
              })}
            </div>
            <div title="Gradesheet submitter">
              <strong>Submitted by: </strong>
              {`${mockGradesheetData.instructor.rank} ${details.grade_sheet.instructor.last_name}, ${details.grade_sheet.instructor.first_name}`}
            </div>
          </div>
          <div className="gradesheet-details container-fluid">
            <div
              className={
                details.grade_sheet.status === "CMP" &&
                details.grade_sheet.grade === "PASS"
                  ? "details-header positive-status"
                  : "details-header pending-status"
              }
              title="Event Status | Grade"
            >
              <div>
                {details.grade_sheet.status === "CMP"
                  ? "Complete"
                  : "Incomplete"}{" "}
                |{" "}
                {details.grade_sheet.grade === "PASS"
                  ? "Pass"
                  : "Unsatisfactory"}
              </div>
              <div className="col-1 event-dropdown">
                <button
                  title="Toggle Event Details"
                  type="button"
                  className="toggle-dropdown btn"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseEvent"
                  aria-expanded="false"
                  aria-controls="collapse"
                  onClick={toggleDropDown}
                >
                  {dropdown ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
                </button>
              </div>
            </div>
            <div
              className={
                dropdown
                  ? "details-body collapse show"
                  : "details-body collapse"
              }
              id="collapseEvent"
              aria-expanded="false"
              aria-controls="collapse"
            >
              {/* EVENT DETAILS FORM */}
              {details?.grade_sheet?.grade ? (
                <EventForm
                  edit={edit}
                  values={values}
                  gradesheetId={props.match.params.gradesheetId}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-between flex-column flex-md-row">
            <h4 className="event-identifier">Maneuvers</h4>
            <div className="edit-controls align-self-center align-self-md-end">
              <div className="btn-group">
                <button
                  type="button"
                  onClick={expandCollapse}
                  title={
                    expand ? "Collapse all maneuvers" : "Expand all maneuvers"
                  }
                >
                  {expand ? "Collapse" : "Expand"}
                </button>
                {maneuverEdit ? (
                  <button
                    type="submit"
                    form="maneuvers-form"
                    title="Save event details"
                  >
                    Save
                  </button>
                ) : (
                  ""
                )}
                <button
                  type="button"
                  onClick={toggleManeuverEdits}
                  title={
                    maneuverEdit === true ? "Cancel changes" : "Edit Maneuvers "
                  }
                >
                  {maneuverEdit === true ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>
          </div>
          <ManeuversForm
            edit={maneuverEdit}
            gradesheetId={props.match.params.gradesheetId}
            expand={expand}
          />
        </div>
      </div>
    </>
  );
}

export default Gradesheet;
