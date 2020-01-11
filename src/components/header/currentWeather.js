import React from "react";
import {DebounceInput} from 'react-debounce-input';

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
				<h1 className="localweather__text">
					{location.region !== undefined ? `${location.region}, ${location.country}` : ''}
				</h1>
				<h2 className="localweather__text">{text}</h2>
				<label htmlFor="localweather__city"/>
				<DebounceInput
					minLength={2}
					debounceTimeout={500}
					autoComplete='off'
					onChange={e => queryData({query: {'location': e.target.value, format: 'json'}})}
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