cd frontend/app
start cmd /c "npm run dev"

cd ../../

cd backend/app
start cmd /c "uvicorn main:app --reload"

start http://localhost:5173