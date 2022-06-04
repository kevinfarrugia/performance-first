# -- Build Image --
FROM node:16-alpine AS build

# Set a working directory
WORKDIR /usr/src/app

# Copy the entire source
COPY . .

# Install Node.js dependencies
RUN npm ci

# Build the application
RUN npm run build -- --release


# -- Production Image --
FROM node:16-alpine

# https://engineeringblog.yelp.com/2016/01/dumb-init-an-init-for-docker.html
RUN apk add dumb-init

# Set NODE_ENV env variable to "production"
ENV NODE_ENV production
USER node

# Set a working directory
WORKDIR /usr/src/app/build

# Copy application files
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=build /usr/src/app/build /usr/src/app/build

# Expose port
EXPOSE 3000

# Run node application
CMD ["dumb-init", "node", "server.js"]
