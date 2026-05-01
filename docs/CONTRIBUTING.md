# Contributing Guide

Thank you for your interest in contributing to the English Learning App! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful, inclusive, and professional in all interactions. Harassment, discrimination, or any disruptive behavior is not tolerated.

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/your-username/english-learning-app.git
cd english-learning-app

# Add upstream remote
git remote add upstream https://github.com/original-owner/english-learning-app.git
```

### 2. Create a Branch

```bash
# Create a new branch from main
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name

# Branch naming conventions:
# - feature/feature-name       (new features)
# - bugfix/bug-name            (bug fixes)
# - docs/documentation-name    (documentation)
# - refactor/refactor-name     (code refactoring)
# - test/test-name             (tests)
```

### 3. Set Up Development Environment

See [SETUP.md](SETUP.md) for environment setup instructions.

## Development Workflow

### Code Style

#### JavaScript/TypeScript (Frontend)

- Use ESLint for linting
- Follow Prettier formatting
- Use functional components with hooks
- Use TypeScript for type safety

```bash
# Run linter
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

#### Java (Backend)

- Follow Google Java Style Guide
- Use meaningful variable and method names
- Add JavaDoc comments for public methods
- Use Spring annotations properly

```bash
# Build
mvn clean build

# Run tests
mvn test

# Format code
mvn formatter:format
```

### Testing

Write tests for new features and bug fixes.

#### Frontend Tests

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

**Test file naming:**

- Component tests: `Component.test.tsx`
- Hook tests: `hook.test.ts`
- Utility tests: `utils.test.ts`

**Example test:**

```typescript
import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "../useAuth";

describe("useAuth", () => {
  it("should login user", async () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login("user@example.com", "password");
    });

    expect(result.current.user).toBeDefined();
  });
});
```

#### Backend Tests

```bash
# Run tests
mvn test

# Run specific test class
mvn test -Dtest=AuthServiceTest
```

**Test file naming:**

- Service tests: `ServiceNameTest.java`
- Controller tests: `ControllerNameTest.java`

**Example test:**

```java
@SpringBootTest
public class AuthServiceTest {
  @Autowired
  private AuthService authService;

  @Test
  public void testLoginSuccess() {
    String token = authService.login("user@example.com", "password");
    assertNotNull(token);
  }
}
```

### Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build, dependencies, etc.

**Examples:**

```
feat(auth): add JWT token refresh endpoint
fix(lessons): resolve pagination bug
docs: update API documentation
refactor(store): simplify state management
test(useAuth): add login test cases
```

### Pull Request Process

1. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to GitHub and create a new PR
   - Fill out the PR template completely
   - Link related issues

3. **PR Title Format**

   ```
   [TYPE] Short description
   ```

   Examples: `[FEAT] Add lesson difficulty filter`, `[FIX] Fix auth token expiration`

4. **PR Description Template**

   ```
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] New feature
   - [ ] Bug fix
   - [ ] Documentation
   - [ ] Other: __

   ## Related Issues
   Closes #123

   ## Testing
   Describe testing steps

   ## Screenshots (if applicable)
   Add screenshots for UI changes

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] No breaking changes
   ```

5. **Review Process**
   - Wait for code review
   - Address reviewer comments
   - Request re-review after making changes

6. **Merge**
   - Maintainers will merge after approval
   - Delete your branch after merge

## File Structure Guidelines

### Frontend

```
src/
├── app/              # Pages and routing
├── components/       # Reusable components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and helpers
├── store/           # State management
├── types/           # TypeScript definitions
└── styles/          # Global styles
```

### Backend

```
src/main/java/com/example/english_learning_app/
├── auth/            # Authentication module
├── user/            # User management
├── lesson/          # Lesson management
├── health/          # Health checks
├── config/          # Configuration
└── web/             # Web configuration
```

## Documentation

- Update README.md if adding new features
- Update relevant .md files in `docs/` folder
- Add code comments for complex logic
- Keep API documentation up-to-date

## Performance Considerations

- Use React.memo for component optimization
- Implement lazy loading for routes
- Cache API responses appropriately
- Use connection pooling for databases
- Optimize database queries with indexes

## Security Guidelines

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Use parameterized queries to prevent SQL injection
- Keep dependencies updated
- Follow authentication best practices

## Accessibility

- Use semantic HTML
- Ensure proper ARIA labels
- Support keyboard navigation
- Maintain sufficient color contrast
- Test with screen readers

## Bug Reports

When reporting bugs, include:

- Detailed reproduction steps
- Expected vs actual behavior
- Environment information
- Browser/device details
- Screenshots or logs if applicable

**Example:**

```
## Description
Login button doesn't work on mobile

## Steps to Reproduce
1. Open app on mobile device
2. Navigate to login page
3. Click login button
4. Button doesn't respond

## Expected Behavior
Login form should submit

## Actual Behavior
Nothing happens when button is clicked

## Environment
- Device: iPhone 13
- OS: iOS 16
- Browser: Safari
```

## Feature Requests

Describe the feature and its benefits:

- Problem it solves
- Proposed implementation (optional)
- Use cases and examples
- Acceptance criteria

## Questions or Need Help?

- Check existing issues and PRs
- Ask in discussions or issues section
- Join community chat if available

## License

By contributing, you agree your code will be licensed under the same license as the project.

## Attribution

Contributors will be recognized in:

- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing! 🎉
