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



# Start the application with nodemon
CMD ["/usr/local/bin/nodemon", "./src/server.js"]