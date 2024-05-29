#!/bin/bash

USERNAME=michele.mastrogiovanni@gmail.com
PASSWORD=password
CAMPAIGN=5XM2024
DONOR=1
CAMPAIGN_ID=1

HOSTNAME=https://4give.mastrogiovanni.cloud

TOKEN=$(http POST $HOSTNAME/api/v1/auth/login email=$USERNAME password=$PASSWORD | jq -r .data.token.access_token)

# http -A bearer -a $TOKEN POST $HOSTNAME/api/v1/expense \
#     campaignCode=$CAMPAIGN \
#     amount=10 \
#     currency=EUR \
#     description="Descrizione di spesa" \
#     date="2024-05-19"

http -A bearer -a $TOKEN POST $HOSTNAME/api/v1/donations \
    idDonor=$DONOR \
    idCampaign=$CAMPAIGN_ID \
    amount=60 \
    currency=EUR \
    paymentDate="2024-05-19" \
    mode=BONIFICO
