@echo off
REM Script to push giridhar_bragboard project to GitHub Group--2 branch

echo Step 1: Navigate to your parent folder
cd /d "C:\Users\lenovo\Downloads"
if %errorlevel% neq 0 (
    echo Error: Could not navigate to parent folder
    pause
    exit /b 1
)

echo Step 2: Clone the GitHub repository
git clone https://github.com/springboardmentorx5768/Project-2.git
if %errorlevel% neq 0 (
    echo Error: Could not clone repository
    pause
    exit /b 1
)

echo Step 3: Switch to the Group--2 branch
cd Project-2
git fetch origin
git checkout Group--2
if %errorlevel% neq 0 (
    echo Trying to create and checkout Group--2 branch
    git checkout -b Group--2 origin/Group--2
    if %errorlevel% neq 0 (
        echo Error: Could not checkout Group--2 branch
        pause
        exit /b 1
    )
)

echo Step 4: Move your project folder into the repository
move "C:\Users\lenovo\Downloads\giridhar_bragboard-main" "giridhar_bragboard"
if %errorlevel% neq 0 (
    echo Error: Could not move project folder
    pause
    exit /b 1
)

echo Step 5: Stage and commit your project
git add giridhar_bragboard
git commit -m "Add giridhar_bragboard project"
if %errorlevel% neq 0 (
    echo Error: Could not commit changes
    pause
    exit /b 1
)

echo Step 6: Pull latest changes from Group--2
git pull origin Group--2 --rebase
if %errorlevel% neq 0 (
    echo Error: Could not pull and rebase
    echo Please resolve conflicts manually
    pause
    exit /b 1
)

echo Step 7: Push your changes to GitHub
git push origin Group--2
if %errorlevel% neq 0 (
    echo Error: Could not push to GitHub
    pause
    exit /b 1
)

echo Step 8: Confirm the push
git status

echo All steps completed successfully!
pause
