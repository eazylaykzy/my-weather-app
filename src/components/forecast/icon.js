import React from "react";

import {IconSVG} from "./icon-svg";
import '../weather-ui.scss';

const Icon = ({id}) => (
	<>
		<IconSVG/>
		<svg className={"icon wi-" + id}>
			<use xlinkHref={'#wi-' + id}/>
		</svg>
	</>
);

export default Icon;