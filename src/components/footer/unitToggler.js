import React from "react";

import Icon from "../forecast/icon";

import '../weather-ui.scss';

const UnitsToggle = ({handleToggle}) => (
	<div className="localweather__form">
		<div className="localweather__toggle toggle">
			<input onClick={handleToggle} type="checkbox" className="toggle__input" id="toggle"/>
			<label className="toggle__label" htmlFor="toggle">
				<span className="toggle__text"><Icon id="Fahrenheit"/></span>
				<span className="toggle__switch"><span className="toggle__handle"/></span>
				<span className="toggle__text"><Icon id="Celsius"/></span>
			</label>
		</div>
	</div>
);

export default UnitsToggle;