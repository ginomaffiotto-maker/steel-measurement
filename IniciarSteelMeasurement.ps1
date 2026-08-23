# IniciarSteelMeasurement.ps1
# Mismo patrón que IniciarSteelCRM.ps1 (steelCRM) — evita el flash de consola
# que sí aparece al invocar el .bat directo desde WScript.Shell.Run.

$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $dir

# CreateNoWindow=true evita que la consola llegue a crearse (no es lo mismo
# que crearla y ocultarla, que es lo que hacía Start-Process -WindowStyle
# Hidden y seguía dando un parpadeo visible).
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "cmd.exe"
$psi.Arguments = '/c "Iniciar Steel Measurement.bat"'
$psi.WorkingDirectory = $dir
$psi.CreateNoWindow = $true
$psi.UseShellExecute = $false
[System.Diagnostics.Process]::Start($psi) | Out-Null

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
# el cambio anterior a 127.0.0.1 acá abajo hizo que Gino viera su steelCRM
# "vacío" — mismo riesgo real para los datos de Steel Measurement.)
Start-Process "http://localhost:3002"
