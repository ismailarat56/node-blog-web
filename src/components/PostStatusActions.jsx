import { useState } from 'react';
import { Link } from 'react-router';
import useAuth from '../auth/useAuth.js';
import { formatDate } from '../utils/format-date.js';
import { STATUS_LABELS } from '../utils/post-status.js';
import StatusMessage from './StatusMessage.jsx';

export default function PostStatusActions({ post, onChange }) {
	const auth = useAuth();

	const [changing, setChanging] = useState(false);
	const [error, setError] = useState(null);

	const isPublished = post.status === 'published';

	async function handleClick() {
		const action = isPublished ? 'unpublish' : 'publish';

		setChanging(true);
		setError(null);

		try {
			await auth.authRequest(`/api/v1/posts/${post.id}/${action}`, { method: 'PATCH' });
		} catch (statusError) {
			setError(statusError);
		} finally {
			setChanging(false);
			onChange();
		}
	}

	return (
		<section className="editor__section">
			<h2>Durum</h2>

			<p>
				<span className={`badge badge--${post.status}`}>{STATUS_LABELS[post.status]}</span>
				{post.published_at && ` İlk yayın: ${formatDate(post.published_at)}`}
			</p>

			{error && <StatusMessage type="error">{error.message}</StatusMessage>}

			<div className="form__actions">
				<button type="button" className="button" disabled={changing} onClick={handleClick}>
					{isPublished ? 'Yayından kaldır' : 'Yayınla'}
				</button>

				{isPublished && <Link to={`/posts/${post.slug}`}>Yayındaki hâlini gör</Link>}
			</div>
		</section>
	);
}
