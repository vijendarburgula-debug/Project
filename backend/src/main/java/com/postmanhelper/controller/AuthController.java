package com.postmanhelper.controller;

import com.postmanhelper.model.AuthRequest;
import com.postmanhelper.model.UserAccount;
import com.postmanhelper.repository.UserAccountRepository;
import com.postmanhelper.service.SessionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String CSV_HEADER = "email,timestamp,ip";
    private static final Object CSV_LOCK = new Object();
    private static final int MIN_PASSWORD_LENGTH = 8;

    private final UserAccountRepository users;
    private final SessionService sessions;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.logins.csv.path:logins.csv}")
    private String csvPathProp;

    public AuthController(UserAccountRepository users, SessionService sessions) {
        this.users = users;
        this.sessions = sessions;
    }

    // ── Register ─────────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        String email = normalizeEmail(req.getEmail());
        String password = req.getPassword() == null ? "" : req.getPassword();

        if (email.isEmpty() || !email.contains("@")) {
            return error(400, "A valid email is required.");
        }
        if (password.length() < MIN_PASSWORD_LENGTH) {
            return error(400, "Password must be at least " + MIN_PASSWORD_LENGTH + " characters.");
        }
        if (users.findByEmailIgnoreCase(email).isPresent()) {
            return error(409, "An account with this email already exists.");
        }

        UserAccount user = new UserAccount();
        user.setEmail(email);
        user.setPasswordHash(encoder.encode(password));
        user.setCreatedAt(Instant.now().toString());
        users.save(user);

        String token = sessions.createSession(email);
        return ResponseEntity.ok(authResult(token, email));
    }

    // ── Login ────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req, HttpServletRequest httpReq) {
        String email = normalizeEmail(req.getEmail());
        String password = req.getPassword() == null ? "" : req.getPassword();

        Optional<UserAccount> found = users.findByEmailIgnoreCase(email);
        if (!found.isPresent() || !encoder.matches(password, found.get().getPasswordHash())) {
            return error(401, "Invalid email or password.");
        }

        String token = sessions.createSession(email);

        try {
            appendCsvRow(email, Instant.now().toString(), httpReq.getRemoteAddr());
        } catch (IOException ignored) {
            // Audit logging is best-effort — don't block login on it.
        }

        return ResponseEntity.ok(authResult(token, email));
    }

    // ── Logout ───────────────────────────────────────────────────────────────
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest httpReq) {
        String authHeader = httpReq.getHeader("Authorization");
        String token = (authHeader != null && authHeader.startsWith("Bearer "))
                ? authHeader.substring(7).trim() : null;
        sessions.invalidate(token);
        return ResponseEntity.ok(Collections.singletonMap("status", "ok"));
    }

    // ── Current session ──────────────────────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest httpReq) {
        String email = (String) httpReq.getAttribute("userEmail");
        return ResponseEntity.ok(Collections.singletonMap("email", email));
    }

    // ── Admin: login history ─────────────────────────────────────────────────
    @GetMapping("/logins")
    public ResponseEntity<?> logins(HttpServletRequest httpReq) throws IOException {
        if (!isAdmin(httpReq)) return error(403, "Admin access only.");
        List<Map<String, String>> rows = readCsvRows();
        Collections.reverse(rows); // newest first
        return ResponseEntity.ok(rows);
    }

    @GetMapping("/logins/export")
    public ResponseEntity<?> exportCsv(HttpServletRequest httpReq) throws IOException {
        if (!isAdmin(httpReq)) return error(403, "Admin access only.");
        Path path = csvPath();
        byte[] bytes = Files.exists(path)
                ? Files.readAllBytes(path)
                : (CSV_HEADER + "\n").getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"logins.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private boolean isAdmin(HttpServletRequest httpReq) {
        String email = (String) httpReq.getAttribute("userEmail");
        return email != null && email.equalsIgnoreCase(adminEmail.trim());
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private Map<String, Object> authResult(String token, String email) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", token);
        result.put("email", email);
        return result;
    }

    private ResponseEntity<Map<String, String>> error(int status, String message) {
        return ResponseEntity.status(status).body(Collections.singletonMap("error", message));
    }

    private Path csvPath() { return Paths.get(csvPathProp); }

    private void appendCsvRow(String email, String timestamp, String ip) throws IOException {
        synchronized (CSV_LOCK) {
            Path path = csvPath();
            if (path.getParent() != null) {
                Files.createDirectories(path.getParent());
            }
            if (!Files.exists(path)) {
                Files.write(path, (CSV_HEADER + "\n").getBytes(StandardCharsets.UTF_8), StandardOpenOption.CREATE);
            }
            String line = String.format("%s,%s,%s%n", csvEscape(email), timestamp, csvEscape(ip));
            Files.write(path, line.getBytes(StandardCharsets.UTF_8), StandardOpenOption.APPEND);
        }
    }

    private List<Map<String, String>> readCsvRows() throws IOException {
        List<Map<String, String>> rows = new ArrayList<>();
        Path path = csvPath();
        if (!Files.exists(path)) return rows;

        List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);
        for (int i = 1; i < lines.size(); i++) { // skip header
            String line = lines.get(i);
            if (line.trim().isEmpty()) continue;
            String[] parts = line.split(",", -1);
            Map<String, String> row = new LinkedHashMap<>();
            row.put("email", parts.length > 0 ? csvUnescape(parts[0]) : "");
            row.put("timestamp", parts.length > 1 ? parts[1] : "");
            row.put("ip", parts.length > 2 ? csvUnescape(parts[2]) : "");
            rows.add(row);
        }
        return rows;
    }

    private String csvEscape(String v) {
        if (v == null) return "";
        return v.contains(",") ? "\"" + v.replace("\"", "\"\"") + "\"" : v;
    }

    private String csvUnescape(String v) {
        if (v != null && v.startsWith("\"") && v.endsWith("\"")) {
            return v.substring(1, v.length() - 1).replace("\"\"", "\"");
        }
        return v;
    }
}
