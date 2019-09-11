describe('Admin Functionality', () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/login");
        cy.login(Cypress.env('LOGIN_USERNAME'), Cypress.env('LOGIN_PASSWORD'));
    });
    it('should create new retro', () => {
        cy.get('[name="retro_name"]')
            .type('New Retro')
        cy.get('[name="retro_vote"]')
            .type(8)
        cy.get('[name="retro_start"]')
            .type('2019-08-01')
        cy.get('[name="retro_end"]')
            .type('2019-08-01')
        cy.get('[type="submit"]')
            .click();
        cy.get('[data-id="snackbar_message"]', (el) => {
                expect(el).to.have.css('background-color', '#43A047')
            })
            .should('be.visible');
    });
    it('should be delete retro and warning message should be shown', () => {
        cy.get('[data-id="delete_button"]').first().click();
        cy.get('[data-id="warning_dialog"]').should('be.visible');
        cy.get('[data-id="cancel-delete_button"]').click();
        cy.get('[data-id="warning_dialog"]').should('not.be.visible');

        cy.get('[data-id="delete_button"]').first().click();
        cy.get('[data-id="warning_dialog"]').should('be.visible');
        cy.get('[data-id="confirm-delete_button"]').click();
        cy.get('[data-id="snackbar_message"]', (el) => {
            expect(el).to.have.css('background-color', '#43A047')
        })
        .should('be.visible');
    }) 
});