package com.phamtranxuantan.springboot.entity;
import java.time.LocalDateTime;
import java.util.Objects;

import jakarta.persistence.*;
import lombok.*;



@Entity
@Table(name = "vehicle_position")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehiclePosition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double latitude;
    private double longitude;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof VehiclePosition)) return false;
        VehiclePosition that = (VehiclePosition) o;
        return Double.compare(latitude, that.latitude) == 0 &&
               Double.compare(longitude, that.longitude) == 0 &&
               Objects.equals(updatedAt, that.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(latitude, longitude, updatedAt);
    }
}
