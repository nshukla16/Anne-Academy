FROM node:20-alpine AS dev
WORKDIR /app
COPY package.json .npmrc ./
# Retry the install a few times: the npm registry occasionally resets connections.
RUN npm install || (sleep 10 && npm install) || (sleep 20 && npm install)
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
