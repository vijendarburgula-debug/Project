package com.postmanhelper.repository;

import com.postmanhelper.model.LoginRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoginRecordRepository extends JpaRepository<LoginRecordEntity, Long> {
    List<LoginRecordEntity> findAllByOrderByIdDesc();
}
