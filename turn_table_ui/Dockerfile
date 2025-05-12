# Two stage build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
# Install dependencies
RUN npm install
COPY . .
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist /app/dist
RUN npm i -g serve
EXPOSE 5173
CMD ["serve", "-l", "5173", "-s", "dist"]
