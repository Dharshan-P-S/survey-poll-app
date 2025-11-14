import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ResultsPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const navigate = useNavigate();
  const uid = localStorage.getItem("uid");

  useEffect(() => {
    const loadPoll = async () => {
      const snap = await getDoc(doc(db, "polls", id));
      if (!snap.exists()) {
        alert("Poll not found.");
        return navigate("/");
      }
      const data = snap.data();

      if (data.ownerId !== uid) {
        alert("Only the poll owner can view this page.");
        return navigate("/");
      }

      setPoll({ id: snap.id, ...data });
    };

    loadPoll();
  }, [id, uid, navigate]);

  if (!poll) return <div className="p-6">Loading...</div>;

  const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);

  return (
    <div className="max-w-3xl mx-auto card mt-6">
      <h1 className="text-3xl font-bold mb-2">{poll.question}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Created by <span className="font-medium">{poll.ownerName}</span>
      </p>

      <h2 className="text-xl font-semibold mb-3">Poll Results</h2>

      <div className="space-y-4">
        {poll.options.map((opt, index) => {
          const votes = opt.votes || 0;
          const pct = totalVotes === 0 ? 0 : ((votes / totalVotes) * 100).toFixed(1);

          return (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <span className="font-medium">{opt.text}</span>
                <span className="text-sm">{votes} votes • {pct}%</span>
              </div>

              <div className="w-full bg-gray-300 dark:bg-gray-700 h-3 rounded mt-1">
                <div
                  className="bg-brand-500 h-3 rounded"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">Who voted?</h3>
      <div className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
        {poll.voters.length === 0 && (
          <p className="text-gray-500">No votes yet.</p>
        )}

        {poll.voters.map((v, i) => (
          <div key={i} className="flex justify-between px-1 py-1 border-b border-gray-200 dark:border-gray-700">
            <span>{v.username}</span>
            <span>Option {v.choice + 1}</span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link to="/" className="btn bg-brand-500 text-white px-4 py-2">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
