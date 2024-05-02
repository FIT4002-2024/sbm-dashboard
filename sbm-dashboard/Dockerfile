FROM node:19-alpine
WORKDIR /src
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 5173
ENV PORT 5173
CMD ["npm","run","dev"]
