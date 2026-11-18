package com.omsairam.juice.repo;

import com.omsairam.juice.model.CustomerOrder;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<CustomerOrder, String> {
    List<CustomerOrder> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<CustomerOrder> findAllByOrderByCreatedAtDesc();

    List<CustomerOrder> findByStatusOrderByCreatedAtDesc(String status);

    Optional<CustomerOrder> findByRazorpayOrderId(String razorpayOrderId);

    long countByStatus(String status);

    long countByPaymentStatus(String paymentStatus);

    long countByCreatedAtGreaterThanEqual(Instant since);

    /** May return null when there are no matching orders (the service turns that into 0). */
    @Query("select sum(o.total) from CustomerOrder o where o.createdAt >= :since and o.status <> 'Cancelled'")
    BigDecimal sumTotalSince(@Param("since") Instant since);

    @Query("select sum(o.total) from CustomerOrder o where o.paymentStatus = 'Paid'")
    BigDecimal sumPaid();
}
