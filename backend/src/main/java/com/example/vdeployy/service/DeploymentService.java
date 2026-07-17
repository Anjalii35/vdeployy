package com.example.vdeployy.service;

import com.example.vdeployy.dtos.DeployResp;
import com.example.vdeployy.enums.Role;
import com.example.vdeployy.enums.Status;
import com.example.vdeployy.model.Deployment;
import com.example.vdeployy.model.FrameworkInfo;
import com.example.vdeployy.model.Project;
import com.example.vdeployy.model.User;
import com.example.vdeployy.repo.DeploymentRepo;
import com.example.vdeployy.repo.ProjectRepo;
import com.example.vdeployy.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeploymentService {

    @Autowired
    private DeploymentRepo deploymentRepo;
    @Autowired
    private ProjectRepo projectRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;
    @Value(("${aws.region}"))
    private String region;


    private User getCurrentUSer(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User Not Found"));
    }

    public DeployResp deploy(Long projectId){
        User user = getCurrentUSer();
        Project project = projectRepo.findById(projectId).orElseThrow(() -> new RuntimeException("Project Not Found"));

        if(user.getRole() != Role.ADMIN && !project.getUser().getId().equals(user.getId())){
            throw new RuntimeException("Access Denied: Not your project");
        }

        // Step 1 — Save as QUEUED
        Deployment deployment = new Deployment();
        deployment.setProject(project);
        deployment.setGithubUrl(project.getGithubUrl());
        deployment.setStatus(Status.QUEUED);
        deploymentRepo.save(deployment);

        runBuildAsync(deployment.getId());

        return new DeployResp(deployment.getId(), deployment.getStatus(), deployment.getGithubUrl(), deployment.getLogs(),
                deployment.getLiveUrl(), deployment.getStartedAt(), deployment.getCompletedAt());
    }

    @Async
    public void runBuildAsync(Long deloymentId){

        Deployment deployment = deploymentRepo.findById(deloymentId).orElseThrow(() -> new RuntimeException("Deployment Not Found"));
        Project project = deployment.getProject();

        String cloneDir = "/tmp/vdeploy/build-" + deployment.getId();

        StringBuilder logs = new StringBuilder();
        try{
            // CLONING
            deployment.setStatus(Status.CLONING);
            deploymentRepo.save(deployment);

            logs.append(runCommand("git clone " + project.getGithubUrl() + " " + cloneDir, null));
            deployment.setLogs(logs.toString());
            deploymentRepo.save(deployment);

            // DETECT FRAMEWORK
            FrameworkInfo framework = detectFramework(cloneDir);
            logs.append("Framework Detected: ").append(framework.getName()).append("\n");

            deployment.setLogs(logs.toString());
            deploymentRepo.save(deployment);

            deployment.setStatus(Status.INSTALLING);
            deploymentRepo.save(deployment);
            deployment.setStatus(Status.BUILDING);
            deploymentRepo.save(deployment);

            String nodeImage = detectNodeVersion(cloneDir);
            logs.append("Using Docker Image: " + nodeImage + "\n");

            String dockerPAth = cloneDir;
            logs.append(runCommand(
                    "docker run --rm -v " + dockerPAth + ":/app -w /app " + nodeImage +
                            " sh -c \"npm install && NODE_OPTIONS=--openssl-legacy-provider " +
                            framework.getBuildCommand() + "\"", null
            ));

            deployment.setLogs(logs.toString());
            deploymentRepo.save(deployment);

            String outputPath = findOutputFolder(cloneDir, framework.getOutputFolder());
            System.out.println(outputPath);

            // UPLOADING
            deployment.setStatus(Status.UPLOADING);
            deploymentRepo.save(deployment);
            logs.append("Uploading to S3...\n");

            deployment.setLogs(logs.toString());
            deploymentRepo.save(deployment);

            String liveUrl = uploadToS3(outputPath, deployment.getId());

            // LIVE
            deployment.setStatus(Status.LIVE);
            deployment.setLiveUrl(liveUrl);
            deployment.setCompletedAt(LocalDateTime.now());
            logs.append("Deployment Completed...\n");
            logs.append("Live URL: ").append(liveUrl).append("\n");
        }
        catch(Exception e){
            logs.append("ERROR: ").append(e.getMessage()).append("\n");
            deployment.setStatus(Status.FAILED);
            deployment.setCompletedAt(LocalDateTime.now());
        }
        finally {
            deleteDirectory(new File(cloneDir));
        }

        deployment.setLogs(logs.toString());
        deploymentRepo.save(deployment);
    }

    private String uploadToS3(String outputPath, Long deploymentId){

        File outputDir = new File(outputPath);
        String s3Prefix = "deployments/" + deploymentId + "/";

        uploadDirectory(outputDir, outputDir, s3Prefix);

        return "http://" + bucketName + ".s3." + region + ".amazonaws.com/" + s3Prefix + "index.html";
    }
    private void uploadDirectory(File rootDir, File currentDir, String s3Prefix){
        File[] files = currentDir.listFiles();
        if(files == null) return;

        for(File file: files){
            if(file.isDirectory()){
                uploadDirectory(rootDir, file, s3Prefix);
            }
            else{
                String relativePath = rootDir.toPath().relativize(file.toPath()).toString().replace("\\","/");
                String s3Key = s3Prefix + relativePath;

                PutObjectRequest req = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(s3Key)
                        .build();
                s3Client.putObject(req, RequestBody.fromFile(file));
            }
        }
    }

    private String runCommand(String command, String dir) throws Exception{
        ProcessBuilder pb = new ProcessBuilder("sh", "-c", command)
                .redirectErrorStream(true);

        if(dir != null){
            pb.directory(new File(dir));
        }
        Process process = pb.start();

        BufferedReader reader = new BufferedReader(new InputStreamReader((process.getInputStream())));

        StringBuffer output = new StringBuffer();
        String line;
        while((line = reader.readLine()) != null){
            output.append(line).append("\n");
        }

        int exitCode = process.waitFor();
        if(exitCode != 0){
            throw new RuntimeException("Command failed: " + command + "\n" + output);
        }
        return output.toString();
    }

    private FrameworkInfo detectFramework(String cloneDir) throws Exception{

        File packageJsonFile = new File(cloneDir, "package.json");
        if(!packageJsonFile.exists()){
            throw new RuntimeException("No package.json found - only Node-based projects supported for now");
        }
        ObjectMapper mapper = new ObjectMapper();
        JsonNode json = mapper.readTree(packageJsonFile);

        JsonNode deps = json.get("dependencies");
        JsonNode devDeps = json.get("devDependencies");

        if(deps != null && deps.has("next")){
            return new FrameworkInfo("Next.js", "npm run build", "out");
        }
        if(devDeps != null && devDeps.has("vite")){
            return new FrameworkInfo("React (Vite)", "npm run build -- --base=./", "dist");
        }
        if(deps != null && deps.has("@angular/core")){
            return new FrameworkInfo("Angular", "npm run build -- --base-href=./", "dist");
        }

        return new FrameworkInfo("Node.js", "npm run build", "build");
    }

    private String detectNodeVersion(String cloneDir){
        try {
            File packageJsonFile = new File(cloneDir, "package.json");
            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(packageJsonFile);
            JsonNode engines = json.get("engines");

            if(engines != null && engines.has("node")){
                String version = engines.get("node").asText();
                String major = version.replaceAll(".*?(\\d+).*", "$1");
                return "node:" + major + "-alpine";
            }
        }
        catch (Exception e){
            e.getMessage();
        }
        return "node:20-alpine";
    }

//    private String findOutputFolder(String cloneDir, String expectedFolderName){
//
//        File expectedFol = new File(cloneDir, expectedFolderName);
//        if(expectedFol.exists() && expectedFol.isDirectory()){
//            return expectedFol.getAbsolutePath();
//        }
////        in case didn't get expected folder maybe get other to check that
//        String[] commanNames = {"dist", "build", "out", "public"};
//        for (String name: commanNames){
//            File folder = new File(cloneDir, name);
//            if(folder.exists() && folder.isDirectory()){
//                return folder.getAbsolutePath();
//            }
//        }
//        throw new RuntimeException("Could not find build output folder in " + cloneDir);
//    }

private String findOutputFolder(String cloneDir, String expectedFolderName){

    File expectedFol = new File(cloneDir, expectedFolderName);
    if(expectedFol.exists() && expectedFol.isDirectory()){
        expectedFol = checkNested(expectedFol);
        return expectedFol.getAbsolutePath();
    }

    String[] commanNames = {"dist", "build", "out", "public"};
    for (String name: commanNames){
        File folder = new File(cloneDir, name);
        if(folder.exists() && folder.isDirectory()){
            folder = checkNested(folder);
            return folder.getAbsolutePath();
        }
    }
    throw new RuntimeException("Could not find build output folder in " + cloneDir);
}

    // If index.html isn't directly inside, look one folder deeper (Angular nests like dist/{project-name}/)
    private File checkNested(File folder){
        if(new File(folder, "index.html").exists()){
            return folder; // index.html found directly, nothing to do
        }

        File[] subFolders = folder.listFiles(File::isDirectory);
        if(subFolders != null){
            for(File sub : subFolders){
                if(new File(sub, "index.html").exists()){
                    return sub; // found it one level deeper
                }
            }
        }
        return folder;
    }

    // as redeploy create clone folder again & again
    private void deleteDirectory(File dir){
        File[] files = dir.listFiles();
        if(files != null){
            for(File file: files){
                if(file.isDirectory()){
                    deleteDirectory(file);
                }
                else{
                    file.delete();
                }
            }
        }
        dir.delete();
    }

//    ----------- deploy completed ------------

    public List<DeployResp> getProjDeployments(Long projectId, int pageNo, int pageSize){
        User user = getCurrentUSer();

        Project project = projectRepo.findById(projectId).orElseThrow(() -> new RuntimeException("Project Not Found"));

        if(user.getRole() != Role.ADMIN && !project.getUser().getId().equals(user.getId())){
            throw new RuntimeException("Access Denied: Not your project");
        }

        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Deployment> deployments = deploymentRepo.findByProjectId(projectId, pageable);

        return deployments.getContent()
                .stream()
                .map(deploy -> new DeployResp(
                        deploy.getId(), deploy.getStatus(), deploy.getGithubUrl(), deploy.getLogs(), deploy.getLiveUrl(),
                        deploy.getStartedAt(), deploy.getCompletedAt()
                ))
                .toList();
    }

    public DeployResp getDeployment(Long id){
        User user = getCurrentUSer();

        Deployment deployment = deploymentRepo.findById(id).orElseThrow(() -> new RuntimeException("Deployment Not Found"));

        if(user.getRole() != Role.ADMIN && !deployment.getProject().getUser().getId().equals(user.getId())){
            throw new RuntimeException("Access Denied: Not your project");
        }

        return new DeployResp(
                deployment.getId(), deployment.getStatus(), deployment.getGithubUrl(), deployment.getLogs(),
                deployment.getLiveUrl(), deployment.getStartedAt(), deployment.getCompletedAt()
        );
    }

    public void deleteDeployment(Long id){
        User user = getCurrentUSer();

        Deployment deployment = deploymentRepo.findById(id).orElseThrow(() -> new RuntimeException("Deployment Not Found"));

        if(user.getRole() != Role.ADMIN && !deployment.getProject().getUser().getId().equals(user.getId())){
            throw new RuntimeException("Access Denied: Not your project");
        }
        deploymentRepo.deleteById(id);
    }
}