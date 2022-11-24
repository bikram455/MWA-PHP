# Modern Web Applications - Personal Hobby Project

This is a requirement project to be submitted for MWA (Modern Web Applications) as a part of the course. It is a complete application built with **MEAN** stack with working frontend and backend written using **JavaScript** and **TypeScript**. 
**MongoDb** database is the model for the application where the data is stored, the controller is built with **Node JS & Express** and the UI is built with **Angular** framework.

> Make sure to add your changes to the .env file and comment line-1 and uncomment line-2 to change the env config in index.js file in root folder.

> To import the database data following steps must be performed:
```
- extract the database dumpfile
- open command prompt(widows) or terminal(linuc / Mac OS)
- run the mongo shell with command mongosh
- mongorestore dump
```

> To install the dependencies of the project and run, following steps must be performed:
```
- npm run install-all
- npm start
```

> In case you want to run the backend and the frontend separately:
```
- npm run start-frontend
- npm run start-backend
- npm run dev (this runs the backend in case you have nodemon installed on you machine)
```

**APIs in the project**
```
/api/games (get, post)
/api/games/{gameId} (get, put, delete, patch)
/api/games/{gameId}/platforms (get, post)
/api/games/{gameId}/platforms/{platformId} (get, put, delete, patch)
/api/users/login (post)
/api/users/register (post)
```