import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const navigate = useNavigate();
  const uid = localStorage.getItem("uid");
  const username = localStorage.getItem("username");

  if (!uid) {
    navigate("/login");
    return null;
  }

  const addOption = () => setOptions(prev => [...prev, ""]);

  const createPoll = async () => {
    if (!question.trim()) return alert("Enter a question");
    if (options.some(o => !o.trim())) return alert("All options must be filled");

    try {
      await addDoc(collection(db, "polls"), {
        question,
        options: options.map(o => ({ text: o, votes: 0 })),
        createdAt: Date.now(),
        ownerId: uid,
        ownerName: username,
        voters: []
      });
      navigate("/");
    } catch (e) {
      console.error(e);
      alert("Failed to create poll");
    }
  };

  return (
    <div className="max-w-2xl mx-auto card">
      <h2 className="text-2xl font-semibold mb-3">Create Poll</h2>
      <input
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Write your poll question"
        className="w-full p-2 border rounded mb-3 bg-gray-50 dark:bg-gray-800"
      />

      <h3 className="font-medium mb-2">Options</h3>
      {options.map((opt, i) => (
        <input
          key={i}
          value={opt}
          onChange={(e) => {
            const arr = [...options]; arr[i] = e.target.value; setOptions(arr);
          }}
          placeholder={`Option ${i + 1}`}
          className="w-full p-2 border rounded mb-2 bg-gray-50 dark:bg-gray-800"
        />
      ))}

      <div className="flex space-x-2">
        <button onClick={addOption} className="btn bg-gray-200 dark:bg-gray-700">+ Add option</button>
        <button onClick={createPoll} className="btn bg-brand-500 text-white">Create Poll</button>
      </div>
    </div>
  );
}
