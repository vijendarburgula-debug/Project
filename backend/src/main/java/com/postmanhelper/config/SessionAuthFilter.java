package com.postmanhelper.config;

import com.postmanhelper.service.SessionService;
import org.springframework.stereotype.Component;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

// Requires a valid session token (from /api/auth/login or /register) on every
// /api/** call except registration, login, and CORS preflight. Replaces the
// old pattern of trusting a client-supplied email/query-param for identity —
// anyone could set that to anything, whereas a session token is only handed
// out after a verified password check.
@Component
public class SessionAuthFilter implements Filter {

    private final SessionService sessions;

    public SessionAuthFilter(SessionService sessions) {
        this.sessions = sessions;
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpReq = (HttpServletRequest) req;
        HttpServletResponse httpRes = (HttpServletResponse) res;
        String path = httpReq.getRequestURI();
        String method = httpReq.getMethod();

        boolean isPublic = !path.startsWith("/api/")
                || "OPTIONS".equalsIgnoreCase(method)
                || path.equals("/api/auth/register")
                || path.equals("/api/auth/login")
                || path.equals("/api/auth/request-reset");

        if (isPublic) {
            chain.doFilter(req, res);
            return;
        }

        String authHeader = httpReq.getHeader("Authorization");
        String token = (authHeader != null && authHeader.startsWith("Bearer "))
                ? authHeader.substring(7).trim() : null;
        String email = sessions.resolve(token);

        if (email == null) {
            httpRes.setStatus(401);
            httpRes.setContentType("application/json");
            httpRes.getWriter().write("{\"error\":\"Not authenticated. Please log in.\"}");
            return;
        }

        httpReq.setAttribute("userEmail", email);
        chain.doFilter(req, res);
    }
}
