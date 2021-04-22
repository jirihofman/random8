/// <reference types="cypress" />

context('Sanity checks', () => {
	before(() => {
		cy.visit('/')
	})
	describe('The button', () => {
		it('works', () => {
			cy.get('button > span').contains('Random8').should('be.visible').click();
		})
	})

	describe('Sections', () => {
		['Names', 'Emails', 'Persona', 'Passwords', 'Keys', 'Numbers'].forEach(header => {
			it(header, () => {
				cy.get('h3').contains(header).should('be.visible');
			})
		})
	})
})
