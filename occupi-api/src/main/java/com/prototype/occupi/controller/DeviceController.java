// Java Program to Illustrate DepartmentController.java File

// Importing packages modules
package com.prototype.occupi.controller;

import com.prototype.occupi.model.Device;
import com.prototype.occupi.service.DeviceService;
import java.util.List;
import java.util.Optional;
// Importing required classes
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

// Annotation
@RestController
// Class
public class DeviceController {

    @Autowired private DeviceService deviceService;

    // Save operation
    @PostMapping("/devices")

    public Device saveDevice(
            @Valid @RequestBody Device device)
    {
        return deviceService.saveDevice(device);
    }

    // Read operation
    @GetMapping("/devices")

    public List<Device> getDeviceList()
    {
        return deviceService.getDeviceList();
    }

    @GetMapping("/devices/{id}")
    public Optional<Device> getDeviceById(@PathVariable("id")
                                Long deviceId) {return deviceService.getDeviceById(deviceId);}
    // Update operation
    @PutMapping("/devices/{id}")

    public Device
    updateDevice(@RequestBody Device device,
                     @PathVariable("id") Long deviceId)
    {
        return deviceService.updateDevice(
                device, deviceId);
    }

    // Delete operation
    @DeleteMapping("/devices/{id}")

    public String deleteDeviceById(@PathVariable("id")
                                       Long deviceId)
    {
        deviceService.deleteDeviceById(
                deviceId);
        return "Deleted Successfully";
    }
}

