package org.example.service;

import org.example.dto.TransportDTO;
import org.example.modal.Transport;

import java.util.List;
import java.util.Map;

public interface ITransportService {
	List<Transport> listAllTransports();

	Map<Integer, Transport> mapTransports();

	List<TransportDTO> listTransportsUsedInMonth();
}
