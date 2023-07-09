import React from "react";
import { getLoggedUser } from "~/helpers/auth";

export interface IInterface {
	price?: string | number;
	inr?: string;
	usd?: string;
	currenctType?: any;
}

export const Price = React.memo((props: IInterface) => {
	const { currenctType, price = 0, inr = 0, usd = 0 } = props;
	return (
		<p className="font-medium text-primary space-x-0.5">
			<sup className="text-xs+">{currenctType === "INR" ? "\u20B9" : "\u0024"}</sup>
			{!price && <span className="text-xl">{currenctType ? usd : inr}</span>}
			{!!price && <span className="text-xl">{price}</span>}
		</p>
	);
});
