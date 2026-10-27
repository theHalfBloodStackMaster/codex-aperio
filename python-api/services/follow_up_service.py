from groq import AsyncGroq
from .schemas import FollowUpRequest, FollowUpResponse
from .prompt import FOLLOWUP_PROMPT
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise RuntimeError("Groq api key is missingfrom the environment.")

client = AsyncGroq(api_key=api_key)

async def answer_follow_up(request: FollowUpRequest) -> FollowUpResponse:

    messages = [
        {
            "role":"system",
            "content": FOLLOWUP_PROMPT
        },
        {
            "role":"user",
            "content":(
                "Here is the original lesson:\n"
                f"{request.lesson.model_dump_json()}\n\n"
                "Use this lesson as context for the conversation."
            ),
        }
    ]

    # conversation history
    for message in request.messages:
        messages.append(
            {
                "role": message.role,
                "content": message.content
             }
        )

    # new question
    messages.append(
        {
            "role":"user",
            "content": request.question
        }
    )

    
    response = await client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=messages,
        temperature=0.3
    )

    answer = response.choices[0].message.content

    if not answer:
        raise ValueError("Groq returned an empty follow-up answer.")

    return FollowUpResponse(answer=answer)
    
    