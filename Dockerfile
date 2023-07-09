FROM node:latest

RUN apt-get -y update
RUN apt-get install -y xsel

# set working directory
WORKDIR /app

# Copies package.json and package-lock.json to Docker environment
COPY package*.json ./

# Installs all node packages
RUN npm install --force 

# Copies everything over to Docker environment
COPY . .

# Build for production.
RUN npm run build --production

# Install `serve` to run the application.
RUN npm install -g serve

RUN rm -rf node_modules
RUN rm -rf src

# Uses port which is used by the actual application
#EXPOSE 3000

CMD serve -s dist/

