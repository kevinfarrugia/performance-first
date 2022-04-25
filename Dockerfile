# -- Build Image --
FROM node:16-alpine AS build

# Set a working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY ./package.json .
COPY ./package-lock.json .

# Install Node.js dependencies
RUN npm set-script prepare ""
RUN npm ci --only=production
 

# -- Production Image --
FROM node:16-alpine

# https://engineeringblog.yelp.com/2016/01/dumb-init-an-init-for-docker.html
RUN apk add dumb-init

# Set NODE_ENV env variable to "production"
ENV NODE_ENV production
USER node

# Set a working directory
WORKDIR /usr/src/app

# Copy application files
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node ./build /usr/src/app

# Expose port
EXPOSE 3000

# Run node application
CMD ["dumb-init", "node", "server.js"]
