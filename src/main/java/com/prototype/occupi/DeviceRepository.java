package com.prototype.occupi;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepository extends CrudRepository<Device, Integer> {

    Device findByMac(String lastName);

    List<Device> deleteByMac(String mac);
}
