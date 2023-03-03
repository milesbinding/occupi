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

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

// Class
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long deviceId;
    private String deviceName;
    private String deviceAddress;
    private long deviceTimestamp;
}