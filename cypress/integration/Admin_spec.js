const CREATE_RETRO_BUTTON ='[data-testid="admin_create-retro"]',
    CREATE_RETRO_DIALOG = '[data-testid="create_dialog"]',
    SUBMIT_NEW_RETRO = '[data-testid="admin_submit-retro"]',
    SNACKBAR_CONTENT = '[data-testid="snackbar_content"]',
    DELETE_RETRO_BUTTON = '[data-testid="admin_delete-retro-button"]',
    DELETE_WARNING = '[data-testid="delete-warning_dialog"]',
    CANCEL_BUTTON = '[data-testid="cancel-delete_button"]',
    CONFIRM_BUTTON = '[data-testid="confirm-delete_button"]';
describe('Admin Functionality', () => {
    beforeEach(() => {
        cy.visit("/login");
        cy.login(Cypress.env('LOGIN_USERNAME'), Cypress.env('LOGIN_PASSWORD'));
    });
    it('should create new retro', () => {
        cy.get(CREATE_RETRO_BUTTON).click();
        cy.get(CREATE_RETRO_DIALOG).should('be.visible');
        cy.get('[name="retro_name"]')
            .type('New Retro')
        cy.get('[name="retro_vote"]')
            .type(8)
        cy.get('[name="retro_start"]')
            .type('2019-08-01')
        cy.get('[name="retro_end"]')
            .type('2019-08-01')
        cy.get(SUBMIT_NEW_RETRO)
            .click();
        cy.get(SNACKBAR_CONTENT).should('have.css','background-color', 'rgb(67, 160, 71)');
    });
    it.only('should delete retro and warning message should be shown', () => {
        cy.get(DELETE_RETRO_BUTTON).first().click();
        cy.get(DELETE_WARNING).should('be.visible');
        cy.get(CANCEL_BUTTON).click();
        cy.get(DELETE_WARNING).should('not.be.visible');

        cy.get(DELETE_RETRO_BUTTON).first().click();
        cy.get(DELETE_WARNING).should('be.visible');
        cy.get(CONFIRM_BUTTON).click();
        cy.get(SNACKBAR_CONTENT).should('have.css','background-color', 'rgb(67, 160, 71)');
    }) 
});