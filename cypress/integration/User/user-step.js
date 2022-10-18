import { Given, And, Then, When } from 'cypress-cucumber-preprocessor/steps';

let globalMethod;
let globalReqBody;
let globalEndPoint;
let singleUserDetails;
let userListDetails;
let newUserDetails;


before(() => {
    cy.fixture('single-user.json').then((data) => {
        singleUserDetails = data;
    });

    cy.fixture('user-list.json').then((data) => {
        userListDetails = data;
    });

    cy.fixture('new-user.json').then((data) => {
        newUserDetails = data;
    });
});

Given('Set the url with {string} endpoint', (apiEndpoint) => {
    globalEndPoint = apiEndpoint;
});

When('Set the api method as {string}', (apiMethod) => {
    globalMethod = apiMethod.toUpperCase();
});

And('Set the request body of new user', () => {
    globalReqBody = newUserDetails.request;
});

Then('Call the USER api for fectching the single user detals and validate its response', () => {
    cy.request({

        method: globalMethod,
        url: globalEndPoint,

    }).then((response) => {

        expect(response.status).to.eq(200);

        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('id');
        expect(response.body.data.id).to.eq(singleUserDetails.data.id);
        expect(response.body.data).to.have.property('email');
        expect(response.body.data.email).to.eq(singleUserDetails.data.email);
        expect(response.body.data).to.have.property('first_name');
        expect(response.body.data.first_name).to.eq(singleUserDetails.data.first_name);
        expect(response.body.data).to.have.property('last_name');
        expect(response.body.data.last_name).to.eq(singleUserDetails.data.last_name);
        expect(response.body.data).to.have.property('avatar');
        expect(response.body.data.avatar).to.eq(singleUserDetails.data.avatar);

        expect(response.body).to.have.property('support');
        expect(response.body.support).to.have.property('url');
        expect(response.body.support.url).to.eq(singleUserDetails.support.url);
        expect(response.body.support).to.have.property('text');
        expect(response.body.support.text).to.eq(singleUserDetails.support.text);

    })
});

Then('Call the USER api for fetching the USER LIST details and validate its response', () => {
    cy.request({

        method: globalMethod,
        url: globalEndPoint,

    }).then((response) => {

        expect(response.status).to.eq(200);

        expect(response.body).to.have.property('page');
        expect(response.body.page).to.eq(userListDetails.page);

        expect(response.body).to.have.property('per_page');
        expect(response.body.per_page).to.eq(userListDetails.per_page);

        expect(response.body).to.have.property('total');
        expect(response.body.total).to.eq(userListDetails.total);

        expect(response.body).to.have.property('total_pages');
        expect(response.body.total_pages).to.eq(userListDetails.total_pages);

        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.a('array');

        expect(response.body).to.have.property('support');
        expect(response.body.support).to.have.property('url');
        expect(response.body.support.url).to.eq(userListDetails.support.url);
        expect(response.body.support).to.have.property('text');
        expect(response.body.support.text).to.eq(userListDetails.support.text);

    })
});

Then('Call the USER api for fetching the INVALID USER details and validate its response', () => {
    cy.request({

        method: globalMethod,
        url: globalEndPoint,
        failOnStatusCode: false,

    }).then((response) => {

        expect(response.status).to.eq(404);

    })
});

Then('Call the USER api for creating the new user and validate its response', () => {
    cy.request({

        method: globalMethod,
        url: globalEndPoint,
        body: globalReqBody

    }).then((response) => {

        expect(response.status).to.eq(201);

        expect(response.body).to.have.property('name');
        expect(response.body.name).to.eq(newUserDetails.response.name);

        expect(response.body).to.have.property('job');
        expect(response.body.job).to.eq(newUserDetails.response.job);

        expect(response.body).to.have.property('id');
        //expect(response.body.id).to.eq(newUserDetails.response.id);

        expect(response.body).to.have.property('createdAt');

    })
});

Then('Call the USER api for updating the new user and validate its response', () => {
    cy.request({

        method: globalMethod,
        url: globalEndPoint,
        body: globalReqBody

    }).then((response) => {

        expect(response.status).to.eq(200);

        expect(response.body).to.have.property('name');
        expect(response.body.name).to.eq(newUserDetails.response.name);

        expect(response.body).to.have.property('job');
        expect(response.body.job).to.eq(newUserDetails.response.job);

        expect(response.body).to.have.property('updatedAt');

    })
});

Then('Call the USER api for deleting the new user and validate its response', () => {
    cy.request({

        method: globalMethod,
        url: globalEndPoint,

    }).then((response) => {
        expect(response.status).to.eq(204);
    })
});