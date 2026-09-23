import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

function CreateNote() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [archived, setArchived] = useState(false);
  const [loading, setLoading] = useState(false);

  // CHECK LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    if (isEditMode) {
      loadNote();
    }
  }, [id, navigate]);


  // LOAD NOTE FOR EDIT
  const loadNote = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/notes/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
        return;
      }

      setTitle(data.title || "");
      setCategory(data.category || "");

      setTags(
        Array.isArray(data.tags)
          ? data.tags.join(", ")
          : ""
      );

      setContent(data.content || "");
      setPinned(data.pinned || false);
      setArchived(data.archived || false);

    } catch (error) {
      console.log("LOAD ERROR:", error);
      alert("Server is not running");
    }
  };


  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const noteData = {
        title: title,
        category: category,

        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),

        content: content,
        pinned: pinned,
        archived: archived
      };

      let response;

      // UPDATE
      if (isEditMode) {

        response = await fetch(
          `http://localhost:5000/api/notes/${id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(noteData)
          }
        );

      }

      // CREATE
      else {

        response = await fetch(
          "http://localhost:5000/api/notes",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(noteData)
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/");
          return;
        }

        alert(data.message || "Something went wrong");
        return;
      }

      if (isEditMode) {
        alert("Note updated successfully!");
      } else {
        alert("Note created successfully!");
      }

      navigate("/dashboard");

    } catch (error) {

      console.log("FRONTEND ERROR:", error);

      alert("Server is not running");

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="note-form-container">

      <div className="note-form-box">

        <h1>
          {isEditMode
            ? "Edit Note"
            : "Create New Note"}
        </h1>


        <form onSubmit={handleSubmit}>

          {/* TITLE */}

          <label>Title</label>

          <input
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />


          {/* CATEGORY */}

          <label>Category</label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            required
          >

            <option value="">
              Select Category
            </option>

            <option value="DSA">
              DSA
            </option>

            <option value="Java">
              Java
            </option>

            <option value="DBMS">
              DBMS
            </option>

            <option value="IoT">
              IoT
            </option>

            <option value="College">
              College
            </option>

            <option value="Other">
              Other
            </option>

          </select>


          {/* TAGS */}

          <label>Tags</label>

          <input
            type="text"
            placeholder="Example: arrays, java, sorting"
            value={tags}
            onChange={(e) =>
              setTags(e.target.value)
            }
          />


          {/* CONTENT */}

          <label>Content</label>

          <textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            rows="8"
            required
          />


          {/* BUTTONS */}

          <div className="form-buttons">

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Note"
                : "Save Note"}
            </button>


            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateNote;