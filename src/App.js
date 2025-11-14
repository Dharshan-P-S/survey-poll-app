import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import PollList from "./components/PollList";
import CreatePoll from "./components/CreatePoll";
import EditPoll from "./components/EditPoll";
import ThemeToggle from "./components/ThemeToggle";
import ResultsPage from "./components/ResultsPage";


function Header() {
  const username = localStorage.getItem("username");
  const uid = localStorage.getItem("uid");
  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
  <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
    <Link to="/" className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold">
        SP
      </div>
      <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Survey Poll App
      </span>
    </Link>

    <div className="flex items-center space-x-3">
      <Link
        to="/create"
        className="btn bg-brand-500 text-white hover:bg-brand-600"
      >
        Create Poll
      </Link>

      <ThemeToggle />

      <div className="text-sm text-gray-700 dark:text-gray-300">
        Hi, <strong>{username}</strong>
      </div>
    </div>
  </div>
</header>

  );
}

function App() {
  return (
    <Router>
      <Header />
      <main className="max-w-4xl mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PollList />} />
          <Route path="/create" element={<CreatePoll />} />
          <Route path="/edit/:id" element={<EditPoll />} />
          <Route path="/results/:id" element={<ResultsPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
