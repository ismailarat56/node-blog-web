import { Link } from "react-router";

export default function Header() {
	return (
		<header className="header">
			<div className="header__inner">
				<Link to="/" className="header__brand">
					Node Blog
				</Link>
				<span className="header__tagline">Node.js, MySQL ve React notları</span>
			</div>
		</header>
	);
}
