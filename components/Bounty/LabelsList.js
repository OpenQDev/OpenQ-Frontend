// Third Party
import React from "react";

// Custom

const LabelsList = (props) => {
  const { bounty } = props;

  return (
    <div className="flex flex-row pt-3 space-x-2">
      <div className="space-x-2">
        {bounty.labels.map((label, index) => {
          return (
            <button
              key={index}
              className="rounded-lg text-xs py-1 px-2 font-bold border border-purple-500 text-white"
            >
              {label.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LabelsList;
