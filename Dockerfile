FROM node:8-alpine

ENV NODE_ENV=production
ENV PORT=3000

COPY index.js /srv/index.js
COPY package.json /srv/package.json
COPY package-lock.json /srv/package-lock.json
COPY src /srv/src

WORKDIR /srv

RUN npm install
RUN npm cache clean --force

EXPOSE 3000
CMD ["npm", "run", "start"]
