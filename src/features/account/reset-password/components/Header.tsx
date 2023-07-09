import { Link } from "react-router-dom";

export function Header() {
	return (
		<header className="bg-white">
			<section className="container mx-auto px-4 flex justify-between py-2 w-full">
				<div className="flex items-center">
					<Link to="/">
						<img className="object-cover" src="/logo.png" alt="Store Logo" />
					</Link>
				</div>
			</section>
		</header>
	);
}
