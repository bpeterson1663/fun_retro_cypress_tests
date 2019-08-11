describe('Auth', () => {
    describe('login', () => {
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
            cy.location('pathname').should('include', 'retroList')

            cy.get('[name="logout"')
                .click();
            
            cy.location('pathname').should('include', 'login');
        });

    });
    
});