ECHO OFF
ECHO "Loading unLogger"
@REM start %~dp0init.cmd

TITLE unLogger
npm run dev

start "" http://localhost:5173/
