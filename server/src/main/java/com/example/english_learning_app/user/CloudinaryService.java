package com.example.english_learning_app.user;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (!hasValidCredentials()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Cloudinary credentials are not configured");
        }

        Map<?, ?> params = ObjectUtils.asMap(
            "folder", folder,
            "resource_type", "image"
        );
        
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
        return (String) uploadResult.get("secure_url");
    }

    public void deleteImage(String url) {
        if (url == null || url.isBlank() || url.contains("mock_cloud_name")) {
            return;
        }

        if (!hasValidCredentials()) {
            return;
        }

        try {
            String publicId = extractPublicId(url);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (IOException e) {
            // Log warning but don't fail user updates if image delete fails
            System.err.println("Failed to delete image from Cloudinary: " + e.getMessage());
        }
    }

    private String extractPublicId(String url) {
        // Example: https://res.cloudinary.com/demo/image/upload/v1570975253/avatars/sample.jpg
        // Public ID should be avatars/sample
        try {
            int uploadIndex = url.indexOf("/upload/");
            if (uploadIndex == -1) return null;
            
            // Skip "/upload/" and "v1234567/" if present
            String subStr = url.substring(uploadIndex + 8);
            int firstSlashIndex = subStr.indexOf("/");
            if (firstSlashIndex != -1 && subStr.substring(0, firstSlashIndex).startsWith("v")) {
                subStr = subStr.substring(firstSlashIndex + 1);
            }
            
            // Remove file extension
            int dotIndex = subStr.lastIndexOf(".");
            if (dotIndex != -1) {
                subStr = subStr.substring(0, dotIndex);
            }
            
            return subStr;
        } catch (Exception e) {
            return null;
        }
    }

    private boolean hasValidCredentials() {
        String cloudName = cloudinary.config.cloudName;
        String apiKey = cloudinary.config.apiKey;
        String apiSecret = cloudinary.config.apiSecret;

        return isConfigured(cloudName) && isConfigured(apiKey) && isConfigured(apiSecret)
            && !"mock_cloud_name".equals(cloudName)
            && !"mock_api_key".equals(apiKey)
            && !"mock_api_secret".equals(apiSecret);
    }

    private boolean isConfigured(String value) {
        return value != null && !value.isBlank();
    }
}
