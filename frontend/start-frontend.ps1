$NodeHome = "C:\Program Files\nodejs"
$env:Path = "$NodeHome;" + $env:Path

Set-Location -Path $PSScriptRoot

# Wait for the network stack to be ready after boot before binding a port.
Start-Sleep -Seconds 10

& "$NodeHome\npm.cmd" run dev -- --host *> "frontend.run.log"
