$apiKey = "AIzaSyDKqJgOpQD9yFY936Kdo3zTKejvwGLxvvg"
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$apiKey"
$body = @{
    contents = @(
        @{
            parts = @(
                @{ text = "Hello" }
            )
        }
    )
} | ConvertTo-Json -Depth 5

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    Write-Host "Success!"
    Write-Host $response.candidates[0].content.parts[0].text
} catch {
    Write-Host "Error:"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host $reader.ReadToEnd()
    }
}
