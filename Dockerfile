FROM node:16.13-alpine as development

# Set necessary environment variables.
ENV NODE_ENV=development

# Create the working directory, including the node_modules folder and assign ownership to user 'node'
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

# Set the user to use when running this image
# Non privileged mode for better security (this user comes with official NodeJS image).
USER node

# Set the default working directory for the app
WORKDIR /usr/src/app

# Copy package.json, package-lock.json
# Copying this separately prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install dependencies.
RUN npm install 

# Bundle app source
COPY --chown=node:node . ./

# Display directory structure
RUN ls -l

RUN npm run build

FROM node:16.13-alpine as production

# Set necessary environment variables.
ENV NODE_ENV=production

# Create the working directory, including the node_modules folder and assign ownership to user 'node'
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

# Set the user to use when running this image
# Non privileged mode for better security (this user comes with official NodeJS image).
USER node

# Set the default working directory for the app
WORKDIR /usr/src/app

# Copy package.json, package-lock.json
# Copying this separately prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install dependencies.
RUN npm ci --only=production

COPY . .

# Expose API port
EXPOSE 3001 80

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]





