package com.postmanhelper.model;

public class AdminResetPasswordRequest {

    private String email;
    private String newPassword;

    public String getEmail()               { return email; }
    public void   setEmail(String v)       { this.email = v; }

    public String getNewPassword()         { return newPassword; }
    public void   setNewPassword(String v) { this.newPassword = v; }
}
