@echo off
setlocal

title Qian Hui Avatar City
cd /d "%~dp0"

set "QH_NODE=C:\Users\P3761\Documents\node-v24.20.0-win-x64"

if not exist "%QH_NODE%\node.exe" (
  echo.
  echo Node.js was not found at:
  echo %QH_NODE%
  echo.
  pause
  exit /b 1
)

set "PATH=%QH_NODE%;%PATH%"

where pnpm >nul 2>nul
if errorlevel 1 (
  echo.
  echo pnpm is not available. Enabling it with Corepack...
  call corepack enable
  if errorlevel 1 goto :error
)

if not exist "node_modules\.modules.yaml" (
  echo.
  echo Installing game files for the first run...
  call pnpm install
  if errorlevel 1 goto :error
)

echo.
echo Starting Qian Hui Avatar City...
echo Keep this window open while playing.
echo.
call pnpm dev --host 127.0.0.1 --open
exit /b %errorlevel%

:error
echo.
echo The game could not start. Review the message above and try again.
pause
exit /b 1
