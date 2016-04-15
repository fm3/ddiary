Set shell = WScript.CreateObject("WScript.Shell")

Set Processes = GetObject("winmgmts:").InstancesOf("Win32_Process")
intProcessId = ""
For Each Process In Processes
    If StrComp(Process.Name, "FreeStyle Libre.exe", vbTextCompare) = 0 Then
        intProcessId = Process.ProcessId
        Exit For
    End If
Next

If Len(intProcessId) > 0 Then
    shell.AppActivate intProcessId
    WScript.Sleep 700
    shell.SendKeys "%"
    WScript.Sleep 500
    shell.SendKeys "d"
    WScript.Sleep 500
    shell.SendKeys "d"
    WScript.Sleep 800
    shell.SendKeys WScript.Arguments.Item(0)
    shell.SendKeys Date
    shell.SendKeys ".csv"
    WScript.Sleep 100
    shell.SendKeys "{ENTER}"
    WScript.Sleep 200
    shell.SendKeys "{LEFT}"
    WScript.Sleep 100
    shell.SendKeys "{ENTER}"
    WScript.Sleep 1000
    shell.Run "taskkill /f /pid " & intProcessId
End If
