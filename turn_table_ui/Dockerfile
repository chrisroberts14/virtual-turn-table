FROM node:20-alpine
WORKDIR /app
COPY package.json .
# Install dependencies
RUN npm install --force
RUN npm i -g serve
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["serve", "-l", "5173", "-s", "dist"]
