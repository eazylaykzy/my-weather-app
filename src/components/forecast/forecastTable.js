import React from "react";

import ForecastRow from "./forecastRow";

import '../weather-ui.scss';

const ForecastTable = ({ data, unit }) => (
	<div className="forecast">
		{data.map(v => {
			return <ForecastRow {...v} key={v.date} unit={unit}/>})
		}
	</div>
);

export default ForecastTable;