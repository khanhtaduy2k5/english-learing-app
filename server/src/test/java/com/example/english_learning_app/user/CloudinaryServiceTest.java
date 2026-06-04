package com.example.english_learning_app.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.cloudinary.Cloudinary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

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
    public void testUploadImageWithMockConfig() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
            "file", 
            "test.png", 
            "image/png", 
            "test image content".getBytes()
        );

        String resultUrl = cloudinaryService.uploadImage(file, "avatars");
        
        assertNotNull(resultUrl);
        assertEquals("https://res.cloudinary.com/mock_cloud_name/image/upload/v1234567890/mock_avatar.png", resultUrl);
    }

    @Test
    public void testUploadEmptyFileThrowsException() {
        MockMultipartFile emptyFile = new MockMultipartFile(
            "file", 
            "empty.png", 
            "image/png", 
            new byte[0]
        );

        assertThrows(IllegalArgumentException.class, () -> {
            cloudinaryService.uploadImage(emptyFile, "avatars");
        });
    }

    @Test
    public void testDeleteImageMockConfigDoesNotThrow() {
        // Should return early and not throw any exception when mock cloud name is detected
        cloudinaryService.deleteImage("https://res.cloudinary.com/mock_cloud_name/image/upload/v1234567890/mock_avatar.png");
    }
}
