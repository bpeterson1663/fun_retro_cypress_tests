describe('Auth', () => {
    describe('Login Functionality', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/login');
        });
        it('should login in when correct email and password are provided',() => {
            cy.get('[type="email"]')
                .type(Cypress.env('LOGIN_USERNAME')).should('have.value', Cypress.env('LOGIN_USERNAME'));
            cy.get('[type="password"]')
                .type(Cypress.env('LOGIN_PASSWORD')).should('have.value', Cypress.env('LOGIN_PASSWORD'));   
            cy.get('[type="submit"]')
                .click();
            cy.location('pathname').should('include', 'retroList');
            cy.get('[data-id="sign_out"]')
                .click();
            cy.location('pathname').should('include', 'login');
        });
        it('should not log in due to wrong password', () => {
            cy.get('[type="email"]')
                .type(Cypress.env('LOGIN_USERNAME')).should('have.value', Cypress.env('LOGIN_USERNAME'));
            cy.get('[type="password"]')
                .type('wrongpassword').should('have.value', 'wrongpassword');
            cy.get('[type="submit"]')
                .click();
            cy.get('[data-id="snackbar-message"]')
                .should('be.visible');
            cy.location('pathname').should('not.include', 'retroList');
        });
        it('should not log in due to no email existing', () => {
            cy.get('[type="email"]')
                .type('wrongemail@email.com').should('have.value', 'wrongemail@email.com');
            cy.get('[type="password"]')
                .type('wrongpassword').should('have.value', 'wrongpassword');
            cy.get('[type="submit"]')
                .click();
            cy.get('[data-id="snackbar-message"]')
                .should('be.visible');
        });
    });
    describe('Retro Id Exists On Log In', () => {
        it('should redirect to retro if id exists after successful login', () => {
            cy.visit('http://localhost:3000/retro/TTnSJO9dYbVJdw2tWjUI');
            cy.get('[type="email"]')
                .type(Cypress.env('LOGIN_USERNAME')).should('have.value', Cypress.env('LOGIN_USERNAME'));
            cy.get('[type="password"]')
                .type(Cypress.env('LOGIN_PASSWORD')).should('have.value', Cypress.env('LOGIN_PASSWORD'));   
            cy.get('[type="submit"]')
                .click();
            cy.location('pathname').should('include', '/retro/TTnSJO9dYbVJdw2tWjUI');
            cy.get('[data-id="sign_out"]')
                .click();
        });
        it('should redirect if id exists on sign up for new user', () => {
            let idToken;
            cy.server();
            cy.visit('http://localhost:3000/retro/TTnSJO9dYbVJdw2tWjUI');
            cy.route('POST', `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${Cypress.env('REACT_APP_STAGE_API_KEY')}`).as('signup');
            cy.get('[data-id="signup_from_login"]')
                .click();
            cy.get('[type="email"]')
                .type('stage1@test.com').should('have.value', 'stage1@test.com');
            cy.get('[type="password"]')
                .type('testing').should('have.value', 'testing');
            cy.get('[type="submit"]')
                .click();  
            cy.wait('@signup')
                .then((xhr) => {
                    idToken = xhr.response.body.idToken;
                    cy.location('pathname').should('include', '/retro/TTnSJO9dYbVJdw2tWjUI');
                    cy.get('[data-id="retro_container"]').should('be.visible');
                    cy.get('[data-id="sign_out"]')
                        .click();
                    cy.request('POST', `https://www.googleapis.com/identitytoolkit/v3/relyingparty/deleteAccount?key=${Cypress.env('REACT_APP_STAGE_API_KEY')}`, {idToken: idToken})
                });
        });
    });
});