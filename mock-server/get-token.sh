curl -s --header "Content-Type: application/json" \
      --request POST \
      --data '{"email":"admin","password":"AdminAdmin"}' \
      http://localhost:8000/auth/login | jq -r '.access_token'
