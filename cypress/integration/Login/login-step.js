import { Given, And, Then, When } from 'cypress-cucumber-preprocessor/steps';

let globalMethod;
let globalReqBody;
let globalEndPoint;
let validLogin;
let invalidLogin;


before(() => {
    cy.fixture('login-invalid-payload.json').then((data) => {
        invalidLogin = data;
    });

    cy.fixture('login-valid-payload.json').then((data) => {
        validLogin = data;
    });
});

Given('Set the url with {string} endpoint', (apiEndpoint) => {
    globalEndPoint = apiEndpoint;
});

When('Set the api method as {string}', (apiMethod) => {
    globalMethod = apiMethod.toUpperCase();
});

And('Set the valid login request body from the fixture', () => {
    globalReqBody = validLogin.request;
});

And('Set the invalid login request body from the fixture', () => {
    globalReqBody = invalidLogin.request;
});

And('Call the login api with valid credentials and then validate its response', () => {
    cy.request({

        method: globalMethod,
        url: globalEndPoint,
        body: globalReqBody

    }).then((loginResponse) => {

        expect(loginResponse.status).to.eq(200);
        expect(loginResponse.body).to.have.property('token');
        expect(loginResponse.body.token).to.eq(validLogin.response.token);

    })
});

And('Call the login api with invalid request body and then validate its response', () => {
    cy.request({

        method: 'POST',
        url: 'api/login',
        failOnStatusCode: false,
        body: invalidLogin.request

    }).then((loginResponse) => {

        expect(loginResponse.status).to.eq(400);
        expect(loginResponse.body).to.have.property('error');
        expect(loginResponse.body.error).to.eq(invalidLogin.response.error);
    })
});