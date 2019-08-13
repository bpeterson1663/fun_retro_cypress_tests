
Cypress.Commands.add('login', (email, password) => {
    cy.get('[type="email"]')
        .type(email).should('have.value', email);
    cy.get('[type="password"]')
        .type(password).should('have.value', password);   
    cy.get('[type="submit"]')
        .click();
});

Cypress.Commands.add('signup', (email, password) => {
    cy.get('[type="email"]')
        .type(email).should('have.value', email);
    cy.get('[type="password"]')
        .type(password).should('have.value', password);   
    cy.get('[type="submit"]')
        .click();
});