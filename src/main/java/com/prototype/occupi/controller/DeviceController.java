package com.prototype.occupi.controller;

import com.prototype.occupi.repository.DeviceRepository;
import com.prototype.occupi.model.Device;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

/**
 The DeviceController class is a Spring controller that handles REST API requests related to devices.
 It provides methods for creating, reading, updating, and deleting Device objects from a database using
 the DeviceRepository interface. This class is annotated with @RestController and @Transactional to enable
 transaction management for database operations.
 */
@RestController
@Transactional
public class DeviceController {

    /**
     No-args constructor for DeviceController.
     */
    public DeviceController(){

    }

    // Note: The @Autowired annotation in Spring is used to automatically wire (i.e., link),
    // Spring-managed beans with other beans.
    // It tells Spring to inject the dependency automatically.
    /**
     * Instantiates a new DeviceRepository for the DeviceController to use.
     */
    @Autowired
    public DeviceRepository deviceRepository;

    /**
     * HTTP POST method to save a Device.
     *
     * @param device Device object to save
     * @return Device object that was saved
     */
    @PostMapping("/devices")
    public Device saveDevice(
            @Valid @RequestBody Device device)
    {
        return deviceRepository.save(device);
    }

    /**
     * HTTP GET method to retrieve all Devices.
     *
     * @return Iterable list of Device objects
     */
    @GetMapping("/devices")
    public Iterable<Device> getDeviceList()
    {
        return deviceRepository.findAll();
    }

    /**
     * HTTP GET method to retrieve a Device by mac address.
     *
     * @param mac Mac address of the Device to retrieve
     * @return Device object that was retrieved
     */
    @GetMapping("/devices/{mac}")
    public Device getDeviceByMac(@PathVariable("mac") String mac) {
        return deviceRepository.findDeviceByMac(mac);
    }

    /**
     * HTTP PATCH method to update a Device.
     *
     * @param device Device object to update
     * @param mac    Mac address of the Device to update
     * @return Device object that was updated
     */
    @PatchMapping("/devices/{mac}")
    public Device updateDevice(@RequestBody Device device,
                               @PathVariable("mac") String mac)
    {
        Device deviceDB = deviceRepository.findDeviceByMac(mac);

        if (Objects.nonNull(device.getMac())) {
            assert deviceDB != null;
            deviceDB.setMac(device.getMac());
        }

        if (Objects.nonNull(device.getName())) {
            assert deviceDB != null;
            deviceDB.setName(device.getName());
        }

        if (Objects.nonNull(device.getDistance())) {
            assert deviceDB != null;
            deviceDB.setDistance(device.getDistance());
        }

        deviceDB.setFirst_time_stamp(device.getFirst_time_stamp());
        deviceDB.setCurrent_time_stamp(device.getCurrent_time_stamp());
        deviceDB.setCounter(device.getCounter());

        return deviceRepository.save(deviceDB);
    }

    /**
     * HTTP DELETE method to delete a Device by mac address.
     *
     * @param mac Mac address of the Device to delete
     * @return String message indicating the Device was deleted
     */
    @DeleteMapping("/devices/{mac}")
    public String deleteDeviceByMac(@PathVariable("mac") String mac)
    {
        deviceRepository.deleteDeviceByMac(mac);
        return "Deleted Successfully";
    }
}
