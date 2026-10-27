# Codex Aperio - Unveil the magic behind documentation.

<p align="center">
  <img src="./next-app/public/Codex_Aperio.png" alt="Codex Aperio logo" width="220">
</p>

Codex Aperio is an AI-powered learning assistant designed for aspiring developers and engineers who want to learn technologies through official documentation. It transforms complex technical concepts into beginner-friendly explanations using simple language, real-life analogies, guided code examples, and practical exercises. The goal is to help learners build a strong foundation and apply their knowledge when developing applications.

## Why I Built This Project

As a beginner, I often struggled to understand the nuances of technical concepts through official documentation and apply them to real-world requirements. I wanted to build an assistant that makes technical learning more approachable by explaining concepts in simple language, connecting them to familiar real-life situations, and providing useful code examples.

Codex Aperio is my attempt to make learning from official documentation easier, more practical, and more accessible to aspiring developers.

### Features

- Documentation Input: Paste a snippet of technical documentation to explore a concept.
- AI-Powered Lessons: Generate simplified explanations of complex technical concepts.
- Real-Life Analogies: Connect abstract programming concepts to familiar everyday situations.
- Key-Term Definitions: Understand important technical terminology in context.
- Guided Code Examples: Explore code examples with step-by-step reasoning and walkthroughs.
- Experimentation: See the expected result and explore suggested modifications to examples.
- Practice Tasks: Reinforce understanding through practical exercises.

### Technology Stack

| Technology   | Purpose                                 |
| :----------- | :-------------------------------------- |
| Next.js      | Frontend application and user interface |
| React        | Building interactive UI components      |
| Typescript   | Type safety for frontend code           |
| Tailwind CSS | Styling and responsive layouts          |
| Python       | Backend development                     |
| Fast API     | Backend API and request validation      |
| Groq API     | AI-powered lesson generation            |

### How It Works

1. The user pastes a snippet of technical documentation into the frontend.
2. The Next.js application sends the documentation to the FastAPI backend.
3. The backend processes the request and uses the Groq API to generate a structured lesson.
4. The generated lesson is validated and returned to the frontend.
5. The frontend displays the explanation, analogy, key terms, guided code example, and practice task.

### Project Structure

```
codex-aperio/
├── next-app/          # Next.js frontend
├── python-api/        # FastAPI backend and AI integration
└── README.md
```

## Getting Started

### Prerequisites

Before running the project, make sure you have:

- Node.js and npm installed
- Python installed
- A Groq API key

### 1. Clone the Repository

```
git clone <your-github-repository-url>
cd codex-aperio
```

### 2. Set Up the Backend

```
cd python-api
python -m venv .venv
```

Activate the virtual environment.

macOS / Linux:

```
source .venv/bin/activate
```

Windows PowerShell:

```
.venv\Scripts\Activate.ps1
```

Install the backend dependencies using the project's dependency file. If the project contains requirements.txt, run:

```
pip install -r requirements.txt
```

Create a .env file in the backend directory and configure your Groq API key:

```
GROQ_API_KEY=your_groq_api_key
```

Start the FastAPI development server using the correct application module for your project:

```
uvicorn main:app --reload
```

The API documentation is typically available at:

http://127.0.0.1:8000/docs

### 3. Set Up the Frontend

Open a second terminal:

```
cd codex-aperio/next-app
npm install
npm run dev
```

Open the frontend in your browser:

http://localhost:3000

Make sure the frontend API URL points to your running backend.

## Current Limitations

- The current version accepts pasted documentation text.
- Documentation URL extraction and file uploads are not yet part of the current user-facing workflow.
- AI-generated explanations and code examples may require verification against the original documentation.
- The application currently focuses on generating lessons rather than saving persistent learning history.

## Future Plans

- Support importing documentation from URLs and files.
- Add saved lessons and learning history.
- Introduce interactive follow-up questions and deeper explanations.
- Add knowledge checks and progress tracking.
- Explore additional ways to personalize the learning experience.

## Security

- Keep API keys and other secrets in environment variables.
- Never commit .env files containing credentials.
- Verify AI-generated code and explanations before using them in real projects.

## License

A license has not yet been selected. Licensing information will be added once the project license is decided.
