FROM --platform=linux/amd64 registry.access.redhat.com/ubi8/nodejs-18 AS build
COPY --chown=1001:0 package.json package-lock.json ./
RUN npm ci
COPY --chown=1001:0 . .
ENV NODE_ENV production
RUN npx prisma generate
RUN npm run build

FROM --platform=linux/amd64 registry.access.redhat.com/ubi8/nodejs-18
COPY --chown=1001:0 --from=build /opt/app-root/src/node_modules ./node_modules
COPY --chown=1001:0 --from=build /opt/app-root/src/assets ./assets
COPY --chown=1001:0 --from=build /opt/app-root/src/dist ./dist

ENV POI_PARKS_AUTO_LOAD=true
ENV POI_PARKS_FILE=assets/nationalparks.json
ENV POI_PARKS_RESOURCE_INFO='{"id":"poi-backend","displayName":"National Parks","coordinates":{"lat":0.0,"lng":0.0},"zoom":3}'
ENV DATABASE_URL="postgresql://nestjs:nestjs@pgdb:5432/pois?schema=public"

EXPOSE 3000
CMD ["node", "dist/main.js"]
