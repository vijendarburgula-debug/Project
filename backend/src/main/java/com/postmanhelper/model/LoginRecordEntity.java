package com.postmanhelper.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "login_records")
public class LoginRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String timestamp;

    private String ip;

    public Long getId()                { return id; }
    public void setId(Long v)          { this.id = v; }

    public String getEmail()           { return email; }
    public void setEmail(String v)     { this.email = v; }

    public String getTimestamp()       { return timestamp; }
    public void setTimestamp(String v) { this.timestamp = v; }

    public String getIp()              { return ip; }
    public void setIp(String v)        { this.ip = v; }
}
