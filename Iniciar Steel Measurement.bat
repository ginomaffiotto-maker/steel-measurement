@echo off
setlocal
cd /d "%~dp0"

rem Red de seguridad por si el PATH no tiene Node.js cuando se lanza con doble clic
set "PATH=%PATH%;C:\Program Files\nodejs\;%APPDATA%\npm"

set "LOGFILE=%~dp0steel-measurement-log.txt"
echo ===================================== > "%LOGFILE%"
echo %date% %time% >> "%LOGFILE%"
echo ===================================== >> "%LOGFILE%"

where npm >nul 2>&1
if errorlevel 1 goto SIN_NPM

rem Liberar el puerto 3002 por si quedo un servidor viejo colgado de un intento anterior
echo Liberando puerto 3002 si estaba ocupado... >> "%LOGFILE%"
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :3002 ^| findstr LISTENING') do (
  echo Matando proceso %%p que ocupaba el puerto 3002 >> "%LOGFILE%"
  taskkill /F /PID %%p >> "%LOGFILE%" 2>&1
)

if exist node_modules goto INICIAR

echo Instalando dependencias... >> "%LOGFILE%"
call npm install >> "%LOGFILE%" 2>&1
if errorlevel 1 goto FALLO_INSTALL

:INICIAR
set PORT=3002
echo Iniciando servidor... >> "%LOGFILE%"
call npm start >> "%LOGFILE%" 2>&1
echo npm start termino con codigo %errorlevel% >> "%LOGFILE%"
goto FIN

:SIN_NPM
echo ERROR: no se encontro npm/Node.js en el PATH >> "%LOGFILE%"
goto FIN

:FALLO_INSTALL
echo ERROR: fallo npm install >> "%LOGFILE%"
goto FIN

:FIN
