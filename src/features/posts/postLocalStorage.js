export const loadPostsFromLocalStorage = () => {
    try {
      const posts = JSON.parse(localStorage.getItem("posts"));
      if (posts) {
        return posts;
      }
    } catch (error) {
      console.error("Error loading posts from localStorage:", error);
    }
    return [];
  };
  
  export const savePostsToLocalStorage = (posts) => {
    try {
      localStorage.setItem("posts", JSON.stringify(posts));
    } catch (error) {
      console.error("Error saving posts to localStorage:", error);
    }
  };
  