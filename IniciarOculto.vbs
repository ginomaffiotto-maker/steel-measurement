' Lanza Steel Measurement completamente oculto, sin ninguna ventana de consola.
' Pasa por PowerShell oculto (igual que steelCRM) en vez de invocar el .bat
' directo, que sí generaba un parpadeo de consola.
' Invocado desde el acceso directo del escritorio (target: wscript.exe).
' Ruta auto-detectada (no hardcodeada) para que este mismo archivo funcione
' sin cambios en cualquier PC, sea cual sea la carpeta de usuario de Windows.
Dim carpeta
carpeta = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
CreateObject("WScript.Shell").Run "powershell -NoProfile -ExecutionPolicy Bypass -File """ & carpeta & "\IniciarSteelMeasurement.ps1""", 0, False
