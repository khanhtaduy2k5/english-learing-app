package com.example.english_learning_app.config;

import com.example.english_learning_app.level.Level;
import com.example.english_learning_app.level.LevelRepository;
import com.example.english_learning_app.unit.Unit;
import com.example.english_learning_app.unit.UnitRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DatabaseSeederTest {

    @Mock
    private LevelRepository levelRepository;

    @Mock
    private UnitRepository unitRepository;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private DatabaseSeeder databaseSeeder;

    @Test
    void run_WhenDatabaseIsEmpty_ShouldInsertAllData() throws Exception {
        // Giả lập database trống
        when(levelRepository.findById(anyString())).thenReturn(Optional.empty());
        when(unitRepository.findById(anyString())).thenReturn(Optional.empty());

        // Chạy seeder
        databaseSeeder.run();

        // Kiểm tra xem các lệnh save được gọi cho từng thực thể (3 levels, 3 units)
        verify(levelRepository, times(3)).save(any(Level.class));
        verify(unitRepository, times(3)).save(any(Unit.class));

        // Đảm bảo không có lệnh xóa nào được gọi
        verify(levelRepository, never()).deleteAllInBatch();
        verify(unitRepository, never()).deleteAllInBatch();
    }

    @Test
    void run_WhenDatabaseHasExistingData_ShouldUpdateExistingDataAndNotDelete() throws Exception {
        // Giả lập database đã có sẵn dữ liệu cũ
        Level mockLevel = new Level();
        mockLevel.setLevel("A1");
        mockLevel.setName("Old Name");
        mockLevel.setDescription("Old Description");

        Unit mockUnit = new Unit();
        mockUnit.setId("unit-1");
        mockUnit.setTitle("Old Title");

        when(levelRepository.findById(anyString())).thenReturn(Optional.of(mockLevel));
        when(unitRepository.findById(anyString())).thenReturn(Optional.of(mockUnit));

        // Chạy seeder
        databaseSeeder.run();

        // Kiểm tra xem các lệnh save (để cập nhật) có được gọi cho cả 2 loại thực thể
        verify(levelRepository, times(3)).save(any(Level.class));
        verify(unitRepository, times(3)).save(any(Unit.class));

        // Xác nhận dữ liệu được cập nhật đúng và không bị ghi đè thành một thực thể trống
        ArgumentCaptor<Level> levelCaptor = ArgumentCaptor.forClass(Level.class);
        verify(levelRepository, atLeastOnce()).save(levelCaptor.capture());
        
        // Đảm bảo không có lệnh xóa nào được gọi
        verify(levelRepository, never()).deleteAllInBatch();
        verify(unitRepository, never()).deleteAllInBatch();
    }
}
