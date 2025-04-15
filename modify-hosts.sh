#!/bin/bash

# Use the environment variables for IP and domain
if [ -z "$HOST_IP" ] || [ -z "$HOST_DOMAIN" ]; then
  echo "HOST_IP or HOST_DOMAIN not set. Using defaults."
  HOST_IP="20.123.195.16"
  HOST_DOMAIN="cd.mom.dev"
fi

# Add entry to /etc/hosts
echo "$HOST_IP    $HOST_DOMAIN" >> /etc/hosts

# Execute the command passed to the container (your app or npm start command)
exec "$@"
