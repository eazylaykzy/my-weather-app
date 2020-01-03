import React from "react";

import '../weather-ui.scss';

import Icon from "./icon";
import {conditionCodes} from "./conditionsCodes";

const ForecastRow = ({unit, day, code, high, low, text}) => {
	let units = unit === "c" ? "Celsius" : "Fahrenheit";

	return (
		<div className="forecast__row">
			<div className="forecast__col forecast__col--2">
				<span className="forecast__day">{day}</span>
				<div className="forecast__icon">
					<Icon id={conditionCodes[code]}/>
				</div>
				<div className="forecast__temp forecast__temp--high">
					{high}
					<Icon id={units}/>
				</div>
				<div className="forecast__temp forecast__temp--low">
					{low}
				<Icon id={units}/></div>
			</div>
			<div className="forecast__col">
				<span className="forecast__text">{text}</span>
			</div>
		</div>
	)
};

export default ForecastRow;