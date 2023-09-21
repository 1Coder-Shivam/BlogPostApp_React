import { createAsyncThunk, useDispatch, useSelector } from 'react-redux';
import { selectPostById, updatePost, deletePost } from './postsSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from "react";

// ... (other imports)

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = useSelector((state) => selectPostById(state, postId));

  // Initialize state values with fallback values or empty strings if not available
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.body || '');
  const [category, setCategory] = useState(post?.category || '');
  const [requestStatus, setRequestStatus] = useState('idle');

  const dispatch = useDispatch();

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onCategoryChanged = (e) => setCategory(e.target.value);

  const canSave = [title, content, category].every(Boolean) && requestStatus === 'idle';
  const onSavePostClicked = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    if (canSave) {
      try {
        setRequestStatus('pending');
        const updatedPostData = {
          id: postId,
          title,
          body: content,
          category,
        };
        await dispatch(updatePost(updatedPostData)).unwrap();
  
        setTitle('');
        setContent('');
        setCategory('');
        navigate(`/post/${postId}`);
      } catch (err) {
        console.error('Failed to save the post', err);
      } finally {
        setRequestStatus('idle');
      }
    }
  };

  const onDeletePostClicked = () => {
    try {
      setRequestStatus('pending');
      dispatch(deletePost({ id: postId })).unwrap();

      setTitle('');
      setContent('');
      setCategory('');
      navigate('/');
    } catch (err) {
      console.error('Failed to delete the post', err);
    } finally {
      setRequestStatus('idle');
    }
  };

  return (
    <section>
            <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postCategory">Category:</label>
        <input
          type="text"
          id="postCategory"
          name="postCategory"
          value={category}
          onChange={onCategoryChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
        <button className="deleteButton" type="button" onClick={onDeletePostClicked}>
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default EditPostForm;
