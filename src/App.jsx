import { useState } from "react";

/* ---------- Helper: simple rule-based sentiment ---------- */
function ruleBasedSentiment(text) {
  if (!text || !text.trim()) return { label: "Neutral", reason: "No words detected" };
  const happy = ["happy","love","great","awesome","fun","nice","good","yay","excited","best","like","amazing"];
  const sad = ["sad","hate","bad","angry","terrible","lonely","upset","cry","crying","mad","don't","dont","hate"];
  const l = text.toLowerCase();
  let score = 0;
  happy.forEach(w => { if (l.includes(w)) score++; });
  sad.forEach(w => { if (l.includes(w)) score--; });
  if (score > 0) return { label: "Happy", reason: `Found ${score} happy hint(s)` };
  if (score < 0) return { label: "Sad", reason: `Found ${-score} sad hint(s)` };
  return { label: "Neutral", reason: "No strong words found" };
}

/* ---------- Main App ---------- */
export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null); // {label, reason, source}
  const [method, setMethod] = useState("simple"); // "simple" or "ai"
  const [sceneIndex, setSceneIndex] = useState(0);

  const scenes = [
    { title: "Alex got a happy message!", text: "You are awesome, Alex! I love your drawing :)" },
    { title: "Alex got a sad message", text: "I feel lonely today." },
    { title: "A plain message", text: "I have 2 pencils." },
  ];

  async function checkSentiment() {
    const input = text.trim();
    if (!input) { setResult({ label: "Neutral", reason: "Please type a sentence.", source: "simple" }); return; }

    if (method === "simple") {
      const r = ruleBasedSentiment(input);
      setResult({ ...r, source: "Notebook (Simple)" });
      return;
    }

    // method === 'ai' -> call serverless endpoint
    try {
      const res = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Server error" }));
        setResult({ label: "Neutral", reason: "AI error: " + (err.error || res.statusText), source: "AI" });
        return;
      }

      const data = await res.json(); // expected { label: "POSITIVE" } or [{label:...}]
      let labelRaw = "";
      if (Array.isArray(data) && data[0] && data[0].label) labelRaw = data[0].label;
      else if (data.label) labelRaw = data.label;
      else labelRaw = JSON.stringify(data);

      const label = (labelRaw.toUpperCase().includes("POS")) ? "Happy"
        : (labelRaw.toUpperCase().includes("NEG")) ? "Sad" : "Neutral";

      setResult({ label, reason: `AI says: ${labelRaw}`, source: "Magic AI" });
    } catch (e) {
      setResult({ label: "Neutral", reason: "Network or server error", source: "AI" });
    }
  }

  /* ---------- Quiz ---------- */
  const quizQuestions = [
    { q: "I love playing with my friends.", answer: "Happy" },
    { q: "I don't want to go to school today.", answer: "Sad" },
    { q: "The sun is bright.", answer: "Neutral" },
  ];
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [qFeedback, setQFeedback] = useState(null);

  function answerQuiz(choice) {
    const correct = quizQuestions[qIndex].answer;
    const isCorrect = choice === correct;
    if (isCorrect) setScore(s => s + 1);
    setQFeedback(isCorrect ? "Correct! 🎉" : `Oops! Correct: ${correct}`);
    setTimeout(() => {
      setQFeedback(null);
      if (qIndex + 1 < quizQuestions.length) setQIndex(i => i + 1);
      else setQIndex(0);
    }, 900);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-6 flex flex-col items-center">
      <header className="w-full max-w-3xl text-center mb-6">
        <h1 className="text-5xl font-extrabold text-purple-700 mb-2">✨ Alex’s Magic Notebook ✨</h1>
        <p className="text-lg text-gray-700">Help Alex find if a sentence is <b>Happy</b>, <b>Sad</b> or <b>Neutral</b>.</p>
      </header>

      {/* Scenes */}
      <section className="w-full max-w-3xl bg-white rounded-2xl shadow p-5 mb-6">
        <h2 className="text-2xl font-bold text-pink-600">{scenes[sceneIndex].title}</h2>
        <p className="mt-2 italic">“{scenes[sceneIndex].text}”</p>
        <div className="flex gap-3 mt-4">
          <button onClick={() => { setText(scenes[sceneIndex].text); setResult(null); }}
            className="px-4 py-2 rounded-full bg-purple-600 text-white">Try this sentence</button>
          <button onClick={() => setSceneIndex((sceneIndex + 1) % scenes.length)}
            className="px-4 py-2 rounded-full bg-gray-200">Next Scene</button>
        </div>
      </section>

      {/* Checker */}
      <section className="w-full max-w-3xl bg-white rounded-2xl shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Try it yourself</h3>
          <div>
            <label className="mr-2 text-sm">Method:</label>
            <select value={method} onChange={e => setMethod(e.target.value)} className="rounded-md border px-2 py-1">
              <option value="simple">Notebook (Simple)</option>
              <option value="ai">Magic AI Crystal Ball (Smart)</option>
            </select>
          </div>
        </div>

        <textarea
          rows="3"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a sentence here..."
          className="w-full p-3 rounded-xl border focus:outline-none mb-4"
        />

        <div className="flex gap-3">
          <button onClick={checkSentiment} className="bg-purple-600 text-white px-5 py-2 rounded-xl">Check Sentiment</button>
          <button onClick={() => { setText(""); setResult(null); }} className="bg-gray-200 px-4 py-2 rounded-xl">Clear</button>
        </div>

        {result && (
          <div className="mt-5 p-4 rounded-lg bg-gray-50 border">
            <div className="text-2xl font-bold">
              Result: {result.label === "Happy" ? "😀 Happy" : result.label === "Sad" ? "😢 Sad" : "😐 Neutral"}
            </div>
            <div className="text-sm text-gray-600 mt-1">Source: {result.source} — {result.reason}</div>
          </div>
        )}
      </section>

      {/* Quiz */}
      <section className="w-full max-w-3xl bg-white rounded-2xl shadow p-6 mb-6">
        <h3 className="text-xl font-semibold text-pink-600 mb-3">Quick Quiz — Score: {score}/{quizQuestions.length}</h3>
        <p className="italic mb-3">“{quizQuestions[qIndex].q}”</p>

        <div className="flex gap-3">
          <button onClick={() => answerQuiz("Happy")} className="px-4 py-2 rounded-full bg-green-500 text-white">😀 Happy</button>
          <button onClick={() => answerQuiz("Sad")} className="px-4 py-2 rounded-full bg-red-500 text-white">😢 Sad</button>
          <button onClick={() => answerQuiz("Neutral")} className="px-4 py-2 rounded-full bg-gray-500 text-white">😐 Neutral</button>
        </div>

        {qFeedback && <div className="mt-3 text-sm">{qFeedback}</div>}
      </section>

      <footer className="max-w-3xl text-center text-sm text-gray-600">
        Tip: If you choose <b>Magic AI</b>, it uses a small AI model — works after deployment if you add the API key.
      </footer>
    </div>
  );
}
