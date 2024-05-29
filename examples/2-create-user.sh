#!/bin/bash

if [ $# -eq 0 ]
then
    echo "You need to specify a username."
    echo "usage: ./2-create-user.sh <username>"
    echo
    echo "It will create <username>@example.com password <username>@123"
    exit 0
fi

USERNAME=$1

source .env

# Login
TOKEN=$(http POST $HOSTNAME/api/v1/auth/login email=$DEFAULT_ADMIN_USERNAME password=$DEFAULT_ADMIN_PASSWORD | jq -r .data.token.access_token)

# Create user
http -A bearer -a $TOKEN PUT $HOSTNAME/api/v1/users \
    name=$USERNAME \
    fullname=$USERNAME \
    platformRole=ADMIN \
    email=$USERNAME@example.com

# Assign password
http -A bearer -a $TOKEN POST $HOSTNAME/api/v1/users/update/password \
    email=$USERNAME@example.com \
    newPassword="$USERNAME@123"
