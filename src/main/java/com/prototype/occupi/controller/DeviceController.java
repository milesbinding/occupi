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
                                          String mac) {return deviceRepository.findDeviceByMac(mac);}
    // Update operation
    @PatchMapping("/devices/{mac}")
    public Device
    updateDevice(@RequestBody Device device,
                     @PathVariable("mac") String mac)
    {
        Device deviceDB
                = deviceRepository.findDeviceByMac(mac);

        if (Objects.nonNull(
                device.getMac())) {
            assert deviceDB != null;
            deviceDB.setMac(
                    device.getMac());
        }

        if (Objects.nonNull(
                device.getName())) {
            assert deviceDB != null;
            deviceDB.setName(
                    device.getName());
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
    @DeleteMapping("/devices/{mac}")
    public String deleteDeviceByMac(@PathVariable("mac")
                                       String mac)
    {
        deviceRepository.deleteDeviceByMac(mac);
        return "Deleted Successfully";
    }
}

