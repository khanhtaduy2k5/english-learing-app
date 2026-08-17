# Security Test Checklist

This checklist follows the planned order for testing the whole repo. Start with auth/session and access control, then expand outward.

## Phase 1: Auth, Session, and Access Control

- Verify `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`, and `/api/auth/logout` with valid and invalid payloads.
- Confirm the login/register responses set the `refreshToken` cookie with the expected security flags.
- Confirm the client sends the access token in `Authorization: Bearer ...` when a token exists.
- Confirm 401 responses trigger exactly one refresh attempt and a successful retry.
- Confirm refresh failure clears client auth state and redirects to `/login?clear=1`.
- Confirm stale auth cookies do not keep `/register` or `/login` blocked after the middleware clearing path.
- Confirm `/api/users/me` requires authentication.
- Confirm `/api/users/**` remains admin-only except for the authenticated self-service endpoints.
- Confirm direct API access is blocked even if the client-side route guard is bypassed.

## Phase 2: Input Validation and Injection

- Test `/api/auth/login`, `/api/auth/register`, `/api/users`, `/api/users/me`, `/api/users/me/avatar`, `/api/progress`, and `/api/writing/feedback` with malformed payloads and boundary values.
- Verify invalid email, password, and name values are rejected consistently on auth and profile requests.
- Verify short, blank, oversized, and script-like values are rejected for `WritingFeedbackRequest.text`, `ProgressUpdateRequest.lessonId`, `ProgressUpdateRequest.status`, and Wordle guesses.
- Verify query-parameter inputs on `/api/levels`, `/api/units`, `/api/grammar`, `/api/reading`, and `/api/public/trivia` are treated as data only and do not change authorization or backend behavior.
- Verify file upload inputs on `/api/users/me/avatar` reject unexpected MIME types, oversized payloads, and path-like filenames.
- Verify no endpoint reflects raw user input into error messages, HTML, JSON, or downstream service prompts.
- Verify any field used as an identifier (`userId`, `lessonId`, `gameId`, `id`) fails closed on malformed values and does not leak stack traces.

## Phase 3: Rate Limiting and Abuse Resistance

- Confirm `/api/auth/login` and `/api/auth/register` are rate limited by IP and return `429 Too Many Requests` after the configured threshold.
- Confirm the rate limiter keys off the request source the server trusts, not spoofed forwarding headers.
- Verify Redis outage behavior is safe and intentional for both auth rate limiting and writing-feedback rate limiting.
- Confirm `/api/writing/feedback` enforces its own per-user hourly cap and fails closed only when the policy says so.
- Check brute force, retry storms, and burst request handling for auth and writing workloads.
- Verify rate-limit failures do not leak stack traces, Redis internals, or inconsistent response shapes.

## Phase 4: Upload and External Boundaries

- Validate `/api/users/me/avatar` file type, size, multipart handling, and filename/path-like input handling.
- Confirm avatar uploads cannot overwrite arbitrary files or point to remote/internal URLs.
- Verify `/api/writing/feedback` keeps user text inside the prompt boundary and rejects obvious injection markers.
- Verify public-content endpoints and any outbound HTTP calls only accept intended outbound destinations and do not follow attacker-controlled URLs.
- Confirm query parameters such as `difficulty` and `level` on public catalog endpoints only influence data selection, not authorization or request routing.

## Phase 5: Deployment and Hardening

- Review CORS, security headers, cookie flags, and environment handling end to end.
- Confirm `refreshToken` is HttpOnly, path-scoped to `/`, and only marked Secure when the request is actually secure or forwarded as HTTPS.
- Compare dev and production compose settings for exposed ports, reverse-proxy assumptions, and external dependency wiring.
- Verify production secrets come from env files or runtime injection, not from source-controlled defaults.
- Reconcile docs with runtime behavior where they disagree, especially auth storage and token rotation.
- Confirm Swagger/API docs exposure matches the intended production posture.

## Notes

- The current docs describe JWT in `localStorage`, but the runtime flow uses an HttpOnly refresh cookie plus client-side token state.
- Keep the existing security tests as the regression baseline and add new cases only where a gap is confirmed.
