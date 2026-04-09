# Contributing to LeadAI Platform

Thank you for your interest in contributing to LeadAI Platform! We welcome contributions from developers, designers, testers, and domain experts. This document outlines the process for contributing to this project.

---

## 🤝 How to Contribute

### 1. Fork the Repository
Click the **Fork** button on the top right of the GitHub repository page to create your own copy.

### 2. Clone Your Fork
```bash
git clone https://github.com/<your-username>/leadai-platform.git
cd leadai-platform
```

### 3. Add Upstream Remote
```bash
git remote add upstream https://github.com/iqbalsingh6917/leadai-platform.git
```

### 4. Create a Branch
Always create a new branch for your work:
```bash
git checkout -b feature/your-feature-name
```

### 5. Make Your Changes
- Follow the code style and conventions used in the project
- Write tests for new functionality
- Update documentation as needed

### 6. Commit Your Changes
We follow **Conventional Commits** format (see below).
```bash
git commit -m "feat: add AI lead scoring endpoint"
```

### 7. Push Your Branch
```bash
git push origin feature/your-feature-name
```

### 8. Open a Pull Request
Go to GitHub and open a Pull Request from your branch to `main`. Fill out the PR template.

---

## 🌿 Branch Naming Convention

| Type | Format | Example |
|------|--------|---------|
| New Feature | `feature/xxx` | `feature/ai-lead-scoring` |
| Bug Fix | `bugfix/xxx` | `bugfix/lead-import-crash` |
| Hotfix | `hotfix/xxx` | `hotfix/auth-token-expiry` |
| Documentation | `docs/xxx` | `docs/api-reference-update` |
| Refactor | `refactor/xxx` | `refactor/pipeline-service` |
| Test | `test/xxx` | `test/lead-scoring-unit` |
| Chore | `chore/xxx` | `chore/update-dependencies` |

---

## 📝 Commit Message Format (Conventional Commits)

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Commit Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `chore` | Build process or auxiliary tool changes |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding missing tests or correcting existing tests |
| `style` | Formatting, missing semicolons, etc. (no logic change) |
| `perf` | A code change that improves performance |
| `ci` | CI configuration changes |
| `build` | Changes to build system or external dependencies |

### Examples
```bash
git commit -m "feat(leads): add AI lead scoring algorithm"
git commit -m "fix(auth): resolve token expiration on refresh"
git commit -m "docs(api): update REST endpoint documentation"
git commit -m "chore(deps): upgrade NestJS to v10"
git commit -m "refactor(pipeline): extract deal service logic"
git commit -m "test(leads): add unit tests for lead import"
```

---

## 🔍 Pull Request Process

1. **Keep PRs focused** — one feature or fix per PR
2. **Fill out the PR template** completely
3. **Link the related issue** — use `Closes #123` in the description
4. **Ensure CI passes** — all checks must pass before review
5. **Request a review** from at least one maintainer
6. **Respond to feedback** promptly and professionally
7. **Squash commits** if requested before merge

### PR Checklist
- [ ] My code follows the project's code style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have added comments for complex or non-obvious logic
- [ ] I have added or updated tests as needed
- [ ] All tests pass locally
- [ ] I have updated the documentation accordingly
- [ ] My changes don't introduce new security vulnerabilities
- [ ] I have linked the relevant GitHub issue

---

## 👀 Code Review Guidelines

### For Authors
- Write clear PR descriptions explaining **why** the change is needed
- Keep PRs small and focused (< 400 lines of diff when possible)
- Respond to all review comments
- Don't take feedback personally — it's about the code, not you

### For Reviewers
- Be constructive and kind in feedback
- Explain **why** you're suggesting a change
- Distinguish between blocking and non-blocking comments
- Approve when the PR is ready, don't block on minor style preferences
- Aim to review within 24–48 hours

---

## 🧪 Testing Requirements

- **Unit Tests**: Required for all new service methods and utility functions
- **Integration Tests**: Required for new API endpoints
- **Coverage**: Maintain ≥ 80% code coverage
- **Test naming**: Use descriptive names — `it('should score lead as hot when score > 80')`
- **No mocking abuse**: Mock external APIs, not your own code

### Running Tests
```bash
# Node.js / NestJS
npm run test
npm run test:coverage

# Python / FastAPI
pytest
pytest --cov=app tests/
```

---

## 📚 Documentation

- Update `docs/` for any architecture changes
- Update `docs/api/` for any API endpoint changes
- Add JSDoc/TypeDoc comments to exported functions and classes
- Add docstrings to Python functions and classes

---

## 🛡️ Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code.

Key principles:
- Be welcoming and inclusive
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

Report unacceptable behavior to the maintainers.

---

## ❓ Questions?

- Open a [GitHub Discussion](https://github.com/iqbalsingh6917/leadai-platform/discussions)
- Create a [GitHub Issue](https://github.com/iqbalsingh6917/leadai-platform/issues) with the `question` label

Thank you for making LeadAI Platform better! 🚀
