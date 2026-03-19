FROM node:20 AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM deps AS development

COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

FROM deps AS test

COPY . .
EXPOSE 3000
CMD ["npm", "run", "test"]

FROM deps AS build

COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:20 AS production

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]