Write-Host "Running load tests..." -ForegroundColor Green

# Create results directory if it doesn't exist
if (-not (Test-Path "results")) {
    New-Item -ItemType Directory -Path "results" | Out-Null
}

# Run Artillery tests if installed
if (Get-Command artillery -ErrorAction SilentlyContinue) {
    Write-Host "Running Artillery load tests..." -ForegroundColor Cyan
    artillery run load-tests/document-processing.yml --output results/document-processing.json
    artillery run load-tests/notifications.yml --output results/notifications.json
} else {
    Write-Host "Artillery not found. Please install with: npm install -g artillery" -ForegroundColor Yellow
    
    # Run basic performance tests with Jest
    Write-Host "Running Jest performance tests instead..." -ForegroundColor Cyan
    npm test -- -t "performance"
}

Write-Host "Load tests completed. Results saved to results/ directory." -ForegroundColor Green