package com.example.english_learning_app.unit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class UnitServiceTest {

    private UnitRepository unitRepository;
    private UnitService unitService;

    @BeforeEach
    void setUp() {
        unitRepository = mock(UnitRepository.class);
        unitService = new UnitService(unitRepository);
    }

    @Test
    void getUnitsByLevelDelegatesToOrderedRepositoryQuery() {
        Unit unit = unit("unit-a1-1", "A1", 1);
        when(unitRepository.findByLevelOrderByNumberAsc("A1")).thenReturn(List.of(unit));

        List<Unit> result = unitService.getUnitsByLevel("A1");

        assertEquals("unit-a1-1", result.get(0).getId());
        verify(unitRepository).findByLevelOrderByNumberAsc("A1");
    }

    @Test
    void getAllUnitsDelegatesToRepository() {
        when(unitRepository.findAll()).thenReturn(List.of(unit("unit-1", "A1", 1), unit("unit-2", "A2", 2)));

        assertEquals(2, unitService.getAllUnits().size());
        verify(unitRepository).findAll();
    }

    @Test
    void getUnitReturnsRepositoryResult() {
        when(unitRepository.findById("unit-1")).thenReturn(Optional.of(unit("unit-1", "A1", 1)));

        Optional<Unit> result = unitService.getUnit("unit-1");

        assertTrue(result.isPresent());
        verify(unitRepository).findById("unit-1");
    }

    private Unit unit(String id, String level, int number) {
        return new Unit(id, level, number, "Unit " + number, "Theme", "book", Map.of(), OffsetDateTime.now());
    }
}
