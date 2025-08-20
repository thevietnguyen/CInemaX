package com.cinemax.cinamaxbackend.entity;

import com.cinemax.cinamaxbackend.enums.ScreenType;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

@Entity
@Table(name = "rooms",
        uniqueConstraints = @UniqueConstraint(name = "uk_room_cinema_name", columnNames = {"cinema_id","name"}))
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Room {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 100)
    private String name;

    @Positive
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Column(name = "screen_type", length = 10)
    private ScreenType screenType;

    @Column(nullable = false)
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cinema_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_room_cinema"))
    @JsonBackReference
    private Cinema cinema;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Showtime> showtimes = new ArrayList<>();

}
