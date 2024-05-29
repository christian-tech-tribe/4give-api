#!/bin/bash

source .env

# Login
TOKEN=$(http POST $HOSTNAME/api/v1/auth/login email=$DEFAULT_ADMIN_USERNAME password=$DEFAULT_ADMIN_PASSWORD | jq -r .data.token.access_token)

# Find all donors
DONORS=$(http -A bearer -a $TOKEN -f get $HOSTNAME/api/v1/donors)

FIRST_DONOR=$(echo $DONORS | jq .data[0])
ID_DONOR=$(echo $FIRST_DONOR | jq -r .id)

NOTE=$(http -A bearer -a $TOKEN POST $HOSTNAME/api/v1/note \
    idDonor=$ID_DONOR \
    text="E fa tutto secondo costume")
echo $NOTE | jq .
