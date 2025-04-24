@echo off
echo Running load tests...

if not exist "results" mkdir results

echo Document Processing Load Test
k6 run load-tests/document-processing.js --out json=results/document-processing.json

echo Notification System Load Test
k6 run load-tests/notifications.js --out json=results/notifications.json

echo Load tests completed. Results saved to results/ directory.