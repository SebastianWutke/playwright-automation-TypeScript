# playwright-automation

This repository contains a suite of automated end-to-end tests for web application login scenarios, implemented using Playwright and TypeScript.

## Overview

The tests cover a wide range of login-related scenarios, including:
- Successful login with valid email and PESEL credentials
- Handling incorrect login details and password errors
- Account lockout behavior after multiple failed login attempts
- Input validation and error message verification
- Logging attempts without required credentials

## Technologies Used

- Playwright for browser automation and testing
- TypeScript as the programming language
- XPath and ARIA selectors for robust element location
- Async/await patterns for reliable asynchronous test execution

## Project Structure

- `tests/` – contains all the automated test scripts

## How to Run the Tests

1. Clone the repository
2. Install dependencies: `npm install`
3. Run tests with Playwright Test Runner: `npx playwright test`
4. View test reports if configured

## Notes

- Sensitive data (login credentials and personal identifiers) have been anonymized for security before publishing
- Tests demonstrate practical use of Playwright features for stable and maintainable UI and API automation
- Suitable as a demonstration of skills in test automation for recruitment purposes

---
