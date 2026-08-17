@echo off
cd /d "%~dp0"
set "PATH=%PATH%;C:\Program Files\nodejs\;%APPDATA%\npm"
echo ============================================
echo   DIAGNOSTICO STEEL MEASUREMENT
echo ============================================
echo.
echo Carpeta actual: %cd%
echo.
echo --- Version de Node ---
node -v
echo.
echo --- Version de npm ---
npm -v
echo.
echo --- Existe node_modules? ---
if exist node_modules (echo SI) else (echo NO - hace falta "npm install")
echo.
echo --- Quien esta usando el puerto 3002? ---
netstat -ano | findstr :3002
echo Si aparecio una linea con LISTENING arriba, ese proceso viejo esta bloqueando el inicio.
echo Liberando el puerto 3002...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :3002 ^| findstr LISTENING') do (
  echo Matando proceso %%p
  taskkill /F /PID %%p
)
echo.
echo --- Iniciando servidor, Ctrl+C para cortar ---
set PORT=3002
npm start
echo.
echo El servidor se detuvo. Codigo de salida: %errorlevel%
pause
