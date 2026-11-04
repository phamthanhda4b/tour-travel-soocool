package org.example.controller;

import org.example.dto.TransportDTO;
import org.example.modal.Transport;
import org.example.service.ITransportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class TransportController {
	@Autowired
	private ITransportService transportService;

	@GetMapping("/transports")
	public List<Transport> ListTransports() {
		return transportService.listAllTransports();
	}

	@GetMapping("/maptransports")
	public Map<Integer, Transport> mapTransport() {
		return transportService.mapTransports();
	}

	@GetMapping("/StasTransportUsed")
	public List<TransportDTO> listTransportsUsedInMonth() {
		return transportService.listTransportsUsedInMonth();
	}
}
