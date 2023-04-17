package com.prototype.occupi.model;

// Importing required classes
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

// Class
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String mac;
    private LocalDateTime time_stamp;
    private String distance;
    private int counter;
}