package com.example.english_learning_app.unit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

class UnitControllerTest {

    private UnitService unitService;
    private UnitController unitController;

    @BeforeEach
    void setUp() {
        unitService = mock(UnitService.class);
        unitController = new UnitController(unitService);
    }

    @Test
    void getUnitsReturnsAllUnitsWhenNoLevelFilterIsProvided() {
        Unit unit = unit("unit-1", "A1", 1);
        when(unitService.getAllUnits()).thenReturn(List.of(unit));

        List<Unit> result = unitController.getUnits(null);

        assertEquals(1, result.size());
        assertEquals("unit-1", result.get(0).getId());
        verify(unitService).getAllUnits();
    }

    @Test
    void getUnitsUsesLevelFilterWhenProvided() {
        Unit unit = unit("unit-2", "B1", 2);
        when(unitService.getUnitsByLevel("B1")).thenReturn(List.of(unit));

        List<Unit> result = unitController.getUnits("B1");

        assertEquals("B1", result.get(0).getLevel());
        verify(unitService).getUnitsByLevel("B1");
    }

    @Test
    void getUnitReturnsOkWhenFound() {
        when(unitService.getUnit("unit-1")).thenReturn(Optional.of(unit("unit-1", "A1", 1)));

        ResponseEntity<Unit> response = unitController.getUnit("unit-1");

        assertEquals(200, response.getStatusCode().value());
        assertEquals("unit-1", response.getBody().getId());
    }

    @Test
    void getUnitReturnsNotFoundWhenMissing() {
        when(unitService.getUnit("missing")).thenReturn(Optional.empty());

        ResponseEntity<Unit> response = unitController.getUnit("missing");

        assertEquals(404, response.getStatusCode().value());
        assertNull(response.getBody());
    }

    private Unit unit(String id, String level, int number) {
        return new Unit(id, level, number, "Unit " + number, "Theme", "book", Map.of("pass", true), OffsetDateTime.now());
    }
}
