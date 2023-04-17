package com.prototype.occupi.service;

import com.prototype.occupi.model.Device;
import com.prototype.occupi.repository.DeviceRepository;

// Importing required classes
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;

// Annotation
@Service
// Class implementing DepartmentService class
public class DeviceServiceImpl
        implements DeviceService {

    private final DeviceRepository deviceRepository;

    public DeviceServiceImpl(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    // Save operation
    @Override
    public Device saveDevice(Device device)
    {
        return deviceRepository.save(device);
    }

    // Read operation
    @Override public List<Device> getDeviceList()
    {
        return (List<Device>)
                deviceRepository.findAll();
    }

    @Override
    public Optional<Device> getDeviceById(int id) {
        return deviceRepository.findById(id);
    }

    // Update operation
    @Override
    public Device
    updateDevice(Device device,
                 int id)
    {
        Device deviceDB
                = deviceRepository.findById(id)
                .orElse(null);

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
    @Override
    public void deleteDeviceById(int id)
    {
        deviceRepository.deleteById(id);
    }
}

