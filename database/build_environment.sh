#!/bin/bash

# for d in ./*/ ; do (

  service=${PWD##*/}
  echo
  echo "Entering $service.."
  # cd "$service"
  
  BUILD=false

  if test -f ".hash"; then
    OLD_HASH=$(cat .hash)
    echo "Latest hash is: $OLD_HASH"
    rm .hash
  fi

  HASH=$(tar --mtime='1970-01-01' -cf - ./ | md5sum | awk '{print $1}')
  echo "Directory hash is: $HASH"

  if [ "$HASH" == "$OLD_HASH" ]; then
    echo "Hashes match, no need to build."
  else
    BUILD=true
  fi

  if $BUILD; then
    # service=backend-$(echo $d | tr -d './')
    echo "Deleting old image ($service).."
    
    # if test -f "./db.dockerfile"; then 
    #   # docker build --no-cache -t backend-database-authentication -f ./db.dockerfile .
    #   docker rm $service-db
    # fi
    
    # docker build --no-cache -t backend-service-authentication -f $d/service.dockerfile .
    # docker rmi $service
    set -e
    docker rm -f $(docker ps -a -q --filter="ancestor=$service") 2>&- || echo "Found no containers for $service"
    docker rmi $service || echo "Image $service not found"
    set +e

    docker build --no-cache -t $service .
  fi
  echo $HASH > .hash

  echo
# );
# done
