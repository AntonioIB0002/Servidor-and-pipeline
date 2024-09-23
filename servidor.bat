@echo off


:: Ejecutar nodemon con ts-node
echo Ejecutando nodemon...
::start nodemon --watch src --exec ts-node dist/servidor.js

:: Iniciar ngrok en el puerto 3000
echo Iniciando ngrok...
start ngrok http --domain=mature-visually-mole.ngrok-free.app 3000 

echo Servidor corriendo. Presiona cualquier tecla para salir.
pause
