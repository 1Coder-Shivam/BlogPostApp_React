import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewPost } from "./postsSlice";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Import uuid

const AddPostForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onCategoryChanged = (e) => setCategory(e.target.value);

  const canSave =
    [title, content, category].every(Boolean) && addRequestStatus === "idle";

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        const newPost = {
          title,
          body: content,
          category,
        };

        await dispatch(addNewPost(newPost));

        setTitle("");
        setContent("");
        setCategory("");
        navigate("/");
      } catch (err) {
        console.error("Failed to save the post", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  return (
    <section>
      <h2>Add a New Post</h2>
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
        <button
          type="button"
          onClick={onSavePostClicked}
          disabled={!canSave}
        >
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
