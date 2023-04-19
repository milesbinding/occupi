package com.prototype.occupi;

// Importing required classes
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "DEVICES")
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