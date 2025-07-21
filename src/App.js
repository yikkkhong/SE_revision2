import React, { useState } from "react";
import quizData from "./quizData";

function getRandomQuestions(data, num) {
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function App() {
  // Find all unique chapters in quizData
  const chapters = Array.from(new Set(quizData.map(q => q.chapter)));
  const [selectedChapter, setSelectedChapter] = useState(chapters[0]);

  // Filter questions for the selected chapter
  const chapterQuestions = quizData.filter(q => q.chapter === selectedChapter);
  const numQuestions = Math.min(10, chapterQuestions.length);

  // State for questions, answers, etc.
  const [questions, setQuestions] = useState(getRandomQuestions(chapterQuestions, numQuestions));
  const [userAnswers, setUserAnswers] = useState(Array(numQuestions).fill(null));
  const [showResult, setShowResult] = useState(false);

  // Handle chapter change
  const handleChapterChange = (e) => {
    const chapter = Number(e.target.value);
    setSelectedChapter(chapter);
    const filtered = quizData.filter(q => q.chapter === chapter);
    const n = Math.min(10, filtered.length);
    setQuestions(getRandomQuestions(filtered, n));
    setUserAnswers(Array(n).fill(null));
    setShowResult(false);
  };

  const handleOptionChange = (qIdx, optIdx) => {
    if (showResult) return;
    const newAnswers = [...userAnswers];
    newAnswers[qIdx] = optIdx;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleRetry = () => {
    setQuestions(getRandomQuestions(chapterQuestions, numQuestions));
    setUserAnswers(Array(numQuestions).fill(null));
    setShowResult(false);
  };

  const score = userAnswers.reduce(
    (acc, ans, idx) => acc + (ans === questions[idx].answer ? 1 : 0),
    0
  );

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Requirements Engineering Quiz</h1>
      <div style={{ marginBottom: 24 }}>
        <label>
          Select Chapter:
          <select value={selectedChapter} onChange={handleChapterChange} style={{ marginLeft: 8 }}>
            {chapters.map(ch => (
              <option key={ch} value={ch}>Chapter {ch}</option>
            ))}
          </select>
        </label>
      </div>
      {questions.map((q, idx) => (
        <div key={idx} style={{ marginBottom: 24, padding: 16, border: "1px solid #eee", borderRadius: 8 }}>
          <div style={{ marginBottom: 8 }}>
            <b>Q{idx + 1}:</b> {q.question}
          </div>
          {q.options.map((opt, oIdx) => (
            <label key={oIdx} style={{ display: "block", marginBottom: 4 }}>
              <input
                type="radio"
                name={`q${idx}`}
                value={oIdx}
                checked={userAnswers[idx] === oIdx}
                disabled={showResult}
                onChange={() => handleOptionChange(idx, oIdx)}
              />
              {opt}
              {showResult && oIdx === q.answer && (
                <span style={{ color: "green", marginLeft: 8 }}>
                  ✓
                </span>
              )}
              {showResult && userAnswers[idx] === oIdx && userAnswers[idx] !== q.answer && (
                <span style={{ color: "red", marginLeft: 8 }}>
                  ✗
                </span>
              )}
            </label>
          ))}
        </div>
      ))}
      {!showResult ? (
        <button onClick={handleSubmit} style={{ padding: "8px 24px", fontSize: 16 }}>Submit</button>
      ) : (
        <div style={{ marginTop: 24 }}>
          <h2>Your Score: {score} / {numQuestions}</h2>
          <button onClick={handleRetry} style={{ padding: "8px 24px", fontSize: 16 }}>Try New Quiz</button>
        </div>
      )}
    </div>
  );
}

export default App; 