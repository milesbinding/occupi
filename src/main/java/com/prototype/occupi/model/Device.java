package com.prototype.occupi.model;

// Importing required classes

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "devices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString

// Class
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @Column(name = "id")
    private int id;
    @Column(name = "mac")
    private String mac;
    @Column(name = "time_stamp")
    private LocalDateTime time_stamp;
    @Column(name = "distance")
    private String distance;
    @Column(name = "counter")
    private int counter;
}