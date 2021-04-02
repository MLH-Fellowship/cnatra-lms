import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

function NavGradesheets({ direction, EIB, sheet_code, sheet_id, length }) {
  //EIB = Event in block
  const handleClick = (e) => {
    console.log("clicked: ", e.target.value);
  };

  return (
    <>
      {direction === "prev" ? (
        <Link to={`/Grades/${sheet_id}`} className="nav-sheets-lk">
          <button disabled={EIB && EIB === 1} onClick={handleClick}>
            <div className="nav-sheets">
              <IoIosArrowDropleft />
              <span>{sheet_code || "Prev"}</span>
            </div>
          </button>
        </Link>
      ) : (
        <Link to={`/Grades/${sheet_id}`} className="nav-sheets-lk">
          <button disabled={EIB === length}>
            <div className="nav-sheets">
              <span>{sheet_code || "Next"}</span>
              <IoIosArrowDropright />
            </div>
          </button>
        </Link>
      )}
    </>
  );
}

export default NavGradesheets;
