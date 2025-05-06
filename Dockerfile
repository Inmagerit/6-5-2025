FROM node:20.11.0-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install && npm run build

FROM node:20.11.0-alpine

WORKDIR /app

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public

COPY --from=builder /app/next.config.mjs .
COPY --from=builder /app/package.json .

RUN yarn install --production

CMD [ "npm", "run", "start:prod" ]