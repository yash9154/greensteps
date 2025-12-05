@echo off
REM JWT Secret Token Generator for Windows
REM Generates secure random tokens for JWT secrets

echo.
echo 🔐 Generating JWT Secret Tokens...
echo.

REM Run the Node.js script
node "%~dp0generate-jwt-secrets.js"

if %errorlevel% equ 0 (
    echo.
    echo ✅ JWT secrets generated successfully!
    echo.
    echo 📋 Next steps:
    echo    1. Check your .env file in the backend folder
    echo    2. JWT_ACCESS_SECRET and JWT_REFRESH_SECRET should be updated
    echo    3. Restart your backend server
    echo.
) else (
    echo.
    echo ❌ Error generating secrets
    echo Make sure you're in the backend directory
    echo.
)

pause
