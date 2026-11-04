package org.example.dto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
@Data
@NoArgsConstructor
public class CalendarUpdateDTO {

    private Timestamp startDate;
    private int slot;
    private int voucherId; // Để nhận voucher ID
}