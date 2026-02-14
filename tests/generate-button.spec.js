const { test, expect } = require('@playwright/test');

// Helper function to get all input values from a locator
async function getAllInputValues(locator) {
  const elements = await locator.all();
  const values = [];
  for (const element of elements) {
    values.push(await element.inputValue());
  }
  return values;
}

test.describe('Generate button comprehensive tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Wait for hydration by checking if a name field has a non-empty value
    await page.waitForFunction(() => {
      const nameInput = document.querySelector('.card input.name');
      return nameInput && nameInput.value !== '';
    }, { timeout: 10000 });
  });

  test('Generate button creates new values with correct formats', async ({ page }) => {
    // Get initial values from Names section (first 3 .name inputs in the Names card)
    const namesCard = page.locator('.card').filter({ hasText: 'Names' }).first();
    const initialNames = await getAllInputValues(namesCard.locator('input.name'));
    
    const emailsCard = page.locator('.card').filter({ hasText: 'Emails' });
    const initialEmails = await getAllInputValues(emailsCard.locator('input.email'));
    
    // Click the generate button
    await page.locator('button#random8').click();
    
    // Wait for values to change by checking the first name input
    await page.waitForFunction((oldName) => {
      const nameInput = document.querySelector('.card input.name');
      return nameInput && nameInput.value !== oldName;
    }, initialNames[0], { timeout: 5000 });
    
    // Get new values
    const newNames = await getAllInputValues(namesCard.locator('input.name'));
    const newEmails = await getAllInputValues(emailsCard.locator('input.email'));
    
    // Verify that values have changed
    expect(initialNames).not.toEqual(newNames);
    expect(initialEmails).not.toEqual(newEmails);
    
    // Verify names are not empty
    for (const name of newNames) {
      expect(name).not.toBe('');
    }
  });

  test('Names have correct format', async ({ page }) => {
    const namesCard = page.locator('.card').filter({ hasText: 'Names' }).first();
    const names = await getAllInputValues(namesCard.locator('input.name'));
    
    // Should have 3 names
    expect(names).toHaveLength(3);
    
    // Validate that each name has at least 2 words (first and last name)
    for (const name of names) {
      expect(name.trim()).not.toBe('');
      const parts = name.trim().split(/\s+/);
      expect(parts.length).toBeGreaterThanOrEqual(2); // At least first and last name
      
      // Each part should start with a capital letter (names are capitalized)
      for (const part of parts) {
        expect(part[0]).toMatch(/[A-Z]/);
      }
    }
  });

  test('Emails have correct format', async ({ page }) => {
    const emailsCard = page.locator('.card').filter({ hasText: 'Emails' });
    const emails = await getAllInputValues(emailsCard.locator('input.email'));
    
    // Should have 3 emails
    expect(emails).toHaveLength(3);
    
    // Email regex pattern: text@domain.tld
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    for (const email of emails) {
      expect(email).toMatch(emailRegex);
      expect(email).toContain('@');
      // Check for known domains
      expect(email).toMatch(/@(gmail\.com|googlemail\.com|hotmail\.com)$/);
    }
  });

  test('Passwords have correct formats', async ({ page }) => {
    const passwordsCard = page.locator('.card').filter({ hasText: 'Passwords' });
    const passwords = await getAllInputValues(passwordsCard.locator('input.password'));
    
    // Should have 4 passwords
    expect(passwords).toHaveLength(4);
    
    // First password: human-readable 8 chars
    expect(passwords[0].length).toBe(8);
    
    // Second password: 12 chars (with default params, includes special chars)
    expect(passwords[1].length).toBe(12);
    // Just verify it's not empty
    expect(passwords[1]).not.toBe('');
    
    // Third password: 16 chars with special chars (._;)
    expect(passwords[2].length).toBe(16);
    
    // Fourth password: 32 chars
    expect(passwords[3].length).toBe(32);
  });

  test('Phone numbers have correct formats', async ({ page }) => {
    const phoneCard = page.locator('.card').filter({ hasText: 'Phone numbers' });
    const phoneNumbers = await getAllInputValues(phoneCard.locator('input.phone-number'));
    
    // Should have 4 phone numbers (CZ, US, UK, IN)
    expect(phoneNumbers).toHaveLength(4);
    
    // CZ: +420 followed by 9 digits
    expect(phoneNumbers[0]).toMatch(/^\+420 \d{9}$/);
    
    // US: +1 followed by XXX-XXX-XXXX format
    expect(phoneNumbers[1]).toMatch(/^\+1 \d{3}-\d{3}-\d{4}$/);
    
    // UK: +44 followed by 10 digits
    expect(phoneNumbers[2]).toMatch(/^\+44\d{10}$/);
    
    // IN: +91 followed by 5 digits, space, 5 digits
    expect(phoneNumbers[3]).toMatch(/^\+91 \d{5} \d{5}$/);
  });

  test('Numbers have correct lengths', async ({ page }) => {
    const numbersCard = page.locator('.card').filter({ hasText: 'Numbers' });
    const numbers = await getAllInputValues(numbersCard.locator('input.number'));
    
    // Should have 9 numbers (3 sets of 4, 8, 12)
    expect(numbers).toHaveLength(9);
    
    // Check lengths: 4, 8, 12 repeated 3 times
    const expectedLengths = [4, 8, 12, 4, 8, 12, 4, 8, 12];
    for (let i = 0; i < numbers.length; i++) {
      expect(numbers[i].length).toBe(expectedLengths[i]);
      // Should only contain digits
      expect(numbers[i]).toMatch(/^\d+$/);
    }
  });

  test('Dates have correct formats', async ({ page }) => {
    const datesCard = page.locator('.card').filter({ hasText: 'Date & Time' });
    const dates = await getAllInputValues(datesCard.locator('input.date'));
    
    // Should have 8 date entries
    expect(dates).toHaveLength(8);
    
    // First 2: ISO string format
    expect(dates[0]).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(dates[1]).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    
    // Next 2: Local date string (format varies by locale, but should be a date string)
    expect(dates[2]).not.toBe('');
    expect(dates[3]).not.toBe('');
    
    // Next 2: Unix timestamp (milliseconds since epoch)
    expect(parseInt(dates[4])).toBeGreaterThan(0);
    expect(parseInt(dates[5])).toBeGreaterThan(0);
    
    // Last 2: Date object string representation
    expect(dates[6]).not.toBe('');
    expect(dates[7]).not.toBe('');
  });

  test('Persona has correct format', async ({ page }) => {
    const personaCard = page.locator('.card').filter({ hasText: 'Persona' });
    const personaInputs = await personaCard.locator('input').all();
    
    // Should have 5 inputs: name, uuid, email, phone, password
    expect(personaInputs).toHaveLength(5);
    
    // Name
    const name = await personaInputs[0].inputValue();
    expect(name.trim()).not.toBe('');
    const nameParts = name.trim().split(/\s+/);
    expect(nameParts.length).toBeGreaterThanOrEqual(2);
    
    // UUID (v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
    const uuid = await personaInputs[1].inputValue();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    
    // Email
    const email = await personaInputs[2].inputValue();
    expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    
    // Phone (one of the supported formats)
    const phone = await personaInputs[3].inputValue();
    expect(phone).toMatch(/^\+\d+/); // Starts with + and numbers
    
    // Password (12 chars)
    const password = await personaInputs[4].inputValue();
    expect(password.length).toBe(12);
  });

  test('Pet names have correct format', async ({ page }) => {
    const petNamesCard = page.locator('.card').filter({ hasText: 'Pet names' });
    const petNames = await getAllInputValues(petNamesCard.locator('input.name'));
    
    // Should have 3 pet names
    expect(petNames).toHaveLength(3);
    
    // First: 2 words with hyphens and 4-digit number
    expect(petNames[0]).toMatch(/^[a-z]+-[a-z]+-\d{4}$/);
    
    // Second: 3 words with hyphens
    expect(petNames[1]).toMatch(/^[a-z]+-[a-z]+-[a-z]+$/);
    
    // Third: 5 words with underscores
    const underscoreCount = (petNames[2].match(/_/g) || []).length;
    expect(underscoreCount).toBe(4); // 5 words = 4 underscores
  });

  test('Keys have correct format', async ({ page }) => {
    const keysCard = page.locator('.card').filter({ hasText: 'Keys' });
    const keys = await getAllInputValues(keysCard.locator('input.password'));
    
    // Should have 3 keys
    expect(keys).toHaveLength(3);
    
    // First: 16 chars, uppercase only (getRandomKey(16, false, true, false, false))
    expect(keys[0].length).toBe(16);
    expect(keys[0]).toMatch(/^[A-Z]+$/);
    
    // Second: 16 chars with all character types (default params include special chars)
    expect(keys[1].length).toBe(16);
    // Just verify it's 16 chars and not empty
    expect(keys[1]).not.toBe('');
    
    // Third: UUID v4 format
    expect(keys[2]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  test('Multiple clicks generate different values each time', async ({ page }) => {
    const namesCard = page.locator('.card').filter({ hasText: 'Names' }).first();
    
    // Get initial values
    const initialNames = await getAllInputValues(namesCard.locator('input.name'));
    
    // Get first set of values
    await page.locator('button#random8').click();
    await page.waitForFunction((oldName) => {
      const nameInput = document.querySelector('.card input.name');
      return nameInput && nameInput.value !== oldName;
    }, initialNames[0], { timeout: 5000 });
    const firstNames = await getAllInputValues(namesCard.locator('input.name'));
    
    // Get second set of values
    await page.locator('button#random8').click();
    await page.waitForFunction((oldName) => {
      const nameInput = document.querySelector('.card input.name');
      return nameInput && nameInput.value !== oldName;
    }, firstNames[0], { timeout: 5000 });
    const secondNames = await getAllInputValues(namesCard.locator('input.name'));
    
    // Get third set of values
    await page.locator('button#random8').click();
    await page.waitForFunction((oldName) => {
      const nameInput = document.querySelector('.card input.name');
      return nameInput && nameInput.value !== oldName;
    }, secondNames[0], { timeout: 5000 });
    const thirdNames = await getAllInputValues(namesCard.locator('input.name'));
    
    // Verify they are all different
    expect(firstNames).not.toEqual(secondNames);
    expect(secondNames).not.toEqual(thirdNames);
    expect(firstNames).not.toEqual(thirdNames);
  });

  test('All sections populate with non-empty values', async ({ page }) => {
    // Get initial name to verify change after clicking
    const namesCard = page.locator('.card').filter({ hasText: 'Names' }).first();
    const initialName = await namesCard.locator('input.name').first().inputValue();
    
    // Click generate button
    await page.locator('button#random8').click();
    
    // Wait for values to change
    await page.waitForFunction((oldName) => {
      const nameInput = document.querySelector('.card input.name');
      return nameInput && nameInput.value !== oldName;
    }, initialName, { timeout: 5000 });
    
    // Check Names section
    const names = await getAllInputValues(namesCard.locator('input.name'));
    for (const value of names) {
      expect(value).not.toBe('');
    }
    
    // Check Emails section
    const emailsCard = page.locator('.card').filter({ hasText: 'Emails' });
    const emails = await getAllInputValues(emailsCard.locator('input.email'));
    for (const value of emails) {
      expect(value).not.toBe('');
    }
    
    // Check Passwords section
    const passwordsCard = page.locator('.card').filter({ hasText: 'Passwords' });
    const passwords = await getAllInputValues(passwordsCard.locator('input.password'));
    for (const value of passwords) {
      expect(value).not.toBe('');
    }
    
    // Check Phone numbers section
    const phoneCard = page.locator('.card').filter({ hasText: 'Phone numbers' });
    const phoneNumbers = await getAllInputValues(phoneCard.locator('input.phone-number'));
    for (const value of phoneNumbers) {
      expect(value).not.toBe('');
    }
    
    // Check Numbers section
    const numbersCard = page.locator('.card').filter({ hasText: 'Numbers' });
    const numbers = await getAllInputValues(numbersCard.locator('input.number'));
    for (const value of numbers) {
      expect(value).not.toBe('');
    }
    
    // Check Dates section
    const datesCard = page.locator('.card').filter({ hasText: 'Date & Time' });
    const dates = await getAllInputValues(datesCard.locator('input.date'));
    for (const value of dates) {
      expect(value).not.toBe('');
    }
    
    // Check Persona section
    const personaCard = page.locator('.card').filter({ hasText: 'Persona' });
    const personaInputs = await personaCard.locator('input').all();
    for (const input of personaInputs) {
      const value = await input.inputValue();
      expect(value).not.toBe('');
    }
    
    // Check Pet names section
    const petNamesCard = page.locator('.card').filter({ hasText: 'Pet names' });
    const petNames = await getAllInputValues(petNamesCard.locator('input.name'));
    for (const value of petNames) {
      expect(value).not.toBe('');
    }
    
    // Check Keys section
    const keysCard = page.locator('.card').filter({ hasText: 'Keys' });
    const keys = await getAllInputValues(keysCard.locator('input.password'));
    for (const value of keys) {
      expect(value).not.toBe('');
    }
  });
});
