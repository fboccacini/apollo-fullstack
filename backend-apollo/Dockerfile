
FROM mhart/alpine-node:10

RUN apk add postgresql-client
# Working directory
RUN mkdir -p /var/www
WORKDIR /var/www

# Copy everything
COPY . .

# Install dependencies
RUN yarn install
# RUN npx prisma generate
# Build client
#RUN yarn build

EXPOSE 4000

# Start Server
CMD yarn run migrate:dev && yarn start