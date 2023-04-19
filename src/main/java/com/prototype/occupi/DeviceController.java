// Importing packages modules
package com.prototype.occupi;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Optional;

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
    @PutMapping("/devices/{mac}")

    public Device
    updateDevice(@RequestBody Device device,
                     @PathVariable("mac") String mac)
    {
        Device deviceDB
                = deviceRepository.findByMac(mac);

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
    @DeleteMapping("/devices/{mac}")

    public String deleteDeviceByMac(@PathVariable("mac")
                                       String mac)
    {
        deviceRepository.deleteByMac(mac);
        return "Deleted Successfully";
    }
}

