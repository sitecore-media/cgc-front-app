# Stage 1: Build the Angular app
FROM node:23 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm cache clean --force  
RUN rm -rf node_modules package-lock.json
RUN npm install --save @types/babel__traverse --legacy-peer-deps
RUN npm install --save @babel/helper-string-parser --legacy-peer-deps
RUN npm install --save @sitecore-cloudsdk/events --legacy-peer-deps

RUN npm install --legacy-peer-deps
RUN npm install -g @angular/cli
# Copy the Angular project files
COPY . .

# Build the Angular app using Sitecore CLI
#RUN npx @sitecore-jss/sitecore-jss-cli build
RUN  ng build
# Stage 2: Serve the app with NGINX
FROM nginx:alpine

# Set default environment variables (can be overridden at runtime)
ENV HOST_IP=20.123.195.16
ENV HOST_DOMAIN=cd.mom.dev

# Copy the built app from the build stage
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Remove default NGINX configuration and add a custom one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Copy the entrypoint script to a specific directory
COPY modify-hosts.sh /usr/local/bin/modify-hosts.sh

# Set the working directory explicitly
WORKDIR /usr/local/bin

# Make the script executable
RUN chmod +x modify-hosts.sh


# Expose port 80
EXPOSE 80

# ENTRYPOINT for the shell script
ENTRYPOINT ["sh", "/usr/local/bin/modify-hosts.sh"]

# CMD for starting NGINX
CMD ["nginx", "-g", "daemon off;"]
