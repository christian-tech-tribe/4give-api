#!/bin/bash

source version

docker build . -t mastrogiovanni/4give-api:$VERSION
docker push mastrogiovanni/4give-api:$VERSION
