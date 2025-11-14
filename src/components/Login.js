import { useState } from "react";
import { auth } from "../firebase";
import { signInAnonymously, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    if (!username.trim()) return alert("Enter a username");

    try {
      const res = await signInAnonymously(auth);
      await updateProfile(res.user, { displayName: username });
      localStorage.setItem("uid", res.user.uid);
      localStorage.setItem("username", username);
      navigate("/");
    } catch (e) {
      console.error(e);
      alert("Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Welcome — Login</h1>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter simple username"
        className="w-full border rounded p-2 mb-3 bg-gray-50 dark:bg-gray-800"
      />

      <div className="flex space-x-2">
        <button onClick={loginUser} className="btn bg-brand-500 text-white">Login</button>
        <button onClick={() => { setUsername("Guest"); }} className="btn bg-gray-200 dark:bg-gray-700">Quick Guest</button>
      </div>
    </div>
  );
}
