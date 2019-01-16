# UAOIoT2.0

#Requisitos previos
Versión Angular (5.2.9)
Versión Angular CLI (7.1.4)
Versión Node (8.9.4 o superior)
Versión Git (2.16.2)
MongoDB (Usar Robo 3T como interfaz gráfica)

#Instalación y ejecución

En netbeans correr el broker para ejecutar UAOIoT.
Importar la base de datos (Debe hacerse asi temporalmente mientras se despliega en el servidor en producción).
Correr el mongod.
Ejecutar el omando npm install en ambas carpetas (api y front-uaoiot).
Ejecutar el comando "npm start" en la carpeta "api" para ejecutar el api. Corre en el puerto 3000.
Ejecutar el comando "npm start" en la carpeta "front-uaoiot" para ejecutar el proyecto de angular. Corre en el puerto 4200.

En los sistemas operativos mac o linux puede arrojar un error de permisos con nodemon, para solucionarlo es neecesario instalar nodemon de forma global con el comando npm install -g nodemon.


