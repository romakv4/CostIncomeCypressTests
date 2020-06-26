/// <reference types="Cypress"/>

context("Authorization", () => {
    describe("Authorization with invalid data", () => {
        
        beforeEach(() => {
            cy.window().then((win) => {
                win.sessionStorage.clear();
            });
            cy.reload();
            cy.visit("/authorization");
        })

        it("form has autocomplete attribute", () => {
            cy.get('form').should('have.attr', 'autocomplete', 'off');
        })

        it("forgot password link is available", () => {
            cy.get('a').contains('Forgot password?').should('be.visible');
        })

        it("submit without any entries", () => {
            cy.get('form').submit();
            cy.get('input#email').should('have.class', 'erroredFormField');
            cy.get('span').contains('Email is required').should('be.visible');
            cy.get('input#password').should('have.class', 'erroredFormField');
            cy.get('span').contains('Password is required').should('be.visible');
        })

        it("submit with valid email and short password", () => {
            cy.get('input#email').type('costincometestuser@gmail.com');
            cy.get('input#password').type('passwor');
            cy.get('form').submit();
            cy.get('input#password').should('have.class', 'erroredFormField');
            cy.get('span').contains('Password must be longer than 8 characters').should('be.visible');
        })

        it("submit with invalid email and valid password", () => {
            cy.get('input#email').type('costincometestuser');
            cy.get('input#password').type('password');
            cy.get('form').submit();
            cy.get('input#email').should('have.class', 'erroredFormField');
            cy.get('span').contains('Invalid e-mail').should('be.visible');
        })

    })

    describe("Authorization with valid data", () => {
        it("login logout", () => {
            cy.visit('/authorization');
            cy.get('input#email').type('costincometestuser@gmail.com');
            cy.get('input#password').type('password');
            cy.get('form').submit();
            cy.location('pathname').should('eq', '/home').should(() => {
                expect(
                    sessionStorage.getItem('token')
                ).to.be.a('string');
            });
            cy.get('button').contains('Log out').click();
            cy.location('pathname').should('eq', '/').should(() => {
                expect(
                    sessionStorage.getItem('token')
                ).to.be.null;
            });
        })
    })
})