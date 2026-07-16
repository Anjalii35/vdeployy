package com.example.vdeployy.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FrameworkInfo {
    private final String name;
    private final String buildCommand;
    private final String outputFolder;
}
