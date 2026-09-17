package com.postmanhelper.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "user_accounts")
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String createdAt;

    public Long getId()                    { return id; }
    public void setId(Long v)              { this.id = v; }

    public String getEmail()               { return email; }
    public void setEmail(String v)         { this.email = v; }

    public String getPasswordHash()        { return passwordHash; }
    public void setPasswordHash(String v)  { this.passwordHash = v; }

    public String getCreatedAt()           { return createdAt; }
    public void setCreatedAt(String v)     { this.createdAt = v; }
}
