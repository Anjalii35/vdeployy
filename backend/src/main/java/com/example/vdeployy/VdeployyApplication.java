package com.example.vdeployy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class VdeployyApplication {

	public static void main(String[] args) {
		SpringApplication.run(VdeployyApplication.class, args);
	}
}
