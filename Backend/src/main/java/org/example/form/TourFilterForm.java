package org.example.form;

import java.math.BigDecimal;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TourFilterForm {
	BigDecimal minBudget;
	BigDecimal maxBudget;
}