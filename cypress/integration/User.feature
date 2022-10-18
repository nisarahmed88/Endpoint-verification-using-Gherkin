Feature: User API Test cases

    Scenario: Validate the GET method for fetching the SINGLE USER details
        Given Set the url with "api/users/2" endpoint
        When  Set the api method as "GET"
        Then  Call the USER api for fectching the single user detals and validate its response


    Scenario: Validate the GET method for fetching the USER LIST details
        Given Set the url with "api/users?page=2" endpoint
        When  Set the api method as "GET"
        Then  Call the USER api for fetching the USER LIST details and validate its response


    Scenario: Validate the GET method for fetching the INVALID USER details
        Given Set the url with "api/users/23" endpoint
        When  Set the api method as "GET"
        Then  Call the USER api for fetching the INVALID USER details and validate its response


    Scenario: Validate the POST method for creating a NEW USER
        Given Set the url with "api/users" endpoint
        When  Set the api method as "POST"
        And   Set the request body of new user
        Then  Call the USER api for creating the new user and validate its response


    Scenario: Validate the PUT method for updating an USER details
        Given Set the url with "api/users/2" endpoint
        When  Set the api method as "PUT"
        And   Set the request body of new user
        Then  Call the USER api for updating the new user and validate its response


    Scenario: Validate the PATCH method for updating an USER details
        Given Set the url with "api/users/2" endpoint
        When  Set the api method as "PATCH"
        And   Set the request body of new user
        Then  Call the USER api for updating the new user and validate its response


    Scenario: Validate the DELETE method for deleting an specific USER
        Given Set the url with "api/users/2" endpoint
        When  Set the api method as "DELETE"
        Then  Call the USER api for deleting the new user and validate its response

