Feature: Login API Test cases

    Scenario: Validate the login API response with valid credentials
        Given Set the url with "api/login" endpoint
        When  Set the api method as "POST"
        And   Set the valid login request body from the fixture
        Then  Call the login api with valid credentials and then validate its response


    Scenario: Validate the login API response with wrong credentials
        Given Set the url with "api/login" endpoint
        When  Set the api method as "POST"
        And   Set the invalid login request body from the fixture
        Then  Call the login api with invalid request body and then validate its response