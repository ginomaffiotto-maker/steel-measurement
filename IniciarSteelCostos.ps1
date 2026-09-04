# IniciarSteelCostos.ps1 (renombrado 2026-09-04, ver "Iniciar Steel Costos.bat")
# Mismo patrón que IniciarSteelCRM.ps1 (Steel CRM) — evita el flash de consola
# que sí aparece al invocar el .bat directo desde WScript.Shell.Run.

$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $dir

# Se lanza el .bat directo como FileName (no envuelto en "cmd.exe /c
# ""...""") porque el nombre tiene espacios ("Iniciar Steel Costos.bat")
# y esa combinación dispara un bug de parseo clásico de cmd.exe: toma
# "Iniciar" como si fuera el comando y el resto como argumentos, y todo
# falla en silencio (encontrado 2026-08-23 probando esto en la práctica,
# no en teoría — el .bat nunca llegaba a escribir ni su propio log).
# Start-Process -WindowStyle Hidden sí sigue mostrando un parpadeo de
# consola brevísimo, pero es preferible a que el launcher no arranque.
Start-Process -FilePath "Iniciar Steel Costos.bat" -WorkingDirectory $dir -WindowStyle Hidden

function Wait-Port($port, $maxSeconds) {
    $sw = [Diagnostics.Stopwatch]::StartNew()
    while ($sw.Elapsed.TotalSeconds -lt $maxSeconds) {
        try {
            $client = New-Object System.Net.Sockets.TcpClient
            $client.Connect("127.0.0.1", $port)
            $client.Close()
            return $true
        } catch {
            Start-Sleep -Milliseconds 500
        }
    }
    return $false
}

Wait-Port -port 3002 -maxSeconds 30 | Out-Null
# OJO: siempre abrir "localhost", no 127.0.0.1 — son orígenes distintos para
# el navegador (localStorage separado, datos reales bajo localhost:3002). El
# check de arriba (Wait-Port) sí usa 127.0.0.1 porque es solo una prueba de
# conexión interna, no afecta qué ve el navegador. (Corregido 2026-08-23:
# el cambio anterior a 127.0.0.1 acá abajo hizo que Gino viera su Steel CRM
# "vacío" — mismo riesgo real para los datos de Steel Costos.)
Start-Process "http://localhost:3002"
