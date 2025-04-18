@echo off
echo Starting Node.js server...
start /B node .\server.js

echo Changing directory to flask_backend...
cd flask_backend

echo Starting Flask server...
python server.py

pause