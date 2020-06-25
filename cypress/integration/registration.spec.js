/// <reference types="Cypress"/>

context("Registration", () => {
    describe("Registration with invalid data", () => {

        beforeEach(() => {
            cy.window().then((win) => {
                win.sessionStorage.clear();
            });
            cy.reload();
            cy.visit("/registration");
        })

        it("form has autocomplete attribute", () => {
            cy.get('form').should('have.attr', 'autocomplete', 'off');
        })

        it("submit without any entries", () => {
            cy.get('form').submit();
            cy.get('span').contains('Email is required').should('be.visible');
            cy.get('span').contains('Password is required').should('be.visible');
            cy.get('span').contains('Password repeat is required').should('be.visible');
        })

        it("submit with invalid email", () => {
            cy.get('label').contains('E-mail').type('costincometestuser');
            cy.get('form').submit();
            cy.get('span').contains('Invalid e-mail').should('be.visible');
        })

        it("submit with short password", () => {
            cy.get('label').contains('Password').type('passwor');
            cy.get('form').submit();
            cy.get('span').contains('Password must be longer than 8 characters').should('be.visible');
        })

        it("submit with non equal passwords", () => {
            cy.get('label').contains('Password').type('passwor');
            cy.get('label').contains('Repeat password').type('password');
            cy.get('form').submit();
            cy.get('span').contains('Email is required').should('be.visible');
            cy.get('span').contains('Password must be longer than 8 characters').should('be.visible');
            cy.get('span').contains("Doesn't match password").should('be.visible');
        })

        it("submit with valid email and non equal passwords", () => {
            cy.get('label').contains('E-mail').type('costincometestuser@gmail.com');
            cy.get('label').contains('Password').type('passwor');
            cy.get('label').contains('Repeat password').type('password');
            cy.get('form').submit();
            cy.get('span').contains('Password must be longer than 8 characters').should('be.visible');
            cy.get('span').contains('Doesn\'t match password').should('be.visible');
        })

        it("submit with already existing email", () => {
            cy.server();
            cy.route({
                method: 'POST',
                url: 'api/auth/register'
            }).as('register');

            cy.get('label').contains('E-mail').type('costincometestuser@gmail.com');
            cy.get('label').contains('Password').type('password');
            cy.get('label').contains('Repeat password').type('password');
            cy.get('form').submit();

            cy.wait('@register');

            cy.get('span').contains('Email already exists').should('be.visible');
        })  
    })
})