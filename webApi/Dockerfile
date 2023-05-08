#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

#====== Stage 1 ================================
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
# create a New folder inside the container and name it "app"
WORKDIR /app
EXPOSE 80
EXPOSE 443

#====== Stage 2 : create 1st IMAGE (Build Edition) ================================

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

# Create New folder "src" inside the container and in the same level with the folder "app"
WORKDIR /src

# try copy the ".csproj" of our application to new folder "webApi".
# the "webApi" will be created inside "/src"
COPY ["webApi/webApi.csproj", "webApi/"]

# importe all the dependencie indicated in ".csproj" file to the same directory /src/webApi
RUN dotnet restore "webApi/webApi.csproj"

# now let's make a copy of the entire content of the root of the project to the /src/webApi
COPY . .


WORKDIR "/src/webApi"
RUN dotnet build "webApi.csproj" -c Release -o /app/build

#====== Stage 3 : create 2nd IMAGE (Publish Edition) ================================

# create another Release based on the old "image build" and save it in "/app" folder
FROM build AS publish
RUN dotnet publish "webApi.csproj" -c Release -o /app/publish


#====== Stage 4 : create 3rd IMAGE (Final Edition)================================

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "/app/webApi.dll"]
