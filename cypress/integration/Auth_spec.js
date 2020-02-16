const SNACKBAR_MESSAGE = '[data-testid="snackbar_message"]',
    SNACKBAR_CONTENT = '[data-testid="snackbar_content"]',
    SIGN_OUT = '[data-testid="sign_out"]',
    SIGNUP_FROM_LOGIN = '[data-testid="signup_from_login"]',
    ADMIN_CONTAINER = '[data-testid="admin_container"]',
    RETRO_CONTAINER = '[data-testid="retro_container"]',
    SIGNUP_EMAIL = '[data-testid="signup_email"]',
    SIGNUP_PASSWORD = '[data-testid="signup_password"]',
    SIGNUP_CONFIRM_PASSWORD = '[data-testid="signup_confirm-password"]',
    SIGNUP_SUBMIT = '[data-testid="signup_submit"]';

describe('Auth', () => {
    describe('Login Functionality', () => {
        beforeEach(() => {
            cy.visit('/login');
        });
        it('should login in when correct email and password are provided',() => {
            cy.login(Cypress.env('LOGIN_USERNAME'), Cypress.env('LOGIN_PASSWORD'));
            cy.location('pathname').should('include', 'retroList');
            cy.get(SIGN_OUT)
                .click();
            cy.location('pathname').should('include', 'login');
        });
        it('should not log in due to wrong password', () => {
            cy.login(Cypress.env('LOGIN_USERNAME'), 'wrongpassword');
            cy.get(SNACKBAR_MESSAGE)
                .should('be.visible');
            cy.location('pathname').should('not.include', 'retroList');
        });
        it('should not log in due to no email existing', () => {
            cy.login('wrongemail@email.com', 'wrongpassword');
            cy.get(SNACKBAR_MESSAGE)
                .should('be.visible');
            cy.get(SNACKBAR_CONTENT).should('have.css','background-color', 'rgb(211, 47, 47)');
        });
    });
    describe('Sign Up Functionality', () => {
        beforeEach(() => {
            cy.visit('/signup');
        });
        it('should signup a new user successfully', () => {
            let idToken;
            cy.server();
            cy.route('POST', `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${Cypress.env('REACT_APP_STAGE_API_KEY')}`)
                .as('signup');
            cy.get(SIGNUP_EMAIL).find('input').type('stage6@test.com');
            cy.get(SIGNUP_PASSWORD).find('input').type('testing123');
            cy.get(SIGNUP_CONFIRM_PASSWORD).find('input').type('testing123');
            cy.get(SIGNUP_SUBMIT).click();
            cy.wait('@signup')
                .then((xhr) => {
                    idToken = xhr.response.body.idToken;
                    cy.location('pathname').should('include', '/retroList');
                    cy.get(ADMIN_CONTAINER).should('be.visible');
                    cy.get(SIGN_OUT)
                        .click();
                    cy.request('POST', `https://www.googleapis.com/identitytoolkit/v3/relyingparty/deleteAccount?key=${Cypress.env('REACT_APP_STAGE_API_KEY')}`, {idToken: idToken})
                });
        });
        it('should not create a new user successfully if user exists', () => {
            cy.get(SIGNUP_EMAIL).find('input').type(Cypress.env('LOGIN_USERNAME'));
            cy.get(SIGNUP_PASSWORD).find('input').type('testing123');
            cy.get(SIGNUP_CONFIRM_PASSWORD).find('input').type('testing123');
            cy.get(SIGNUP_SUBMIT).click();
            cy.get(SNACKBAR_MESSAGE)
                .should('be.visible')
            cy.get(SNACKBAR_CONTENT).should('have.css', 'background-color', 'rgb(211, 47, 47)');
        });
    });
    describe('Retro Id Exists On Log In', () => {
        it('should redirect to retro if id exists after successful login', () => {
            cy.visit('/retro/TTnSJO9dYbVJdw2tWjUI');
            cy.login(Cypress.env('LOGIN_USERNAME'), Cypress.env('LOGIN_PASSWORD'));

            cy.location('pathname').should('include', '/retro/TTnSJO9dYbVJdw2tWjUI');
            cy.get(SIGN_OUT)
                .click();
        });
        it('should redirect if id exists on sign up for new user', () => {
            let idToken;
            cy.server();
            cy.visit('/retro/TTnSJO9dYbVJdw2tWjUI');
            cy.route('POST', `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${Cypress.env('REACT_APP_STAGE_API_KEY')}`)
                .as('signup');
            cy.get(SIGNUP_FROM_LOGIN)
                .click(); 
            cy.get(SIGNUP_EMAIL).find('input').type('stage6@test.com');
            cy.get(SIGNUP_PASSWORD).find('input').type('testing123');
            cy.get(SIGNUP_CONFIRM_PASSWORD).find('input').type('testing123');
            cy.get(SIGNUP_SUBMIT).click();
            cy.wait('@signup')
                .then((xhr) => {
                    idToken = xhr.response.body.idToken;
                    cy.location('pathname').should('include', '/retro/TTnSJO9dYbVJdw2tWjUI');
                    cy.get(RETRO_CONTAINER).should('be.visible');
                    cy.get(SIGN_OUT)
                        .click();
                    cy.request('POST', `https://www.googleapis.com/identitytoolkit/v3/relyingparty/deleteAccount?key=${Cypress.env('REACT_APP_STAGE_API_KEY')}`, {idToken: idToken})
                });
        });
    });
});