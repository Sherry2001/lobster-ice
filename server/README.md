### Step 0: Make sure to have or install Node.Js version 10 or above
We recommend using Node Version Manager (nvm):
- Find instructions here: https://github.com/nvm-sh/nvm

### Start Server API Node on Port 8080
Connecting to Our Remote MongoDB Atlas
- Create a file in ./server named '.env' for credential setup. (Reach out for credential details!)

Connecting to your own MongoDB cluster or local MongoDB
- Navigate to ./server/db/index.js
- Change defaultUri to your own connection key

Start Server
- $ cd ./server
- $ npm install
- $ npm start

### Testing Server API
- $ cd ./server
- $ npm install
- $ npm test
