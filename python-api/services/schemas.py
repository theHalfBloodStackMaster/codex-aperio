from typing import Literal

from pydantic import BaseModel



class KeyTerm(BaseModel):
    term: str
    meaning: str

class CodeWalkthrough(BaseModel):
    step:str
    explanation:str

class CodeExample(BaseModel):
    goal:str
    thinkingSteps: list[str]
    code:str
    walkthrough: list[CodeWalkthrough]
    expectedResult: str
    experiment: str

class LessonResponse(BaseModel):
    title: str
    difficulty: Literal["Beginner", "Intermediate", "Advanced"]
    explanation: str
    analogy: str
    keyTerms: list[KeyTerm]
    example: CodeExample
    practiceTask: str


class LessonRequest(BaseModel):
    documentation: str


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class FollowUpRequest(BaseModel):
    lesson: LessonResponse
    messages: list[ChatMessage]
    question: str


class FollowUpResponse(BaseModel):
    answer: str
