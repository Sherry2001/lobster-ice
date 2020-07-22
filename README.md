# lobster-ice
STEP 2020 Capstone Project :) 

### Step 0: Make sure to have or install Node.Js version 10 or above
We recommend using Node Version Manager (nvm): 
- Find instructions here: https://github.com/nvm-sh/nvm

### Step 1: Start Server API Node on Port 8080
Connecting to Our Remote MongoDB Atlas 
- Create a file in ./server named '.env' for credential setup. (Reach out for credential details!)

Connecting to your own MongoDB cluster or local MongoDB
- Navigate to ./server/db/index.js
- Change <code>defaultUri</code> to your own connection key

Start Server
- <code>$ cd ./server</code>
- <code>$ npm install</code>
- <code>$ npm start</code>

### Chrome Extension: Install the Extension in Chrome Developer Mode
- Navigate to chrome://extensions
- Make sure developer mode is toggled 'on'
- Select Load Unpacked 
- Select the ./chrome-extension/ directory

### Web Application: Start React UI Node on Port 3000
- <code>$ cd ./webapp-client</code>
- <code>$ npm install</code>
- <code>$ npm start</code>

### Testing Server API 
- <code>$ cd ./server</code>
- <code>$ npm install</code>
- <code>$ npm test</code>
