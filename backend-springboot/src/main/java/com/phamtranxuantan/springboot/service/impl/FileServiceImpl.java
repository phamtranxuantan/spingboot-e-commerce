package com.phamtranxuantan.springboot.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.phamtranxuantan.springboot.service.FileService;

@Service
public class FileServiceImpl implements FileService {
  @Override
  public String uploadImage(String path, MultipartFile file) throws IOException {
    String originalFileName = file.getOriginalFilename();
    String randomId = UUID.randomUUID().toString();
    @SuppressWarnings("null")
    String fileName = randomId.concat(originalFileName.substring(originalFileName.lastIndexOf('.')));
    String filePath = path + File.separator + fileName;
    File folder = new File(path);
    if (!folder.exists()) {
      folder.mkdir();
    }
    Files.copy(file.getInputStream(), Paths.get(filePath));
    return fileName;
  }

  @Override
  public InputStream getResource(String path, String fileName) throws FileNotFoundException {
    String filePath = path + File.separator + fileName;
    InputStream inputStream = new FileInputStream(filePath);
    return inputStream;
  }

  @Override
  public void deleteImage(String path, String fileName) throws IOException {
    Path filePath = Paths.get(path).resolve(fileName).normalize();
    Files.deleteIfExists(filePath);
  }
}
