@echo off

call versions.bat

set /p deploy_path="Enter the path where you want to deploy [C:\StudentsDataBase]: "
if "%deploy_path%"=="" set deploy_path=C:\StudentsDataBase

echo %deploy_path%> %TEMP%\deploy_path
tools\sed "s|\\\|\\\/|g" %TEMP%\deploy_path > %TEMP%\deploy_path_unix
set /p deploy_path_unix=<%TEMP%\deploy_path_unix
del %TEMP%\deploy_path
del %TEMP%\deploy_path_unix

IF NOT EXIST "%deploy_path%" GoTo deploy
:ask_remove
set /p ch="The directory %deploy_path% already exists, do you want to replace it ? (y/n)"
IF "%ch%"=="y" GoTo remove
IF "%ch%"=="n" GoTo end
echo I did not understand your choice. Please enter y for yes, or n for no
GoTo ask_remove

:remove
rmdir /S /Q "%deploy_path%"

:deploy
set /p web_port="Enter the port number that will be used by Web Server [80]: "
if "%web_port%"=="" set web_port=80
echo ---
echo Creating directories
mkdir %deploy_path%
mkdir %deploy_path%\tmp
mkdir %deploy_path%\php_uploads
mkdir %deploy_path%\php_sessions
mkdir %deploy_path%\server
mkdir %deploy_path%\database
mkdir %deploy_path%\www
mkdir %deploy_path%\log

echo Copying files
xcopy /E /Q "server" "%deploy_path%"\server
xcopy /E /Q "server\mysql_%mysql_version%\default_data" "%deploy_path%"\database
copy start.bat "%deploy_path%"
copy versions.bat "%deploy_path%"
copy stop.bat "%deploy_path%"

echo Configuring server
REM httpd.conf
set conf_file="%deploy_path%\server\apache_%apache_version%\conf\httpd.conf"
tools\sed "s/%%DEPLOY_PATH%%/%deploy_path_unix%/g" %conf_file% > "%TEMP%\pn_deploy_conf"
copy /Y "%TEMP%\pn_deploy_conf" %conf_file%
tools\sed "s/%%APACHE_PATH%%/%deploy_path_unix%\/server\/apache_%apache_version%/g" %conf_file% > "%TEMP%\pn_deploy_conf"
copy /Y "%TEMP%\pn_deploy_conf" %conf_file%
tools\sed "s/%%PHP_PATH%%/%deploy_path_unix%\/server\/php_%php_version%/g" %conf_file% > "%TEMP%\pn_deploy_conf"
copy /Y "%TEMP%\pn_deploy_conf" %conf_file%
tools\sed "s/%%PHPMYADMIN_PATH%%/%deploy_path_unix%\/server\/phpMyAdmin_%phpmyadmin_version%/g" %conf_file% > "%TEMP%\pn_deploy_conf"
copy /Y "%TEMP%\pn_deploy_conf" %conf_file%
tools\sed "s/%%WEB_PORT%%/%web_port%/g" %conf_file% > "%TEMP%\pn_deploy_conf"
copy /Y "%TEMP%\pn_deploy_conf" %conf_file%
REM php.ini
set conf_file="%deploy_path%\server\php_%php_version%\php.ini"
tools\sed "s/%%DEPLOY_PATH%%/%deploy_path_unix%/g" %conf_file% > "%TEMP%\pn_deploy_conf"
copy /Y "%TEMP%\pn_deploy_conf" %conf_file%
tools\sed "s/%%APACHE_PATH%%/%deploy_path_unix%\/server\/apache_%apache_version%/g" %conf_file% > "%TEMP%\pn_deploy_conf"
copy /Y "%TEMP%\pn_deploy_conf" %conf_file%
tools\sed "s/%%PHP_PATH%%/%deploy_path_unix%\/server\/php_%php_version%/g" %conf_file% > "%TEMP%\pn_deploy_conf"
copy /Y "%TEMP%\pn_deploy_conf" %conf_file%
tools\sed "s/%%PHPMYADMIN_PATH%%/%deploy_path_unix%\/server\/phpMyAdmin_%phpmyadmin_version%/g" %conf_file% > "%TEMP%\pn_deploy_conf"
copy /Y "%TEMP%\pn_deploy_conf" %conf_file%
tools\sed "s/%%WEB_PORT%%/%web_port%/g" %conf_file% > "%TEMP%\pn_deploy_conf"
copy /Y "%TEMP%\pn_deploy_conf" %conf_file%

:end
pause
