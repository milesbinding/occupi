// Java Program to Illustrate DepartmentController.java File

// Importing packages modules
package com.prototype.occupi.controller;

import com.prototype.occupi.model.Device;
import com.prototype.occupi.service.DeviceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// Annotation
@RestController
// Class
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

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
                                              int id) {return deviceService.getDeviceById(id);}
    // Update operation
    @PutMapping("/devices/{id}")

    public Device
    updateDevice(@RequestBody Device device,
                     @PathVariable("id") int id)
    {
        return deviceService.updateDevice(
                device, id);
    }

    // Delete operation
    @DeleteMapping("/devices/{id}")

    public String deleteDeviceById(@PathVariable("id")
                                       int id)
    {
        deviceService.deleteDeviceById(
                id);
        return "Deleted Successfully";
    }
}

