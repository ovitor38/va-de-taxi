# Base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy the application code
COPY . .

# Copy the .env file
COPY .env .env

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 8080

# Command to run the application
CMD ["npm", "run", "start:prod"]
