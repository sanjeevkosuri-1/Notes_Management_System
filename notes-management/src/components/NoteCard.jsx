import { useNavigate } from "react-router-dom";

function NoteCard({ note, onDelete, onPin, onArchive }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-note/${note._id}`);
  };

  return (
    <div className="note-card">

      <div className="note-card-header">

        <h3>{note.title}</h3>

        <button
          className="pin-btn"
          onClick={() => onPin(note._id)}
        >
          {note.pinned ? "📌" : "📍"}
        </button>

      </div>


      <p className="note-category">
        {note.category}
      </p>


      <p className="note-content">
        {note.content}
      </p>


      <div className="note-tags">

        {note.tags &&
          note.tags.map((tag, index) => (
            <span key={index}>
              #{tag}
            </span>
          ))}

      </div>


      <div className="note-actions">

        <button onClick={handleEdit}>
          Edit
        </button>

        <button
          onClick={() => onArchive(note._id)}
        >
          {note.archived
            ? "Unarchive"
            : "Archive"}
        </button>

        <button
          onClick={() => onDelete(note._id)}
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default NoteCard;