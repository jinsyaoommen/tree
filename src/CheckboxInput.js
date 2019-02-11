import React from "react";

const CheckboxInput = (props) => {
    return (
        <input
            name="isGoing"
            type="checkbox"
            checked={props.isChecked}
            onChange={props.onChange}
        />
    );
};

export default CheckboxInput;
