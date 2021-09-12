import React from "react";
import useToggle from "../hooks/useToggle";

const Toggle = (props: any) => (
  <div className="dark-mode-toggle">
    <button type="button" onClick={() => props.setDarkMode(false)}>
      ☀
    </button>
    <span className="toggle-control">
      <input
        className="dmcheck"
        id="dmcheck"
        type="checkbox"
        checked={props.darkMode}
        onChange={() => props.setDarkMode(!props.darkMode)}
      />
      <label htmlFor="dmcheck" />
    </span>
    <button type="button" onClick={() => props.setDarkMode(true)}>
      ☾
    </button>
  </div>
);

export default Toggle;
