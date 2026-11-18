package com.omsairam.juice.repo;

import com.omsairam.juice.model.AppUser;
import com.omsairam.juice.model.Role;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmailIgnoreCase(String email);

    Optional<AppUser> findByMobile(String mobile);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByMobile(String mobile);

    boolean existsByRole(Role role);
}
