import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const uid = localStorage.getItem("uid");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!uid) navigate("/login");
  }, [uid, navigate]);

  // Fetch polls in real time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "polls"), (snap) => {
      const arr = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        voters: d.data().voters || []
      }));

      arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setPolls(arr);
    });

    return () => unsub();
  }, []);

  // Voting logic + change vote logic
  const vote = async (poll, optionIndex) => {
    const voters = poll.voters || [];
    const previous = voters.find((v) => v.uid === uid);

    const updatedOptions = poll.options.map((o) => ({ ...o }));

    // Remove previous vote if exists
    if (previous) {
      updatedOptions[previous.choice].votes =
        Math.max(0, updatedOptions[previous.choice].votes - 1);
    }

    // Add new vote
    updatedOptions[optionIndex].votes =
      (updatedOptions[optionIndex].votes || 0) + 1;

    // Update voters array
    const updatedVoters = previous
      ? voters.map((v) =>
          v.uid === uid ? { uid, username, choice: optionIndex } : v
        )
      : [...voters, { uid, username, choice: optionIndex }];

    await updateDoc(doc(db, "polls", poll.id), {
      options: updatedOptions,
      voters: updatedVoters
    });
  };

  // Delete poll
  const confirmDelete = async (pollId) => {
    const ok = window.confirm("Delete this poll permanently?");
    if (!ok) return;
    await deleteDoc(doc(db, "polls", pollId));
  };

  // Reset vote (Change Vote)
  const changeVote = async (poll) => {
    const voters = poll.voters || [];
    const previous = voters.find((v) => v.uid === uid);

    if (!previous) return; // failsafe

    const updatedOptions = poll.options.map((o) => ({ ...o }));
    updatedOptions[previous.choice].votes = Math.max(
      0,
      updatedOptions[previous.choice].votes - 1
    );

    const updatedVoters = voters.filter((v) => v.uid !== uid);

    await updateDoc(doc(db, "polls", poll.id), {
      options: updatedOptions,
      voters: updatedVoters
    });
  };

  return (
    <div className="space-y-6 mt-6">
      {polls.length === 0 && (
        <div className="card text-center">No polls created yet.</div>
      )}

      {polls.map((poll) => {
        const totalVotes = poll.options.reduce(
          (sum, o) => sum + (o.votes || 0),
          0
        );
        const myVote = poll.voters?.find((v) => v.uid === uid);

        return (
          <div
            key={poll.id}
            className="card bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-md"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {poll.question}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  by {poll.ownerName}
                </p>
              </div>

              {poll.ownerId === uid && (
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/edit/${poll.id}`}
                    className="btn bg-yellow-400 text-gray-900 px-3 py-1"
                  >
                    Edit
                  </Link>

                  <Link
                    to={`/results/${poll.id}`}
                    className="btn bg-blue-600 text-white px-3 py-1"
                  >
                    Results
                  </Link>

                  <button
                    className="btn bg-red-500 text-white px-3 py-1"
                    onClick={() => confirmDelete(poll.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Voting / Results */}
            <div className="space-y-4">
              {!myVote ? (
                // BEFORE voting → only options
                poll.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => vote(poll, i)}
                    className="w-full btn bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-left"
                  >
                    {opt.text}
                  </button>
                ))
              ) : (
                <>
                  {/* AFTER voting → show bars, percentages, votes */}
                  {poll.options.map((opt, i) => {
                    const votes = opt.votes || 0;
                    const pct =
                      totalVotes === 0
                        ? 0
                        : ((votes / totalVotes) * 100).toFixed(1);

                    return (
                      <div key={i} className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{opt.text}</span>
                          <span>
                            {votes} • {pct}%
                          </span>
                        </div>

                        <div className="w-full bg-gray-300 dark:bg-gray-700 h-3 rounded">
                          <div
                            className="bg-brand-500 h-3 rounded"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>

                        {myVote.choice === i && (
                          <p className="text-green-500 text-sm mt-1">
                            ✔ You voted
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {/* Change Vote Button */}
                  <button
                    onClick={() => changeVote(poll)}
                    className="btn mt-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                  >
                    Change Vote
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
