FROM node:lts AS builder

WORKDIR /app

COPY package*.json .
COPY pnpm-lock.yaml .

RUN npm i -g pnpm
RUN pnpm install

COPY . .

ENV DATABASE_URL=postgres://root:mysecretpassword@localhost:5432/local
ENV ORIGIN="http://localhost:3000 node build/index.js"
ENV PUBLIC_VAPID_KEY="public_vapid_key"
ENV PRIVATE_VAPID_KEY="private_vapid_key"
ENV PUBLIC_ID_MODEL="mosip"
ENV OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="some_endpoint"
ENV PUBLIC_QR_API="http://localhost:3000"
RUN pnpm run build
RUN pnpm prune --prod

FROM node:lts AS deployer

WORKDIR /app

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "node", "build" ]