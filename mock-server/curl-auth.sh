#!/bin/bash

curl -H "Authorization: Bearer $(sh get-token.sh)" http://localhost:8000/projects
