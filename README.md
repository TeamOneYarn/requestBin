# About

A requestbin clone.

## Built with

- Node.js
- Express
- Handlebars
- MongoDB
- Postgres

## Notes

Based File Structure off of: https://medium.com/@abhijeetgurle/file-structure-of-node-js-and-express-application-4d9fb66c8d68
Found this for handlebars with express: https://www.npmjs.com/package/express-handlebars

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

`ALL '/:path/:subdomain'`
- gets the subdomain from the request sent by a webhook
- updates the `bins` table
- creates a MongoDB document
- updates the `requests` table

## Postgres Schema
`user`: random_string
`bins`: user_id, subdomain
`requests`: bin_id, mongo_id
