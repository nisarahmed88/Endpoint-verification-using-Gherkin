import { Given, And, Then, When } from 'cypress-cucumber-preprocessor/steps';

let globalMethod;
let globalReqBody;
let globalEndPoint;
let validRegister;
let invalidRegister;


before(() => {
    cy.fixture('register-invalid-payload.json').then((data) => {
        invalidRegister = data;
    });

    cy.fixture('register-valid-payload.json').then((data) => {
        validRegister = data;
    });
});

Given('Set the url with {string} endpoint', (apiEndpoint) => {
    globalEndPoint = apiEndpoint;
});

When('Set the api method as {string}', (apiMethod) => {
    globalMethod = apiMethod.toUpperCase();
});

And('Set the valid register request body from the fixture', () => {
    globalReqBody = validRegister.request;
});

And('Set the invalid register request body from the fixture', () => {
    globalReqBody = invalidRegister.request;
});

And('Call the register api with valid credentials and then validate its response', () => {
    cy.request({

        method: globalMethod,
        url: globalEndPoint,
        body: globalReqBody

    }).then((registerResponse) => {

        expect(registerResponse.status).to.eq(200);
        expect(registerResponse.body).to.have.property('token');
        expect(registerResponse.body).to.have.property('id');
        expect(registerResponse.body.token).to.eq(validRegister.response.token);

    })
});

And('Call the register api with invalid request body and then validate its response', () => {
    cy.request({

        method: 'POST',
        url: 'api/register',
        failOnStatusCode: false,
        body: invalidRegister.request

    }).then((registerResponse) => {

        expect(registerResponse.status).to.eq(400);
        expect(registerResponse.body).to.have.property('error');
        expect(registerResponse.body.error).to.eq(invalidRegister.response.error);
    })
});