# Containerized ASP.NET Core Web API and Abgular

This is a Web App project which been continerized using Docker tool.
This project is been created using DotNet 6 for webApi and angular 15 for WebApp (FrontEnd).

The .Net Api project provides many endpoints:
  - Managing user account, such as:
    - Activating/creating superAdmin account,
    - Authenticating.
    - Generating Token
    - Giving permission to a member to register for an account,
    - Changing the role of a user (Editor or Admin),
    - Deactivate an account,
    - Delete an account
  
  - Managing profiles of different types of persons (employees, needy, customers...) such as:
     - Creating new profile.
     - Retrieving All profiles based on person type.
     - Retrieving a profile's data by its ID or CIN (Card Identity Number).
     - Creating new profile.
     - Updating Existing records.
     - and Deleting a profile.

# Getting startedon a Windows machine, you can follow these general steps:

To run this project:

1. Install Docker Desktop on your Windows machine. You can download it from the official Docker website: https://www.docker.com/products/docker-desktop

2. Open a command prompt or PowerShell window on your Windows machine.

3. Clone the GitHub repository that contains the Dockerized project to your local machine using the git clone command. For example, if the repository URL is https://github.com/hamzachtaibi/containerized-dotnet-webapi-angular.git, you can clone it with the following command:
```
git clone https://github.com/hamzachtaibi/containerized-dotnet-webapi-angular.git
```
4. Build the images:
  - Navigate to WebApi Directory where the Dockerfile is located and run this command to build the webApi Image:
  ```
  docker build -t hamzachtaibi/charity-api:5.0 .
  ```
 - Navigate to WebApp Directory where the Dockerfile is located and run this command to build the webApp Image:
  ```
  docker build -t hamzachtaibi/charity-web:5.0 .
  ```
5. Once the Docker images are built, you can use 'docker compose up' command to start and run the containers;
  navigate to the root directory where the file docker-compose.yml located and run this command
  ```
  docker compose up
  ```
  
# Accessing the Dockerized project
You can now access the Dockerized project by opening a web browser and navigating to http://localhost/4200.
Depending on the available ports number in your machin, you may need to provide additional configuration or environment variables (inside the docker-compose.yml File) to get it to work correctly.

You can access the SqlServer through Microsoft Sql Server Management studio using this credentials:
hostName : localhost,8001
password : SqlServer@2019

this credentials are defined in the docker-compose.yml file.

Note :
The chosen port in the docker-compose.yml file may not be available on your machin, and cause of that docker may choose a different port to access the application.

# Videos:

Source code :
[https://youtu.be/BYGDoWdBmlo](url)

Building images and discovering the web application:
[https://youtu.be/yJZdmRSgaZI](url)
