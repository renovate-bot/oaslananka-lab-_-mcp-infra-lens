# Security Policy

## Reporting a vulnerability

Please do not open a public issue for security vulnerabilities.

Use GitHub Security Advisories:
https://github.com/oaslananka-lab/mcp-infra-lens/security/advisories/new

Do not open public issues for security vulnerabilities. A response is expected within 72 hours.

## Scope

- SSH credential handling and redaction
- Host key verification behavior
- SQLite data exposure
- MCP tool privilege escalation
- HTTP transport deployment posture

## Known limitations in v1

- Host key verification is disabled by default for compatibility. Production deployments should restrict network access to known hosts and plan for strict verification in a later release.
- SSH host key verification is permissive in v1. Treat SSH targets as trusted-network-only until strict host key pinning is introduced.
- SSH credentials are kept in memory only for the active session and are never stored in SQLite.
- The HTTP transport has no built-in authentication. Bind it to loopback (`HOST=127.0.0.1`) and place it behind an authenticated reverse proxy for any non-local deployment.
- Do not expose Streamable HTTP directly on a public interface. Use TLS and authentication at the proxy boundary.

## Data stored

The SQLite database at `~/.mcp-infra-lens/metrics.db` may contain:

- CPU, memory, load, disk, and network metrics
- Process names and PIDs
- Hostname and OS metadata
- Baseline labels and snapshot timestamps

It does not store SSH credentials, private keys, passwords, or passphrases.
