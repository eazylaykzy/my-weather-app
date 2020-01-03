import React from "react";

import Icon from "../forecast/icon";

const Conditions = ({wind, units, atmosphere, night, astronomy}) => (
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

export default Conditions;