import React, { useState, useEffect } from "react";

import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";

function Maneuver({ maneuver, editable, register, idx, expand }) {
  const [dropdown, setDropDown] = useState(false);
  const toggleDropDown = () => {
    setDropDown(!dropdown);
  };

  useEffect(() => {
    setDropDown(expand);
  }, [expand]);

  const gradeValues = {
    1: "N - Not graded",
    2: "U - Unsafe",
    3: "F - Fair",
    4: "G - Good",
    5: "E - Excellent",
  };

  return (
    <div
      className={
        maneuver.grade >= maneuver.maneuver_item_file.grade
          ? "maneuver container-fluid pass-MIF"
          : "maneuver container-fluid below-MIF"
      }
    >
      <div className="maneuver-header row">
        <div className="col-10">
          <div className="row">
            <div className="col-sm-12 col-md-8" title="Maneuver Description">
              {maneuver.maneuver_item_file.maneuver.maneuver || "Maneuver Name"}
            </div>
            {editable ? (
              <div className="col-6 col-md-2">
                <input
                  name={`[${idx}].grade`}
                  className="maneuver-grade"
                  type="number"
                  step={1}
                  min={1}
                  max={5}
                  placeholder="grade"
                  inputMode="decimal"
                  defaultValue={maneuver?.grade}
                  ref={register({ min: 1, max: 5, required: true })}
                ></input>
              </div>
            ) : (
              <div
                className="col-6 col-md-2"
                title={gradeValues[maneuver.grade]}
              >
                {`Grade: ${maneuver.grade}` || "--"}
              </div>
            )}
            <div className="col-6 col-md-2" title="Maneuver Item File">
              {`MIF: ${maneuver.maneuver_item_file.grade}` || "MIF"}
              {maneuver.maneuver_item_file.is_required ? "+" : ""}
            </div>
          </div>
        </div>
        <div className="col-1">
          <button
            type="button"
            className="toggle-dropdown btn"
            data-bs-toggle="collapse"
            data-bs-target="#collapseExample"
            aria-expanded="false"
            aria-controls="collapseExample"
            onClick={toggleDropDown}
          >
            {dropdown ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
          </button>
        </div>
      </div>
      <div
        className={
          dropdown ? "maneuver-body collapse show" : "maneuver-body collapse"
        }
        id="collapseExample"
        aria-expanded="false"
        aria-controls="collapseExample"
      >
        {editable ? (
          <textarea
            name={`[${idx}].comments`}
            defaultValue={maneuver?.comments}
            placeholder="Maneuver comments"
            rows="4"
            ref={register}
          ></textarea>
        ) : (
          <div title="Maneuver comments">
            {maneuver.comments || "No comments"}
          </div>
        )}
      </div>
    </div>
  );
}

export default Maneuver;
