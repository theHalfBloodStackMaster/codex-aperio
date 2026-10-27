"use client";

import { useState } from "react";
import { CircularProgress, Skeleton } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";

type KeyTerm = {
  term: string;
  meaning: string;
};

type CodeWalkthrough = {
  step: string;
  explanation: string;
};

type CodeExample = {
  goal: string;
  thinkingSteps: string[];
  code: string;
  walkthrough: CodeWalkthrough[];
  expectedResult: string;
  experiment: string;
};

type LessonResponse = {
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  explanation: string;
  analogy: string;
  keyTerms: KeyTerm[];
  example: CodeExample;
  practiceTask: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type FollowUpRequest = {
  lesson: LessonResponse;
  messages: ChatMessage[];
  question: string;
};

type FollowUpResponse = {
  answer: string;
};

export default function Home() {
  const [documentation, setDocumentation] = useState("");
  const [error, setError] = useState("");
  const [chatError, setChatError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chat, setChat] = useState("");

  async function sendDocumentation() {
    if (!documentation.trim()) return;
    setLoading(true);
    setError("");
    setLesson(null);
    setChat(documentation.trim());
    try {
      const url = "http://127.0.0.1:8000";
      const response = await fetch(`${url}/lesson`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentation,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      const data: LessonResponse = await response.json();
      setLesson(data);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again",
      );
    } finally {
      setLoading(false);
      setDocumentation("");
    }
  }

  async function sendFollowup() {
    if (!lesson || !question.trim() || chatLoading) return;

    const currentQuestion = question.trim();
    setChatLoading(true);
    setChatError("");

    try {
      const url = "http://127.0.0.1:8000";
      const response = await fetch(`${url}/follow-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lesson,
          messages,
          question: currentQuestion,
        } satisfies FollowUpRequest),
      });

      if (!response.ok) {
        throw new Error(`Follow-up request failed: ${response.status}`);
      }

      const data: FollowUpResponse = await response.json();

      setMessages((previousMessages) => [
        ...previousMessages,
        { role: "user", content: currentQuestion },
        { role: "assistant", content: data.answer },
      ]);

      setQuestion("");
    } catch (error: unknown) {
      setChatError(
        error instanceof Error
          ? error.message
          : "Unable to get an answer. Please try again.",
      );
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div
      className={`flex min-h-dvh flex-col items-center justify-center pb-10 `}
    >
      {/** header */}
      <header
        className={`flex w-full flex-col justify-center items-center py-5 `}
      >
        <h1 className={`mb-2 text-center text-5xl`}>Codex Aperio</h1>
        <h3 className="text-center">Unveil The Magic Behind Documentation</h3>
      </header>

      {/** chat */}
      {chat && (
        <div className=" w-fit max-w-3/4 bg-blue-800 rounded-xl self-end p-4 m-4 wrap-anywhere">
          {chat}
        </div>
      )}
      <div className="mt-0 m-4 w-full min-w-0 max-w-[96%] flex-col rounded-lg bg-[#1a1a1a] ">
        {lesson && (
          <section className="flex w-full flex-col justify-start wrap-anywhere ">
            {/** lesson headings */}
            <div className="border-b border-b-black p-4">
              <h1>{lesson?.title}</h1>
              <p>Difficulty : {lesson?.difficulty}</p>
            </div>
            {/** lesson explanation */}
            <div className=" p-4 border-b border-b-black">
              <h2 className="text-lg">Explanation:</h2>
              <p className="mb-2 pl-4">{lesson?.explanation}</p>
              {lesson?.keyTerms.map((item, index) => (
                <div key={`${item.term}-${index}`} className="mb-4 ">
                  <p className="pl-8">Term: {item.term}</p>
                  <p className="pl-8">Meaning: {item.meaning}</p>
                </div>
              ))}
              <h2 className="text-lg">Analogy:</h2>
              <p className="pl-4 mt-2">{lesson?.analogy}</p>
            </div>
            {/** lesson examples */}
            <div className="mt-2 p-4">
              <div>
                <h2>{lesson.example?.goal}</h2>
                {lesson?.example?.thinkingSteps.map((item, index) => (
                  <div key={`${index + 1}`}>
                    <p className="pl-4 mb-4">
                      Step {index + 1}: {item}
                    </p>
                  </div>
                ))}
                {/** code */}
                <pre className="p-4 rounded-lg bg-[#2a2a2a] overflow-auto max-w-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white">
                  <code>{lesson?.example.code}</code>
                </pre>
                {/** code walkthrough */}
                <h2 className="mt-4">Code Walkhrough</h2>
                {lesson?.example?.walkthrough.map((item, index) => (
                  <div key={index} className="mb-4 pl-4">
                    <p>
                      Step {index + 1}: {item.step}
                    </p>
                    <p>Explanation: {item.explanation} </p>
                  </div>
                ))}
                <h2>Expected Result:</h2>
                <p className="pl-4 mb-4 ">{lesson?.example?.expectedResult}</p>
                <h2>Experiment:</h2>
                <p className="pl-4 mb-4">{lesson?.example?.experiment}</p>
              </div>

              <h2>Practice task : </h2>
              <p className="pl-4 mb-4">{lesson?.practiceTask}</p>
            </div>
          </section>
        )}
        {loading ? (
          <section className="flex flex-col w-full h-200 p-4 gap-10">
            <div>
              <Skeleton variant="text" animation="wave" className="w-3/4" />
              <Skeleton variant="text" animation="wave" className="w-1/4" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton variant="text" animation="wave" className="w-3/4" />
              <Skeleton variant="text" animation="wave" className="w-3/5" />
              <Skeleton variant="text" animation="wave" className="w-3/5" />
              <Skeleton variant="text" animation="wave" className="w-3/5" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton
                variant="rectangular"
                width={300}
                height={200}
                animation="wave"
              />
              <Skeleton variant="text" animation="wave" className="w-3/5" />
              <Skeleton variant="text" animation="wave" className="w-3/5" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton variant="text" animation="wave" className="w-3/4" />
              <Skeleton variant="text" animation="wave" className="w-3/5" />
              <Skeleton variant="text" animation="wave" className="w-3/5" />
              <Skeleton variant="text" animation="wave" className="w-3/5" />
            </div>
          </section>
        ) : (
          error && <p className="p-4 text-red-400">{error}</p>
        )}
      </div>

      <div
        className={`flex w-9/10 max-w-4xl flex-col items-end justify-between rounded-2xl bg-[#2a2a2a] p-2 shadow-2xl max-h-70 ${loading ? "mt-auto" : "mt-5"} `}
      >
        <textarea
          required
          value={documentation}
          onChange={(e) => setDocumentation(e.target.value)}
          placeholder="Turn technical documentation into simple explanations."
          className={`p-4 mb-2 outline-none resize-none overflow-auto w-full h-full self-start scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white field-sizing-content `}
        />

        <button
          onClick={sendDocumentation}
          className={`p-1 mr-2 hover:cursor-pointer disabled:cursor-not-allowed rounded-full disabled:bg-transparent bg-blue-500 disabled:text-[#3a3a3a]`}
          disabled={loading || !documentation.trim()}
        >
          {loading ? (
            <CircularProgress
              aria-label="Loading…"
              size={24}
              thickness={5}
              sx={{ color: "grey" }}
            />
          ) : (
            <ArrowUpwardRoundedIcon />
          )}
        </button>
      </div>
    </div>
  );
}
