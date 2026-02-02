# Connect to EC2 - Run this from PowerShell
# Replace YOUR_EC2_IP with your actual EC2 public IP

$pemFile = "C:\Users\aryan\Downloads\studybuddy-key.pem"
$ec2User = "ubuntu"
$ec2Ip = "65.2.39.101"

Write-Host "Fixing PEM file permissions..." -ForegroundColor Yellow
icacls $pemFile /inheritance:r /grant:r "$env:USERNAME`:R"

Write-Host "`nConnecting to EC2..." -ForegroundColor Green
ssh -i $pemFile "$ec2User@$ec2Ip"
