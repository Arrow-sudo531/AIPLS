package com.learning.srl.repository;

import com.learning.srl.entity.Reflection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReflectionRepository extends JpaRepository<Reflection, Long> {
    List<Reflection> findByUserIdOrderByCreatedAtDesc(Long userId);
}
