/// <reference types="Cypress"/>

context("Change password", () => {
    before(() => {
        cy.window().then((win) => {
            win.sessionStorage.clear();
        });
        cy.reload();
        cy.visit('/authorization');
        cy.get('label').contains('E-mail').type('costincometestuser@gmail.com');
        cy.get('label').contains('Password').type('password');
        cy.get('form').submit();
        cy.location('pathname').should('eq', '/home').should(() => {
            expect(
                sessionStorage.getItem('token')
            ).to.be.a('string');
        });
    })

    describe("Change password with invalid data", () => {

        beforeEach(() => {
            cy.visit('/changepassword');
        })

        it("form has autocomplete attribute", () => {
            cy.get('form').should('have.attr', 'autocomplete', 'off');
        })

        it("submit without any entries", () => {
            cy.get('form').submit();
            cy.get('span').contains('Email is required').should('be.visible');
            cy.get('span').contains('Password is required').should('be.visible');
            cy.get('span').contains('New password is required').should('be.visible');
        })

        it("submit with not existing email", () => {
            cy.server();
            cy.route({
                method: 'POST',
                url: 'api/auth/changepassword',
                status: 401,
                response: {
                    success: false,
                    email: 'User with specified email not exist'
                }
            })

            cy.get('label').contains('E-mail').type('costincometestuser@gmail');
            cy.get('label').contains('Password').type('password');
            cy.get('label').contains('New password').type('password1');
            cy.get('form').submit();

            cy.get('span').contains('User with specified email not exist').should('be.visible');
        })

        it("submit with equals passwords", () => {
            cy.get('label').contains('E-mail').type('costincometestuser@gmail.com');
            cy.get('label').contains('Password').type('password');
            cy.get('label').contains('New password').type('password');
            cy.get('form').submit();
            cy.get('span').contains('The new password can\'t match old');
        })
    
    })

    describe("Change password with valid data", () => {

        beforeEach(() => {
            cy.visit('/changepassword');
        })

        after(() => {
            cy.log('Change password to default')
            cy.visit('/changepassword');
            cy.get('label').contains('E-mail').type('costincometestuser@gmail.com');
            cy.get('label').contains('Password').type('passwordtest');
            cy.get('label').contains('New password').type('password');
            cy.get('form').submit();
        })

        it("submit with valid data", () => {
            cy.get('label').contains('E-mail').type('costincometestuser@gmail.com');
            cy.get('label').contains('Password').type('password');
            cy.get('label').contains('New password').type('passwordtest');
            cy.get('form').submit();
            cy.location('pathname').should('eq', '/authorization').should(() => {
                expect(
                    sessionStorage.getItem('token')
                ).to.be.null;
            })
            cy.get('label').contains('E-mail').type('costincometestuser@gmail.com');
            cy.get('label').contains('Password').type('passwordtest');
            cy.get('form').submit();
            cy.location('pathname').should('eq', '/home').should(() => {
                expect(
                    sessionStorage.getItem('token')
                ).to.be.string;
            });
        })
    })
})