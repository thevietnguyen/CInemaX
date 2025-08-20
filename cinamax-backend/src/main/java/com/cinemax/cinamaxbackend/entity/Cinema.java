package com.cinemax.cinamaxbackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

@Entity
@Table(name = "cinemas",
        uniqueConstraints = @UniqueConstraint(name = "uk_cinema_name_city", columnNames = {"name","city"}))
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Cinema {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 150)
    private String name;

    @NotBlank @Size(max = 255)
    private String address;

    @NotBlank @Size(max = 100)
    private String city;

    @OneToMany(mappedBy = "cinema", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Room> rooms = new ArrayList<>();

}
