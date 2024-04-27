FROM node:19-alpine
WORKDIR /src
COPY package*.json .
RUN npm install vite
RUN npm install express
RUN npm install typescript -g

RUN npm install
COPY . .
RUN tsc
EXPOSE 5173
ENV PORT 5173
CMD ["npm","run","dev"]
