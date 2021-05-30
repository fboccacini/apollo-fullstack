#!/bin/bash

for d in ./*/ ; do (
  echo
  echo "Entering $d.."
  cd "$d"
  project=apollo-fullstack
  service=${PWD##*/}
  echo
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
    echo "Deleting old image ($service).."
    
    set -e 
    docker rm -f $(docker ps -a -q --filter="ancestor=${project}_$service") 2>&- || echo "Found no containers for ${project}_$service"
    docker rmi ${project}_$service || echo "Image ${project}_$service not found"
    set +e

  fi
  echo $HASH > .hash

  echo
);
done

docker-compose up