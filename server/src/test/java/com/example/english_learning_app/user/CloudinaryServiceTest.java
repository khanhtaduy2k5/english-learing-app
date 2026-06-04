package com.example.english_learning_app.user;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import com.cloudinary.Cloudinary;

public class CloudinaryServiceTest {

    private CloudinaryService cloudinaryService;
    private Cloudinary cloudinary;

    @BeforeEach
    public void setUp() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "mock_cloud_name");
        config.put("api_key", "mock_api_key");
        config.put("api_secret", "mock_api_secret");
        cloudinary = new Cloudinary(config);
        cloudinaryService = new CloudinaryService(cloudinary);
    }

    @Test
    public void testUploadImageWithMockConfigThrowsException() {
        MockMultipartFile file = new MockMultipartFile(
            "file", 
            "test.png", 
            "image/png", 
            "test image content".getBytes()
        );

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            cloudinaryService.uploadImage(file, "avatars");
        });

        assertEquals("Cloudinary credentials are not configured", exception.getMessage());
    }

    @Test
    public void testUploadEmptyFileThrowsException() {
        MockMultipartFile emptyFile = new MockMultipartFile(
            "file", 
            "empty.png", 
            "image/png", 
            new byte[0]
        );

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            cloudinaryService.uploadImage(emptyFile, "avatars");
        });

        assertEquals("File is empty", exception.getMessage());
    }

    @Test
    public void testDeleteImageMockConfigDoesNotThrow() {
        // Should return early and not throw any exception when mock cloud name is detected
        cloudinaryService.deleteImage("https://res.cloudinary.com/mock_cloud_name/image/upload/v1234567890/mock_avatar.png");
    }
}
