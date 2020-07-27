FROM node:12-alpine

# Set a working directory
WORKDIR /usr/src/app

COPY ./package.json .
COPY ./package-lock.json .

# Install Node.js dependencies
RUN npm ci --only=production

# Copy application files
COPY ./build .

# Set permissions for "node" user
RUN chown -R node:node /usr/src/app
RUN chmod 755 /usr/src/app

# Run the container under "node" user by default
USER node

# Set NODE_ENV env variable to "production"
ENV NODE_ENV production

EXPOSE 3000

CMD [ "node", "server" ]


