export function CartNotification() {
	return (
		<div className="alert flex rounded-lg bg-info/10 text-info dark:bg-info/15">
			<div className="w-1.5 text-info" />
			<div className="flex flex-1 items-center space-x-3 p-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<div className="flex-1">
					System will support purchase of one cart item for now. Kindly remove the other items or system will
					consider only the first item displayed in the cart.
				</div>
			</div>
		</div>
	);
}
