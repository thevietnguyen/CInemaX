package com.cinemax.cinamaxbackend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seats",
        uniqueConstraints = @UniqueConstraint(name = "uk_seat_room_label_num", columnNames = {"room_id","row_label","seat_number"}),
        indexes = @Index(name = "idx_seat_room", columnList = "room_id"))
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Seat {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_seat_room"))
    @JsonBackReference
    private Room room;

    @NotBlank
    @Column(name = "row_label", length = 5, nullable = false)
    private String rowLabel;

    @NotNull @Positive
    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber;

    @Size(max = 20)
    private String type;

}
