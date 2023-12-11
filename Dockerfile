FROM node:20.9.0
WORKDIR /usr/app
COPY . .
RUN npm i
RUN npm run build
ENV NODE_ENV=production
USER node:node
CMD ["node", "build/index.js"]
