FROM node:lts-alpine

ARG VUE_APP_NEWSGEARS_API_URL
ARG VUE_APP_NEWSGEARS_ORIGIN_URL
ARG VUE_APP_NEWSGEARS_BROKER_URL

ENV VUE_APP_NEWSGEARS_API_URL ${VUE_APP_NEWSGEARS_API_URL}
ENV VUE_APP_NEWSGEARS_ORIGIN_URL ${VUE_APP_NEWSGEARS_ORIGIN_URL}
ENV VUE_APP_NEWSGEARS_BROKER_URL ${VUE_APP_NEWSGEARS_BROKER_URL}

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for dev 
RUN npm run devbuild

EXPOSE 3000
CMD [ "npm", "run", "devserve" ]
