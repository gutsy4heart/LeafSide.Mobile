@echo off
echo ========================================
echo   LeafSide Mobile - Android Runner
echo ========================================
echo.

cd /d "%~dp0"

REM Set JAVA_HOME to Android Studio's bundled JDK
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo [JAVA] Using Android Studio's JDK
java -version 2>&1 | findstr /i "version"
echo.

REM Set Android SDK
if not defined ANDROID_HOME (
    if exist "%LOCALAPPDATA%\Android\Sdk" (
        set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
        set "PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%"
        echo [SDK] Using SDK at: %ANDROID_HOME%
    ) else (
        echo [WARN] ANDROID_HOME not set, trying to continue...
    )
) else (
    echo [SDK] Using SDK at: %ANDROID_HOME%
)
echo.

echo Checking for connected devices...
adb devices 2>nul
echo.

echo Starting Android build...
echo This will take 2-5 minutes on first run
echo.

npm run android

echo.
pause

