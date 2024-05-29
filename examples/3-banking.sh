#!/bin/bash

source .env

# Login
TOKEN=$(http POST $HOSTNAME/api/v1/auth/login email=$DEFAULT_ADMIN_USERNAME password=$DEFAULT_ADMIN_PASSWORD | jq -r .data.token.access_token)

# Get list of italian institutions
http -A bearer -a $TOKEN $HOSTNAME/api/v1/banking/institutions/it
