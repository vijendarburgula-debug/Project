$JavaHome = "C:\Program Files\Microsoft\jdk-17.0.20.8-hotspot"
$env:JAVA_HOME = $JavaHome
$env:Path = "$JavaHome\bin;" + $env:Path

Set-Location -Path $PSScriptRoot

# Wait for the network stack to be ready after boot before binding a port.
Start-Sleep -Seconds 10

& "$JavaHome\bin\java.exe" -jar "target\postman-helper-1.0.0.jar" *> "backend.run.log"
