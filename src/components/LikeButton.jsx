import { useState } from 'react';

export default function LikeButton() {
	const [likes, setLikes] = useState(0);

	function handleClick() {
		setLikes((current) => current + 1);
	}

	return (
		<button type="button" className="like-button" onClick={handleClick}>
			Beğen ({likes})
		</button>
	);
}
