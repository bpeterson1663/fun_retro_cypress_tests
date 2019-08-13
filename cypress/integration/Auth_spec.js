describe('Auth', () => {
    describe('Login Functionality', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/login');
        });
        it('should login in when correct email and password are provided',() => {
            cy.login(Cypress.env('LOGIN_USERNAME'), Cypress.env('LOGIN_PASSWORD'));
            cy.location('pathname').should('include', 'retroList');
            cy.get('[data-id="sign_out"]')
                .click();
            cy.location('pathname').should('include', 'login');
        });
        it('should not log in due to wrong password', () => {
            cy.login(Cypress.env('LOGIN_USERNAME'), 'wrongpassword');
            cy.get('[data-id="snackbar_message"]')
                .should('be.visible');
            cy.location('pathname').should('not.include', 'retroList');
        });
        it('should not log in due to no email existing', () => {
            cy.login('wrongemail@email.com', 'wrongpassword');
            cy.get('[data-id="snackbar_message"]')
                .should('be.visible');
            cy.get('[data-id="snackbar_content"]', (el) => {
                el.to.have.css('background-coloor', '#d32f2f');
            });
        });
    });
    describe('Sign Up Functionality', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000/signup');
        });
        it('should signup a new user successfully', () => {
            let idToken;
            cy.server();
            cy.route('POST', `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${Cypress.env('REACT_APP_STAGE_API_KEY')}`)
                .as('signup');
            cy.signup('stage2@test.com', 'testing');
            cy.wait('@signup')
                .then((xhr) => {
                    idToken = xhr.response.body.idToken;
                    cy.location('pathname').should('include', '/retroList');
                    cy.get('[data-id="admin_container"]').should('be.visible');
                    cy.get('[data-id="sign_out"]')
                        .click();
                    cy.request('POST', `https://www.googleapis.com/identitytoolkit/v3/relyingparty/deleteAccount?key=${Cypress.env('REACT_APP_STAGE_API_KEY')}`, {idToken: idToken})
                });
        });
        it('should not create a new user successfully if user exists', () => {
            cy.signup(Cypress.env('LOGIN_USERNAME'), 'testing');
            cy.get('[data-id="snackbar_message"]')
                .should('be.visible')
            cy.get('[data-id="snackbar_content"]', (el) => {
                el.to.have.css('background-coloor', '#d32f2f');
            });
        });
    });
    describe('Retro Id Exists On Log In', () => {
        it('should redirect to retro if id exists after successful login', () => {
            cy.visit('http://localhost:3000/retro/TTnSJO9dYbVJdw2tWjUI');
            cy.login(Cypress.env('LOGIN_USERNAME'), Cypress.env('LOGIN_PASSWORD'));

            cy.location('pathname').should('include', '/retro/TTnSJO9dYbVJdw2tWjUI');
            cy.get('[data-id="sign_out"]')
                .click();
        });
        it('should redirect if id exists on sign up for new user', () => {
            let idToken;
            cy.server();
            cy.visit('http://localhost:3000/retro/TTnSJO9dYbVJdw2tWjUI');
            cy.route('POST', `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${Cypress.env('REACT_APP_STAGE_API_KEY')}`)
                .as('signup');
            cy.get('[data-id="signup_from_login"]')
                .click(); 
            cy.login('stage1@test.com', 'testing');
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