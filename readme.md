# Rudimentary forum using MongoDB

Express-based server to run a basic forum with upload capabilities for both posts and comments.
Includes the following npm scripts:
```
npm build
npm prestart
npm start
npm test
npm install
npm uninstall
npm reinstall
```
The last of these simply calls uninstall followed by install. Must be run using
```
npm run-script reinstall
```

Due to the assignment requirement of not using an account system, all posts are attributed to one of fifteen endangered animals. Clicking them links to their Wikipedia page. Because I thought it was funny.
Currently set up to use a local database, but has a commented out line to use the proper one.

initAnimalDB.txt doesn't actually do anything, it's just so I can copy and paste into the command line to initialize the relevant database as needed.
I could probably do something with it, but it's 5 am and my brain cells are rapidly dying.
