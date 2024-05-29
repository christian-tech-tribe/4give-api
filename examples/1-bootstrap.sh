#!/bin/bash

if [ $# -eq 0 ]
then
    echo "You need to specify a donors excel file (Give)."
    echo "usage: ./1-bootstrap.sh <donors-file.xls>"
    echo
    echo "It will import all donors"
    exit 0
fi

DONORS_FILE=$1

source .env

# Login
TOKEN=$(http POST $HOSTNAME/api/v1/auth/login email=$DEFAULT_ADMIN_USERNAME password=$DEFAULT_ADMIN_PASSWORD | jq -r .data.token.access_token)

# Load donors
http -A bearer -a $TOKEN -f post $HOSTNAME/api/v1/donors/upload file@"$DONORS_FILE"
