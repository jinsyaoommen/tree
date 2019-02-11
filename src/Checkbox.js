/* eslint-disable quotes */
import PropTypes from "prop-types";
import React, { Component } from "react";
import styled, { css } from "styled-components";
import * as R from "ramda";

import { colors } from "./Theme";

const checkboxSize = {
    small: "15px",
    medium: "20px",
};

const CheckboxGroupStyle = styled.span`
  position: relative;
  line-height: 1;
`;

const CheckboxStyle = styled.input`
  z-index: 1;
  opacity: 0;
  position: absolute;
  margin: 0 0 0 ${props => (props.caption ? "0" : "-40px")} !important;
  height: ${props => checkboxSize[props.size]};
  width: ${props => checkboxSize[props.size]};
  cursor: pointer;
`;

const labelAfterMixin = css`
  &:after {
    position: absolute;
    top: ${props => (props.caption ? "3px" : "0px")};
    left: 0;
    width: 20px;
    height: 20px;
    margin: 0;
    font-size: 13px;
    color: ${props => (props.disabled ? colors.whiteSmoke.medium : colors.white.light)};
    text-align: center;
    //font-family: ionicons;
    content: ${props => (props.checked ? `'\\2713'` : `'\f208'`)};
  }
`;

const CheckboxLabelStyle = styled.label`
  position: relative;
  display: inline;
  padding-left: ${props => (props.caption ? "20px" : "0px")};
  vertical-align: middle;
  margin-bottom: 0;
  font-weight: 700;
  cursor: pointer;
  font-size: 16px;
  color: ${colors.riverbed.light};
  &:after,
  &:before {
    box-sizing: border-box;
  }
  &:before {
    position: relative;
    left: 0;
    display: inline-block;
    height: ${props => checkboxSize[props.size]};
    width: ${props => checkboxSize[props.size]};
    margin-left: ${props => (props.caption ? "-20px" : "0")};
    margin-right: ${props => (props.caption ? "10px" : "0px")};
    content: "";
    background-color: ${props =>
    (props.disabled && colors.whiteSmoke.light) ||
    ((props.checked || props.indeterminate) && colors.cascadeBlue.light) ||
    colors.white.light};
    border: 2px solid
      ${props =>
    (props.disabled && props.checked && colors.whiteSmoke.light) ||
    (props.disabled && !props.checked && colors.whiteSmoke.medium) ||
    ((props.checked || props.indeterminate) && colors.cascadeBlue.light) ||
    colors.osloGray.light};
    border-radius: 2px;
    transition: border 0.15s ease-in-out, color 0.15s ease-in-out;
    top: ${props => (props.caption ? "3px" : "0px")};
  }
  ${props => (props.checked || props.indeterminate) && labelAfterMixin}
`;

class Checkbox extends Component {
    componentDidMount() {
        const { isIndeterminate } = this.props;
        this.checkboxElement.indeterminate = isIndeterminate;
    }

    componentDidUpdate() {
        const { isIndeterminate } = this.props;
        this.checkboxElement.indeterminate = isIndeterminate;
    }

    /**
     * Note that the onChange function, if provided, will be called with the following arguments:
     * - The event proxy
     * - An object representing the state of the checkbox, with the following shape:
     *   - id: the ID provided for the element
     *   - isChecked: true if the checkbox is checked
     *   - isIndeterminate: true if the checkbox is indeterminate
     *   - value: the value provided for the element
     *
     * @param e {object} The event proxy object
     */
    callOnChange(e) {
        const { id, onChange, value } = this.props;
        if (!onChange) return;

        onChange(
            {
                id,
                isChecked: e.target.checked,
                isIndeterminate: e.target.indeterminate,
                value,
            },
            e
        );
    }

    /**
     * The use of `ref` here is not ideal, but there aren't any particularly good ways to support
     * indeterminate checkboxes, as far as I could tell from some research. The approach here
     * is to keep track of the checkbox element itself, and explicitly set the `indeterminate`
     * property on the element based on the value of the component's props.
     *
     * @returns {XML}
     */
    render() {
        const { caption, id, isChecked, isDisabled, isIndeterminate, name, size, value } = this.props;
        const labelProps = R.omit(["id"], this.props);

        return (
            <CheckboxGroupStyle>
                <CheckboxStyle
                    checked={isChecked}
                    disabled={isDisabled}
                    id={id}
                    name={name}
                    onChange={e => this.callOnChange(e)}
                    ref={element => {
                        this.checkboxElement = element;
                    }}
                    value={value}
                    size={size}
                    caption={caption}
                    type="checkbox"
                />
                <CheckboxLabelStyle
                    htmlFor={id}
                    checked={isChecked}
                    indeterminate={isIndeterminate}
                    disabled={isDisabled}
                    {...labelProps}
                >
                    {caption}
                </CheckboxLabelStyle>
            </CheckboxGroupStyle>
        );
    }
}

Checkbox.propTypes = {
    /** Description that aligns to the right of the checkbox input */
    caption: PropTypes.string,
    /** Passed in with larger data sets, like trees that use multiple checkboxes */
    id: PropTypes.string,
    /** Sets the HTML input 'checked' attribute */
    isChecked: PropTypes.bool,
    /** If set to true, user cannot change checkbox but can see the underlying checkbox value */
    isDisabled: PropTypes.bool,
    /** Used with larger data sets that have children - if some children are checked,
     * the parent checkbox shows a '-' to indicate some, but not all, children are checked */
    isIndeterminate: PropTypes.bool,
    /** Sets the HTML input 'name' attribute */
    name: PropTypes.string,
    /** Function to call on checkbox click */
    onChange: PropTypes.func,
    /** Sets the HTML input 'value' attribute */
    value: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium"]),
};

Checkbox.defaultProps = {
    caption: "",
    id: undefined,
    isChecked: null,
    isDisabled: false,
    isIndeterminate: false,
    name: undefined,
    onChange: undefined,
    value: "on",
    size: "medium",
};

export default Checkbox;
