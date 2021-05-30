#!/bin/sh

while ! pg_isready -d $DATABASE_NAME -h $DATABASE_ADDRESS -p $DATABASE_PORT -U $DATABASE_USER
do
  echo "Connecting to ${DATABASE_ADDRESS} Failed"
  sleep 1
done
npx prisma generate
echo 'Migrating..'
npx prisma db push dev
echo 'Done'
# nodemon src/index.js