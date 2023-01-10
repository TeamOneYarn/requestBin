# About

A requestbin clone.

## Built with

- Node.js
- Express
- Handlebars
- MongoDB
- Postgres

## Routes
`GET '/'`
- creates a `random_string` unique to the user
- updates the `users` table
- sets path to random_string
- redirects the user to /:path

`GET '/:path'`
- gets all requests that belong to the user and display

`POST '/create/:path'`
- creates a subdomain
- updates the `bins` table
- redirects to /:path 

`POST '/:path/:subdomain'`
- gets the subdomain from the request sent by a webhook
- updates the `bins` table
- creates a MongoDB document
- updates the `requests` table

## Postgres Schema
- `user`: random_string
- `bins`: user_id, subdomain
- `requests`: bin_id, mongo_id

# Future Improvements
- update last_updated column in bins when a request comes in
- change the app.post "/:path/:subdomain" route to app.all()
- change then/catch to async/await
- try subdomains instead of paths
- modularize the code
  - refactor routes
  - move to separate files
