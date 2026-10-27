from fastapi import FastAPI , HTTPException
from fastapi.middleware.cors import CORSMiddleware

from services.schemas import LessonRequest, LessonResponse, FollowUpResponse, FollowUpRequest
from services.lesson_generator import generate_lesson
from services.follow_up_service import answer_follow_up

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/lesson", response_model=LessonResponse)
async def create_lesson(request: LessonRequest):
    try:
        return await generate_lesson(request.documentation)
    except Exception as error:
        import traceback
        traceback.print_exc()
        print(f"Lesson generation failed:{error}")
        raise HTTPException(
            status_code=502,
            detail="Unable to generate a lesson  right now. Please try again later",
        )from error

@app.post("/follow-up", response_model=FollowUpResponse)
async def create_follow_up(request: FollowUpRequest):
    try:
        return await answer_follow_up(request=request)
    except Exception as error:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=502,
            detail="Unable to generate a lesson  right now. Please try again later",
        )from error