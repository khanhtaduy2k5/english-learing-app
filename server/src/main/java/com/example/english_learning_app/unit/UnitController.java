package com.example.english_learning_app.unit;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@RestController
@RequestMapping("/api/units")
@Tag(name = "Units", description = "Query study units")
@SecurityRequirement(name = "bearerAuth")
public class UnitController {

    private final UnitService unitService;

    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    @GetMapping
    @Operation(summary = "Get units", description = "Retrieve list of all units, optionally filtered by level")
    public List<Unit> getUnits(@RequestParam(required = false) String level) {
        if (level != null && !level.isBlank()) {
            return unitService.getUnitsByLevel(level);
        }
        return unitService.getAllUnits();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get unit by ID", description = "Retrieve single unit details")
    public ResponseEntity<Unit> getUnit(@PathVariable String id) {
        return unitService.getUnit(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
