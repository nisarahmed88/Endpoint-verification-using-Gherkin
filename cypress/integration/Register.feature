Feature: Register API Test cases

    Scenario: Validate the register API response with valid credentials
        Given Set the url with "api/register" endpoint
        When  Set the api method as "POST"
        And   Set the valid register request body from the fixture
        Then  Call the register api with valid credentials and then validate its response


    Scenario: Validate the register API response with wrong credentials
        Given Set the url with "api/register" endpoint
        When  Set the api method as "POST"
        And   Set the invalid register request body from the fixture
        Then  Call the register api with invalid request body and then validate its response