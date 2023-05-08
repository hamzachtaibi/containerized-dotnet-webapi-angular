
#====== Stage 1 ================================

FROM node:18.14.2-alpine3.17 as build
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# Copy package.json to the container
COPY package*.json /app/
# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . /app/
# Build the application
RUN npm run build

#====== Stage 2 Server ================================
FROM nginx:alpine
# Copy the built application files to the nginx root directory
COPY --from=build /app/dist/web-app /usr/share/nginx/html/
#Copy our config 
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]