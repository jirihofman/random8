/// <reference types="cypress" />

context('Sanity checks', () => {
	before(() => {
		cy.visit('/')
	})
	it('Sections exist', () => {
		['Names', 'Emails', 'Persona', 'Passwords', 'Keys', 'Numbers', 'Date'].forEach(header => {
			cy.get('h3').contains(header).should('be.visible');
		})
	})
	it('The button works', () => {
		cy.get('button > h2').contains('Random8').should('be.visible').click();
	})
	it('There are tooltips', () => {
		['Emails', 'Numbers'].forEach(header => {
			cy.get('h3').contains(header).find('.tooltip .tooltiptext').should('exist');
		})
	})
})
