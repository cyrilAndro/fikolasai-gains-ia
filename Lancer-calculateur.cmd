@echo off
setlocal
cd /d "%~dp0"
set "FIKOLAS_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%FIKOLAS_NODE%" set "FIKOLAS_NODE=node"
"%FIKOLAS_NODE%" -e "if(Number(process.versions.node.split('.')[0]) !== 24) process.exit(1)"
if errorlevel 1 (
  echo Installez Node.js 24.19.0 puis relancez ce fichier.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  echo Dependances absentes. Avec Node.js 24.19.0, lancez npm ci dans ce dossier.
  pause
  exit /b 1
)
echo Le calculateur va s'ouvrir dans votre navigateur. Gardez cette fenetre ouverte.
"%FIKOLAS_NODE%" node_modules\vite\bin\vite.js --host 127.0.0.1 --open
