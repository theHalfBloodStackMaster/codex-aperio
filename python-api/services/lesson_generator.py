import os
import json

from dotenv import load_dotenv
from groq import AsyncGroq, BadRequestError

from .schemas import LessonResponse
from .prompt import SYSTEM_PROMPT

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise RuntimeError("Groq api key is missingfrom the environment.")

client = AsyncGroq(api_key=api_key)

async def generate_lesson(documentation: str) -> LessonResponse:

    response = None

    for attempt in range(3):
        try:
            retry_instruction = ""

            if attempt > 0:
                retry_instruction = """
                IMPORTANT: Your previous generation failed JSON validation.
                Generate the entire lesson again from scratch.
                Return one syntactically valid JSON object.
                Check every quote, comma, brace, and bracket.
                Use double quotes for all JSON keys and string values.
                Do not put unescaped quotation marks inside strings.
                Follow every field and data type in the output contract.
                """
        
            response = await client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[
                    {
                        "role":"system",
                        "content": SYSTEM_PROMPT + retry_instruction
                    },
                    {
                        "role":"user",
                        "content":(
                            "Teach me the following documentation:\n\n"
                            + documentation
                        )
                    }
                ],
                response_format={"type":"json_object"},
                temperature=0.3
            )
            break

        except BadRequestError as error:
            body = getattr(error, "body", None)
            details = (
                body.get("error",{})
                if isinstance(body,dict)
                else {}
            )
            # Retry only the specific JSON-generation failure.
            if details.get("code") != "json_validate_failed":
                raise

            if attempt == 2:
                raise

            print(
                f"Groq JSON generation failed. "
                f"Retrying attempt {attempt + 2}/3..."
            )

    if response is None:
        raise RuntimeError("Groq did not return a response.")

    content = response.choices[0].message.content
    if not content:
        raise ValueError("Groq returned an empty lesson.")

    
    lesson_data = json.loads(content)

    return LessonResponse.model_validate(lesson_data)