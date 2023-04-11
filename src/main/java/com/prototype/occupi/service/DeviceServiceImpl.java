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
    public Optional<Device> getDeviceById(Long deviceId) {
        return deviceRepository.findById(deviceId);
    }

    // Update operation
    @Override
    public Device
    updateDevice(Device device,
                     Long deviceId)
    {
        Device deviceDB
                = deviceRepository.findById(deviceId)
                .orElse(null);

        if (Objects.nonNull(device.getDeviceName())
                && !"".equalsIgnoreCase(
                device.getDeviceName())) {
            assert deviceDB != null;
            deviceDB.setDeviceName(
                    device.getDeviceName());
        }

        if (Objects.nonNull(
                device.getDeviceAddress())) {
            assert deviceDB != null;
            deviceDB.setDeviceAddress(
                    device.getDeviceAddress());
        }

        deviceDB.setDeviceTimestamp(
                device.getDeviceTimestamp());

        return deviceRepository.save(deviceDB);
    }

    // Delete operation
    @Override
    public void deleteDeviceById(Long deviceId)
    {
        deviceRepository.deleteById(deviceId);
    }
}

