In this project called "Vidly-JS" I implement API for movies.

To run application:

1. set jwtPrivateKey in terminal: $env:vidly_jwtPrivateKey = 'password'
2. set environment (if needed) $env:NODE_ENV = "test"
3. run node index.js
4. command for connecting to heroku:
   heroku --% config:set VIDLY_DB="mongodb+srv://kkatalz:stitchIsCute02@cluster0.x1hjenc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
5. restart:          heroku ps:restart