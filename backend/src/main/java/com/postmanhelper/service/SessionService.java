package com.postmanhelper.service;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.concurrent.ConcurrentHashMap;

// In-memory session store — tokens are opaque random strings, not JWTs, and
// don't survive a server restart (users just log in again). Good enough for
// a single-instance local/small-team tool; revisit if this needs to scale.
@Component
public class SessionService {

    private final ConcurrentHashMap<String, String> tokenToEmail = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    public String createSession(String email) {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        tokenToEmail.put(token, email);
        return token;
    }

    public String resolve(String token) {
        return token == null ? null : tokenToEmail.get(token);
    }

    public void invalidate(String token) {
        if (token != null) tokenToEmail.remove(token);
    }
}
