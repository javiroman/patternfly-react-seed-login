curl -s --header "Content-Type: application/json" \
      --request POST \
      --data '{"email":"user01@email.com","password":"user01"}' \
      http://localhost:8000/auth/login | jq -r '.access_token'
