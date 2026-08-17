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

start "" cscript //nologo "%~dp0MostrarAviso.vbs" "Primera vez que se abre: instalando dependencias. Puede tardar 1-2 minutos. El navegador se va a abrir solo cuando este listo, no hace falta hacer nada."
echo Instalando dependencias... >> "%LOGFILE%"
call npm install >> "%LOGFILE%" 2>&1
if errorlevel 1 goto FALLO_INSTALL

:INICIAR
set PORT=3002
echo Iniciando servidor... >> "%LOGFILE%"
call npm start >> "%LOGFILE%" 2>&1
echo npm start termino con codigo %errorlevel% >> "%LOGFILE%"
start "" cscript //nologo "%~dp0MostrarAviso.vbs" "El servidor de Steel Measurement se detuvo. Si esto paso justo despues de abrirlo sin llegar a ver la pagina, revisa steel-measurement-log.txt en esta misma carpeta y mandaselo a Claude."
goto FIN

:SIN_NPM
echo ERROR: no se encontro npm/Node.js en el PATH >> "%LOGFILE%"
start "" cscript //nologo "%~dp0MostrarAviso.vbs" "No se encontro Node.js instalado, o no esta en el PATH de este usuario. Instalalo desde nodejs.org y volve a intentar. Si ya lo tenes instalado, reinicia la PC una vez despues de instalarlo."
goto FIN

:FALLO_INSTALL
echo ERROR: fallo npm install >> "%LOGFILE%"
start "" cscript //nologo "%~dp0MostrarAviso.vbs" "Fallo la instalacion de dependencias. Se guardo el detalle en steel-measurement-log.txt, en esta misma carpeta. Mandaselo a Claude."
goto FIN

:FIN
