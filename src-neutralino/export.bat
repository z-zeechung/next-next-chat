rd /s /q "src-neutralino\static"

mkdir "src-neutralino\static"

xcopy "artifacts\static" "src-neutralino\static" /s /e /y

copy "src-neutralino\frame\*" "src-neutralino\static"

cd src-neutralino

cmd /c "neu build"

cd ..

rd /s /q "artifacts\win64"

mkdir "artifacts\win64"

copy "src-neutralino\dist\neutralino\neutralino-win_x64.exe" "artifacts\win64\neutralino-win_x64.exe" /y

copy "src-neutralino\dist\neutralino\resources.neu" "artifacts\win64\resources.neu" /y