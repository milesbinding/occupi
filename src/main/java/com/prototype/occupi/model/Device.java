package com.prototype.occupi.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * The Device class represents a device that occupies a physical space.
 * It contains information such as the device's ID, MAC address, name, distance,
 * count of how many times it has been seen and timestamps for when it first
 * entered the room as well as its most recent activity.
 */
@Entity // Indicates that this class is a JPA entity to Spring
@Table(name = "devices") // Specifies the name of the database table to map this entity
@Data // A Lombok annotation to generate getters, setters, and toString methods
@NoArgsConstructor // A Lombok annotation to generate a no-args constructor
@AllArgsConstructor // A Lombok annotation to generate an all-args constructor
@Setter // A Lombok annotation to generate setter methods
@Getter // A Lombok annotation to generate getter methods
@ToString // A Lombok annotation to generate a toString method
public class Device {

    /**
     * The ID of the device (auto-generated by the database).
     */
    @Id // Indicates that this field is the primary key of the entity
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native") // Specifies how the primary key should be generated
    @Column(name = "id") // Specifies the name of the database column to map this field
    private int id;

    /**
     * The MAC address of the device.
     */
    @Column(name = "mac") // Specifies the name of the database column to map this field
    private String mac;

    /**
     * The name of the device.
     */
    @Column(name = "name") // Specifies the name of the database column to map this field
    private String name;

    /**
     * The timestamp of when the device was first seen.
     */
    @Column(name = "first_time_stamp") // Specifies the name of the database column to map this field
    private LocalDateTime first_time_stamp;

    /**
     * The current timestamp of the device's last seen activity.
     */
    @Column(name = "current_time_stamp") // Specifies the name of the database column to map this field
    private LocalDateTime current_time_stamp;

    /**
     * The distance of the device as calculated from RSSI.
     */
    @Column(name = "distance") // Specifies the name of the database column to map this field
    private String distance;

    /**
     * The number of times the device has been detected.
     */
    @Column(name = "counter") // Specifies the name of the database column to map this field
    private int counter;
}
