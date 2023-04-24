// Importing packages modules
package com.prototype.occupi.controller;

import com.prototype.occupi.repository.DeviceRepository;
import com.prototype.occupi.model.Device;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

// Annotation
@RestController
// Class
public class DeviceController {

    @Autowired
    public DeviceRepository deviceRepository;

    // Save operation
    @PostMapping("/devices")

    public Device saveDevice(
            @Valid @RequestBody Device device)
    {
        return deviceRepository.save(device);
    }

    // Read operation
    @GetMapping("/devices")
    public Iterable<Device> getDeviceList()
    {
        return deviceRepository.findAll();
    }
    @GetMapping("/devices/{mac}")
    public Device getDeviceByMac(@PathVariable("mac")
                                          String mac) {return deviceRepository.findByMac(mac);}
    // Update operation
    @PatchMapping("/devices/{id}")
    public Device
    updateDevice(@RequestBody Device device,
                     @PathVariable("id") int id)
    {
        Device deviceDB
                = deviceRepository.findById(id).get();

        if (Objects.nonNull(
                device.getMac())) {
            assert deviceDB != null;
            deviceDB.setMac(
                    device.getMac());
        }

        if (Objects.nonNull(
                device.getDistance())) {
            assert deviceDB != null;
            deviceDB.setDistance(
                    device.getDistance());
        }

        deviceDB.setTime_stamp(
                device.getTime_stamp());

        deviceDB.setCounter(
                device.getCounter());

        return deviceRepository.save(deviceDB);
    }

    // Delete operation
    @DeleteMapping("/devices/{id}")
    public String deleteDeviceById(@PathVariable("id")
                                       int id)
    {
        deviceRepository.deleteById(id);
        return "Deleted Successfully";
    }
}

