import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";

function PollResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "polls", id), (snap) => {
      setPoll({ id: snap.id, ...snap.data() });
    });

    return () => unsubscribe();
  }, []);

  if (!poll) return <h2>Loading...</h2>;

  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Results</h2>
      <h3 className="text-xl font-semibold mb-4">{poll.question}</h3>

      {poll.options.map((opt, i) => {
        const pct = totalVotes === 0 ? 0 : ((opt.votes / totalVotes) * 100).toFixed(1);

        return (
          <div key={i} className="mb-4">
            <div className="font-semibold">{opt.text}</div>
            <div className="text-gray-700 mb-1">
              {opt.votes} votes ({pct}%)
            </div>

            <div className="w-full bg-gray-300 rounded h-3">
              <div
                className="bg-blue-600 h-3 rounded"
                style={{ width: `${pct}%` }}
              ></div>
            </div>
          </div>
        );
      })}

      <button
        onClick={() => navigate(`/poll/${poll.id}`)}
        className="bg-gray-700 text-white px-4 py-2 rounded mr-2"
      >
        Back
      </button>

      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Home
      </button>
    </div>
  );
}

export default PollResults;
