/// <reference types="cypress" />

context('Sanity checks', () => {
	before(() => {
		cy.visit('/')
	})
	it('Sections exist', () => {
		['Names', 'Emails', 'Persona', 'Passwords', 'Keys', 'Numbers'].forEach(header => {
			cy.get('h3').contains(header).should('be.visible');
		})
	})
	it('The button works', () => {
		cy.get('button > span').contains('Random8').should('be.visible').click();
	})
})
