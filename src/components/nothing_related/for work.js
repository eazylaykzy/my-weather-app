const { Component } = React;
// https://developer.yahoo.com/weather/documentation.html
const getInitialLocation = new Promise(function(resolve, reject) {
	// Try W3C Geolocation (Preferred)
	if (navigator.geolocation && window.location.protocol === "https:") {
		navigator.geolocation.getCurrentPosition(pos => {
				resolve(`(${pos.coords.latitude},${pos.coords.longitude})`);
			}, err =>
				resolve(getLocationByIp())
		);
	}
	// Browser doesn't support Geolocation
	else {
		resolve(getLocationByIp());
	}
});

const getLocationByIp = () => {
	return fetch("https://freegeoip.net/json/")
		.then(response => response.json())
		.then(data => `(${data.latitude},${data.longitude})`)
		.catch(err => console.error(err));
};
// understood till this point, above code is trying to get the users location if supported by browser if not get it by IP

// digits trims out any characters that's not a number to zero(0), if it contains a number(s) it returns that number(s) alone
const digits = (str) => Number(str.replace(/\D/g, ''));

const padMinutes = function(str) {
	const time = str.replace(/[^:0-9]/g, ''),
		minutes = time.substring(time.lastIndexOf(':'));
	if (minutes.length === 2) {
		str = time + 0 + ' ' + str.replace(/[^A-Za-z]/g, '');
	}
	return str;
};

const Icon = ({ id }) => (
	<svg className={"icon wi-" + id }>
		<use xlinkHref={ '#wi-' + id }/>
	</svg>
);

// weather App
const ForecastRow = ({
	                     unit,
	                     day,
	                     code,
	                     high,
	                     low, text
                     }) => {
	let units = unit === "c"
		? "Celsius"
		: "Fahrenheit";
	return (
		<div className="forecast__row">
			<div className="forecast__col forecast__col--2">
				<span className="forecast__day">{day}</span>
				<div className="forecast__icon">
					<Icon id={conditionCodes[code]} />
				</div>
				<div className="forecast__temp forecast__temp--high">{high}
					<Icon id={units} />
				</div>
				<div className="forecast__temp forecast__temp--low">{low}<Icon id={units} /></div>
			</div>
			<div className="forecast__col">
				<span className="forecast__text">{text}</span>
			</div>
		</div>
	)};

const ForecastTable = ({ data, unit }) => (
	<div className="forecast">
		{data.map(v =>
			<ForecastRow {...v} key={v.date} unit={unit} />)
		}
	</div>
);

class UnitsToggle extends Component {
	handleToggle = (e) => {
		this.props.onUnitChange({
			unit: e.target.checked ? "f" : "c"
		});
	};

	render() {
		return (
			<div className="localweather__form">
				<div className="localweather__toggle toggle">
					<input type="checkbox" className="toggle__input" id="toggle" defaultValue={1} onChange={this.handleToggle} />
					<label className="toggle__label" htmlFor="toggle">
						<span className="toggle__text"><Icon id="Celsius" /></span>
						<span className="toggle__switch"><span className="toggle__handle" /></span>
						<span className="toggle__text"><Icon id="Fahrenheit" /></span>
					</label>
				</div>
			</div>
		);
	}
}

const Conditions = ({
	                    wind,
	                    units,
	                    atmosphere,
	                    night,
	                    astronomy
                    }) => (
	<div className="layout__row localweather__top">
		<div className="localweather__conditions">
			<div className="condition condition--wind">
				<div className="condition__icon condition__icon--small">
					<div className="condition__wind-direction"
					     style={{transform: `rotate( ${Number(wind.direction) + 135}deg)`}}
					     title={`direction: ${wind.direction}deg`}>
						<Icon id={"compass"} />
					</div>
				</div>
				<div className="condition__value">
					<span>{wind.speed} {units.speed}</span>
					<span className="condition__label">wind</span>
				</div>
			</div>
			<div className="condition condition--humidity">
				<div className="condition__icon">
					<Icon id={"raindrop2"} />
				</div>
				<div className="condition__value">
					<span>{atmosphere.humidity} %</span>
					<span className="condition__label">humidity</span>
				</div>
			</div>
			<div className="condition condition--sunrise">
				<div className="condition__icon">
					<Icon id={"sunrise"} />
				</div>
				<div className="condition__value">
					<span className="condition__sunrise">{ night ? astronomy.sunrise : astronomy.sunset }</span>
					<span className="condition__label">{ night ? "sunrise" : "sunset" }</span>
				</div>
			</div>
		</div>
	</div>
);

class CurrentWeather extends Component {
	select = (e) => {
		e.target.select();
	};

	render() {
		let { code, temp, text } = this.props.condition;
		let { unit, time, location, night } = this.props;
		if (night && code === "32") {
			code = "31";
		}
		return (
			<div className="layout__row layout__row--alt localweather__top">
				<div className="localweather__icon"><Icon id={conditionCodes[code]} /></div>
				<div className="localweather__item">
					<div className="localweather__temp">{temp}
						<Icon id={unit === "c" ? "Celsius" : "Fahrenheit"} /></div>
				</div>
				<div className="localweather__heading">
					<h1 className="localweather__text">{text}</h1>
					<input
						className="localweather__city"
						id="localweather__city"
						type="text"
						onFocus={this.select}
						placeholder={location.city}
					/>, {time}
				</div>
			</div>
		);
	}
}

class LocalWeather extends Component {
	constructor(...args) {
		super(...args);
		this.state = {
			local: "(51.5074, 0.1278)",
			unit: "c",
			time: "",
			night: "",
			units: {},
			astronomy: {},
			atmosphere: {},
			condition: {},
			forecast: [],
			location: {},
			wind: {}
		};
	}

	getWeather = (local = this.state.local, unit = this.state.unit) => {
		const url = `https://query.yahooapis.com/v1/public/yql?format=json&q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='${local}') and u='${unit}'`;

		fetch(url).then(response => response.json())
			.then(data => {
				if (data.query.results !== null) {
					data = data.query.results.channel;

					var time = data.lastBuildDate.slice(17, 25),
						ampm = time.replace(/[^A-Za-z]/g, '').toLowerCase(),
						sunrise = padMinutes(data.astronomy.sunrise),
						sunset = padMinutes(data.astronomy.sunset),
						night = false;

					if (digits(time) >= 1200) {
						ampm = ampm === "pm" ? 'am' : 'pm';
					}
					if (ampm === "pm") {
						night = digits(time) > digits(sunset);
					} else {
						night = digits(time) < digits(sunrise);
					}

					data.wind.speed = Math.round(data.wind.speed);

					this.setState({
						astronomy: {
							"sunrise": sunrise,
							"sunset": sunset
						},
						atmosphere: data.atmosphere,
						condition: data.item.condition,
						forecast: data.item.forecast.slice(0, 5),
						location: data.location,
						wind: data.wind,
						units: data.units,
						time: time,
						night: night,
						unit: unit
					});
				}
			});
	};

	handleUnitChange = (unit) => {
		this.getWeather(this.state.local, unit.unit);
	};

	componentDidMount() {
		getInitialLocation.then(local => {
			console.log(local);
			this.setState({
				local
			});
			this.getWeather(local);
		});

		setInterval(this.getWeather, 300000);

		if (google) {
			const input = document.getElementById("localweather__city");
			const autocomplete = new google.maps.places.Autocomplete(input, {
				types: ['(cities)']
			});
			autocomplete.addListener('place_changed', () => {
				let place = autocomplete.getPlace();
				console.log(place)
				// Is this a new place?
				if (place.name !== this.state.location.city) {
					// Try Lat/Lon (Preferred)
					place = place.geometry.location
						? place.geometry.location.toString()
						: place.name;
					this.setState({
						local: place
					});
					this.getWeather(place);
				}
			});
		}
	};

	render() {
		let { condition, unit, time, location, night, wind, atmosphere, astronomy, units, forecast } = this.state;

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

		return (
			<div id="wrapper" className={`localweather localweather--${bg}`}>
				<div className="layout__container">
					<CurrentWeather {...{ condition, unit, time, location, night }} />
					<Conditions {...{ wind, atmosphere, astronomy, units, night}} />
					<ForecastTable data={forecast} unit={unit} />
					<UnitsToggle onUnitChange={this.handleUnitChange} />
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<LocalWeather />,
	document.getElementById('root')
);