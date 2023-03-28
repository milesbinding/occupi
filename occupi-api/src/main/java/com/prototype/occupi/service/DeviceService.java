package com.prototype.occupi.service;
// Java Program to Illustrate DepartmentService.java File

import com.prototype.occupi.model.Device;
// Importing required classes
import java.util.List;
import java.util.Optional;

// Class
public interface DeviceService {

    // Save operation
    Device saveDevice(Device device);

    // Read operation
    List<Device> getDeviceList();
    Optional<Device> getDeviceById(Long deviceId);

    // Update operation
    Device updateDevice(Device device, Long deviceId);

    // Delete operation
    void deleteDeviceById(Long deviceId);
}

