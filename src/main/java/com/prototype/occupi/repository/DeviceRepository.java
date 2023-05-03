package com.prototype.occupi.repository;

import com.prototype.occupi.model.Device;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**

 The DeviceRepository interface is a Spring Data repository that provides methods for performing CRUD operations
 on Device objects in a database. It extends the CrudRepository interface and defines additional methods for
 finding and deleting Device objects by their MAC address. This interface is annotated with @Repository to indicate
 that it is a Spring repository component.
 */
@Repository
public interface DeviceRepository extends CrudRepository<Device, String> {
    /**
     * Finds a device by its MAC address.
     *
     * @param mac the MAC address of the device to find
     * @return the Device object that matches the specified MAC address, or null if no match is found
     */
    Device findDeviceByMac(String mac);

    /**
     * Deletes a device by its MAC address.
     *
     * @param mac the MAC address of the device to delete
     */
    void deleteDeviceByMac(String mac);
}
