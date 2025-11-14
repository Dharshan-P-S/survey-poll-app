import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPoll() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();
  const uid = localStorage.getItem("uid");

  useEffect(() => {
    const load = async () => {
      const d = await getDoc(doc(db, "polls", id));
      if (!d.exists()) return alert("Poll not found");
      const data = d.data();
      if (data.ownerId !== uid) return alert("Only owner can edit");
      setPoll({ id: d.id, ...data });
      setQuestion(data.question);
      setOptions(data.options.map(o => o.text));
    };
    load();
  }, [id]);

  const save = async () => {
    if (!question.trim()) return alert("Question required");
    if (options.some(o => !o.trim())) return alert("Empty option found");

    // Reset ALL votes to 0 for each option
    const updatedOptions = options.map(text => ({
        text,
        votes: 0
    }));

    // Clear all voters so no “You voted” shows
    await updateDoc(doc(db, "polls", id), {
        question,
        options: updatedOptions,
        voters: [] // FULL RESET
    });

    navigate("/");
    };


  const addOption = () => setOptions(prev => [...prev, ""]);

  if (!poll) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto card">
      <h2 className="text-2xl font-semibold mb-3">Edit Poll</h2>

      <input className="w-full p-2 border rounded mb-3 bg-gray-50 dark:bg-gray-800"
        value={question} onChange={e => setQuestion(e.target.value)} />

      {options.map((opt, i) => (
        <input key={i}
          value={opt}
          onChange={e => { const a = [...options]; a[i] = e.target.value; setOptions(a); }}
          className="w-full p-2 border rounded mb-2 bg-gray-50 dark:bg-gray-800" />
      ))}

      <div className="flex space-x-2">
        <button onClick={addOption} className="btn bg-gray-200 dark:bg-gray-700">+ Add</button>
        <button onClick={save} className="btn bg-brand-500 text-white">Save Changes</button>
      </div>
    </div>
  );
}
