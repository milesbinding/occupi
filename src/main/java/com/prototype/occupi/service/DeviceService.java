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
    Optional<Device> getDeviceById(int id);

    // Update operation
    Device updateDevice(Device device, int id);

    // Delete operation
    void deleteDeviceById(int id);
}

