import React, {useEffect} from "react";
import {connect} from "react-redux";

import {getWeather, tempToggler} from "../../redux/action-creators/action-creators";

import '../weather-ui.scss';

import Conditions from "./conditions";
import CurrentWeather from "./currentWeather";
import ForecastTable from "../forecast/forecastTable";
import UnitsToggle from "../footer/unitToggler";

const Header = props => {
	const {weatherData, weatherResults, toggler} = props;

	const toggleHandler = () => {
		toggler(weatherResults)
	};

	let {condition, unit, time, location, night, wind, atmosphere, astronomy, units, forecasts} = weatherResults;

	let c = Number(condition.code),
		bg = "default";

	if (typeof c !== "undefined") {
		if (night) {
			bg = "night";
		} else {
			// change background based on condition code
			if ((c >= 0 && c <= 4) || c === 23 || c === 24) {
				bg = "wind";
			} else if (c === 32 || c === 34 || c === 36) {
				bg = "sun";
			} else if ((c >= 18 && c <= 22) || (c >= 25 && c <= 30) || c === 44) {
				bg = "cloudy";
			} else if ((c >= 13 && c <= 17) || (c >= 41 && c <= 43) || c === 46) {
				bg = "snow";
			} else if (c === 31) {
				bg = "clear";
			} else {
				bg = "rain";
			}
		}
	}

	useEffect(() => {
		weatherData(weatherResults.query);
	}, [weatherData, weatherResults.query]);

	return (
		<div id="wrapper" className={`localweather localweather--${bg}`}>
			<div className="layout__container">
				<CurrentWeather {...{condition, unit, time, location, night}} />
				<Conditions {...{wind, atmosphere, astronomy, units, night}} />
				<ForecastTable data={forecasts} unit={unit}/>
				<UnitsToggle handleToggle={toggleHandler}/>
			</div>
		</div>
	);
};

const mapDispatchToProps = dispatch => ({
	weatherData: localData => dispatch(getWeather(localData)),
	toggler: weatherData => dispatch(tempToggler(weatherData))
});

const mapStateToProps = state => ({weatherResults: state.weatherResults});

export default connect(mapStateToProps, mapDispatchToProps)(Header);