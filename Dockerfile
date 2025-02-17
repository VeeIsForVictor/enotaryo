FROM node:18.18.0-alpine AS builder

WORKDIR /app

COPY package*.json .
COPY pnpm-lock.yaml .

RUN npm i -g pnpm
RUN pnpm install

COPY . .

ENV DATABASE_URL=postgres://root:mysecretpassword@localhost:5432/local
ENV ORIGIN="http://localhost:3000 node build/index.js"
RUN pnpm run build
RUN pnpm prune --prod

FROM node:18.8.0-alpine AS deployer

WORKDIR /app

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "node", "build" ]