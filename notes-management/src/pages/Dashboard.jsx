import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";

function Dashboard() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // CHECK LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetchNotes();
  }, [navigate]);


  // GET NOTES
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/notes",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
        return;
      }

      setNotes(data);

    } catch (error) {
      console.log("FETCH ERROR:", error);
      alert("Server is not running");

    } finally {
      setLoading(false);
    }
  };


  // DELETE NOTE
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/notes/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setNotes(
        notes.filter(
          (note) => note._id !== id
        )
      );

      alert("Note deleted successfully!");

    } catch (error) {
      alert("Server is not running");
    }
  };


  // PIN / UNPIN NOTE
  const handlePin = async (id) => {
    const note = notes.find(
      (note) => note._id === id
    );

    if (!note) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/notes/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: note.title,
            category: note.category,
            tags: note.tags,
            content: note.content,

            pinned: !note.pinned,

            archived: note.archived,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setNotes(
        notes.map((note) =>
          note._id === id
            ? data.note
            : note
        )
      );

    } catch (error) {
      alert("Server is not running");
    }
  };


  // ARCHIVE / UNARCHIVE NOTE
  const handleArchive = async (id) => {
    const note = notes.find(
      (note) => note._id === id
    );

    if (!note) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/notes/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: note.title,
            category: note.category,
            tags: note.tags,
            content: note.content,

            pinned: note.pinned,

            archived: !note.archived,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setNotes(
        notes.map((note) =>
          note._id === id
            ? data.note
            : note
        )
      );

    } catch (error) {
      alert("Server is not running");
    }
  };


  // ACTIVE NOTES
  const activeNotes = notes.filter(
    (note) => !note.archived
  );


  // ARCHIVED NOTES
  const archivedNotes = notes.filter(
    (note) => note.archived
  );


  // SEARCH ACTIVE NOTES
  const filteredNotes = activeNotes.filter(
    (note) =>
      note.title
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  // SEARCH ARCHIVED NOTES
  const filteredArchivedNotes =
    archivedNotes.filter(
      (note) =>
        note.title
          .toLowerCase()
          .includes(search.toLowerCase())
    );


  // COUNTS
  const pinnedCount = notes.filter(
    (note) => note.pinned
  ).length;


  const archivedCount = notes.filter(
    (note) => note.archived
  ).length;


  return (
    <>
      <Navbar />

      <div className="dashboard">

        <h1>
          Welcome to Notes Management
        </h1>


        {/* STATISTICS */}

        <div className="dashboard-stats">

          <div className="stat-box">
            <h3>
              Total Notes
            </h3>

            <p>
              {notes.length}
            </p>
          </div>


          <div className="stat-box">
            <h3>
              Pinned Notes
            </h3>

            <p>
              {pinnedCount}
            </p>
          </div>


          <div className="stat-box">
            <h3>
              Archived
            </h3>

            <p>
              {archivedCount}
            </p>
          </div>

        </div>


        {/* CREATE BUTTON */}

        <button
          className="create-btn"
          onClick={() =>
            navigate("/create-note")
          }
        >
          + Create New Note
        </button>


        {/* SEARCH */}

        <div className="notes-header">

          <h2>
            Your Notes
          </h2>

          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {/* ACTIVE NOTES */}

        <div className="notes-grid">

          {loading ? (

            <p>
              Loading notes...
            </p>

          ) : filteredNotes.length === 0 ? (

            <p>
              No active notes found.
            </p>

          ) : (

            filteredNotes.map((note) => (

              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleDelete}
                onPin={handlePin}
                onArchive={handleArchive}
              />

            ))

          )}

        </div>


        {/* ARCHIVED NOTES */}

        {archivedNotes.length > 0 && (

          <>

            <h2 className="archived-heading">
              Archived Notes
            </h2>


            <div className="notes-grid">

              {filteredArchivedNotes.length === 0 ? (

                <p>
                  No archived notes found.
                </p>

              ) : (

                filteredArchivedNotes.map(
                  (note) => (

                    <NoteCard
                      key={note._id}
                      note={note}
                      onDelete={handleDelete}
                      onPin={handlePin}
                      onArchive={handleArchive}
                    />

                  )
                )

              )}

            </div>

          </>

        )}

      </div>
    </>
  );
}

export default Dashboard;