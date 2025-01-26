import axios from "axios";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import env from "react-dotenv";

const Feed = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [feeds, setFeeds] = useState([]);

  const fetchFeeds = async () => {
    const token = localStorage.getItem("authToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      const response = await axios.get(
        `${env.BASE_URL}/api/feed`,
        config
      );
      setFeeds(response.data);
    } catch (err) {
      console.error("Error fetching feeds:", err);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const handleCreatePost = async (caption, photo) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("Authorization token not found");
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("photo", photo);

      const response = await axios.post(
        `${env.BASE_URL}/api/feed/create`,
        formData,
        config
      );
      if (response.status === 201) {
        setIsCreateDialogOpen(false); // Close the modal
        fetchFeeds(); // Optionally, refetch feeds to display the new post
      } else {
        console.error("Error creating post:", response.statusText);
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="feed-container" style={{ marginTop: "50px" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin:'10px 0 10px 0',
          }}
        >
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="new-post-button"
          >
            New Post
          </button>
        </div>

        <div className="feed-grid">
          {feeds.map((feed, i) => (
            <div key={i} className="feed-card">
              <div className="feed-content">
                <p className="feed-caption">Caption: {feed.caption}</p>
                <img src={feed.photoUrl} alt="post" className="feed-photo" />
              </div>
            </div>
          ))}
        </div>
        {isCreateDialogOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Create Post</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const caption = e.target.caption.value;
                  const photo = e.target.photo.files[0];
                  handleCreatePost(caption, photo);
                }}
              >
                <div className="form-group">
                  <label htmlFor="caption">Caption:</label>
                  <input type="text" id="caption" name="caption" required />
                </div>
                <div className="form-group">
                  <label htmlFor="photo">Photo:</label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="submit-button">
                    Post
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Feed;
