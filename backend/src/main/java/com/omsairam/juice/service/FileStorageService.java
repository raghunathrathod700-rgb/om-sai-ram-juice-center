package com.omsairam.juice.service;

import com.omsairam.juice.config.Props;
import com.omsairam.juice.web.ApiException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/** Stores product photos on disk (upload folder / products). Only real JPEG, PNG and WebP images are accepted. */
@Service
public class FileStorageService {
    private final Path dir;

    public FileStorageService(Props.Upload props) throws IOException {
        this.dir = Path.of(props.dir()).toAbsolutePath().normalize().resolve("products");
        Files.createDirectories(dir);
    }

    /** Saves the photo and returns the stored file name (not the full path). */
    public String save(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("Please choose a photo.");
        }
        String extension;
        try (InputStream in = file.getInputStream()) {
            byte[] head = in.readNBytes(12);
            extension = detectExtension(head);
        } catch (IOException e) {
            throw ApiException.badRequest("Could not read the photo.");
        }
        if (extension == null) {
            throw ApiException.badRequest("Only JPG, PNG or WebP photos are allowed.");
        }
        String name = UUID.randomUUID() + "." + extension;
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, dir.resolve(name), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new ApiException(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR, "Could not save the photo.");
        }
        return name;
    }

    public void delete(String name) {
        if (name == null || name.isBlank() || name.contains("/") || name.contains("\\") || name.contains("..")) {
            return;
        }
        try {
            Files.deleteIfExists(dir.resolve(name));
        } catch (IOException ignored) {
            // an old file that cannot be removed is not worth failing the request
        }
    }

    /** Looks at the first bytes (not the file name) to decide what the file really is. */
    private static String detectExtension(byte[] b) {
        if (b.length >= 3 && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF) {
            return "jpg";
        }
        if (b.length >= 8 && (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G') {
            return "png";
        }
        if (b.length >= 12 && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P') {
            return "webp";
        }
        return null;
    }
}
