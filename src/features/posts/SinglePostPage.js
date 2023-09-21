import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";

import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";

import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const SinglePostPage = () => {
  // Retrieve postId
  const { postId } = useParams();
  const post = useSelector((state) => selectPostById(state, String(postId)));

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  console.log("Post:", post);

  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p className="postCredit">
        Category: {post.category} {/* Display the category */}
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButtons post={post} />
      <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
    </article>
  );
};

export default SinglePostPage;
