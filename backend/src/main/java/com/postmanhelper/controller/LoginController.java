package com.postmanhelper.controller;

import com.postmanhelper.model.LoginRequest;
import com.postmanhelper.store.LoginStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

// Lightweight "who's using this tool" tracker — no passwords, no accounts.
// Anyone can type any email to get in; every login is recorded via LoginStore
// (a CSV file locally, or Postgres in production — see the store package).
@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Value("${app.admin.email}")
    private String adminEmail;

    private final LoginStore store;

    public LoginController(LoginStore store) {
        this.store = store;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest req, HttpServletRequest httpReq) {
        String email = req.getEmail() == null ? "" : req.getEmail().trim();
        if (email.isEmpty() || !email.contains("@")) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "A valid email is required."));
        }

        String timestamp = Instant.now().toString();
        String ip = httpReq.getRemoteAddr();

        try {
            store.append(email, timestamp, ip);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Could not record login: " + e.getMessage()));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "ok");
        result.put("email", email);
        result.put("timestamp", timestamp);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/logins")
    public ResponseEntity<?> logins(@RequestParam(required = false) String requesterEmail) throws IOException {
        if (!isAdmin(requesterEmail)) {
            return ResponseEntity.status(403).body(Collections.singletonMap("error", "Admin access only."));
        }
        return ResponseEntity.ok(store.list());
    }

    @GetMapping("/logins/export")
    public ResponseEntity<?> exportCsv(@RequestParam(required = false) String requesterEmail) throws IOException {
        if (!isAdmin(requesterEmail)) {
            return ResponseEntity.status(403).body(Collections.singletonMap("error", "Admin access only."));
        }
        byte[] bytes = store.exportCsv().getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"logins.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    private boolean isAdmin(String requesterEmail) {
        return requesterEmail != null && requesterEmail.trim().equalsIgnoreCase(adminEmail.trim());
    }
}
