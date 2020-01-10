import React from "react";

import Icon from "../forecast/icon";
import {conditionCodes} from "../forecast/conditionsCodes";
import {inputQuery} from "../../redux/action-creators/action-creators";
import {connect} from "react-redux";

const CurrentWeather = props => {
	const select = (e) => {
		e.target.select();
	};

	let {code, temperature, text} = props.condition;
	let {unit, time, location, night, queryData} = props;
	if (night && code === "32") code = "31";
	const inputHandler = e => {
		e.preventDefault();
		queryData({query: {'location': e.target.value, format: 'json', u: "c"}});
	};
	return (
		<div className="layout__row layout__row--alt localweather__top">
			<div className="localweather__icon">
				<Icon id={conditionCodes[code]}/>
			</div>
			<div className="localweather__item">
				<div className="localweather__temp">
					{temperature}
					<Icon id={unit === "f" ? "Fahrenheit" : "Celsius"}/>
				</div>
			</div>
			<div className="localweather__heading">
				<h1 className="localweather__text">{text}</h1>
				<input
					autoComplete='off'
					onKeyUp={inputHandler}
					className="localweather__city"
					id="localweather__city"
					type="text"
					onFocus={select}
					placeholder={location.city}
				/>, {time}
			</div>

		</div>
	);
};

const mapDispatchToProps = dispatch => ({queryData: query => dispatch(inputQuery(query))});

export default connect(null, mapDispatchToProps)(CurrentWeather);