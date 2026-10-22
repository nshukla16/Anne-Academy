FROM node:20-alpine AS dev
WORKDIR /app
COPY package.json .npmrc ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
