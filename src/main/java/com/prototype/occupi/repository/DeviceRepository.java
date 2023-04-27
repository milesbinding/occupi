package com.prototype.occupi.repository;

import com.prototype.occupi.model.Device;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends CrudRepository<Device, String> {

    Device findDeviceByMac(String mac);
    void deleteDeviceByMac(String mac);
}
