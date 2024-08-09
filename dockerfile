# Use Node 16 alpine as parent image
FROM node:16-alpine

# Change the working directory on the Docker image to /app
WORKDIR /app

# Copy package.json and package-lock.json to the /app directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally
RUN npm install nodemon -g

# Copy the rest of project files into this image
COPY ./ ./

# Expose application port (if your application needs to listen on a specific port)
EXPOSE 3003

ENV OPENAI_API_KEY=sk-proj-FBGg59SZGmkSgepnGZDkT3BlbkFJYQ5dfvP75ANHA3AVVjiI
ENV GOOGLE_CLIENT_ID=80008343721-f31q74n23gl9crvcmbk6vteib75bku4j.apps.googleusercontent.com
ENV AWS_BUCKET = controllerandrecommender
ENV ACCESS_KEY_ID =  AKIAWGGD2XTNEEFXJGG2
ENV JWT_SECRET = controller
ENV SECRET_ACCESS_KEY = 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
ENV REGION = us-east-1

# Start the application with nodemon
CMD ["/usr/local/bin/nodemon", "./src/server.js"]