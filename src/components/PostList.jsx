import PostCard from "./PostCard.jsx";
import StatusMessage from "./StatusMessage.jsx";

export default function PostList({ posts }) {
  if (posts.length === 0) {
    return (
      <StatusMessage>
        Bu listede henüz yazı yok.
      </StatusMessage>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
