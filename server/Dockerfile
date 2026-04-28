# Multi-stage build for the NestJS API
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY server/package*.json ./server/
COPY web/package*.json ./web/
RUN npm ci
COPY server ./server
RUN npm run build -w server

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY server/package*.json ./server/
COPY web/package*.json ./web/
RUN npm ci --omit=dev --workspaces --include-workspace-root=false
COPY --from=build /app/server/dist ./server/dist
RUN chown -R node:node /app
WORKDIR /app/server
EXPOSE 3000
USER node
CMD ["node", "dist/main.js"]
