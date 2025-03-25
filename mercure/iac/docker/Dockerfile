# Use the official Node.js image from Docker Hub
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Install curl and dependencies
RUN apk add --no-cache curl

COPY . .

# Install dependencies inside the container
RUN npm install

RUN npm run build

# Define build arguments with default values
ARG NODE_ENV=prod
ARG START_COMMAND=start:prod

# Set environment variables
ENV NODE_ENV=${NODE_ENV}

# Expose the application port
EXPOSE 3000

# Use the shell form of CMD to allow variable expansion
CMD ["tail", "-f", "/dev/null"]