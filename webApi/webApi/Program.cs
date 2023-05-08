
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using webApi.Repository.IRepository;
using webApi.Mapper;
using webApi.Repository;
using webApi.Data;

var builder = WebApplication.CreateBuilder(args);
var allowedSpecificOrgins = "AllowNgUI";

//=========================Add services to the container.===============================

var dbHostName = Environment.GetEnvironmentVariable("DB_HOST_NAME");
var db_Name = Environment.GetEnvironmentVariable("DB_Name");
var dbPassword = Environment.GetEnvironmentVariable("DB_MSSQL_SA_PASSWORD");
var DefaultConnection = $"Data Source={dbHostName};Initial Catalog={db_Name};User ID=sa; Password={dbPassword}";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(DefaultConnection,
        sqlServerOptionsAction: sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(2), errorNumbersToAdd: null);
        }
    );
});

builder.Services.AddDbContext<AppIdentityDbContext>(options =>
{
    options.UseSqlServer(DefaultConnection);
});


builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    //Configure the user Credential
    options.Password.RequiredLength = 9;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;

    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(3);

    options.User.RequireUniqueEmail = true;
})
    .AddEntityFrameworkStores<AppIdentityDbContext>(); //Adding this; allow the Identity Systeme to use AppIdentityDbContext to access Identity Tables...



//Confugure the Authentication Handlers, so the server can read the Cookies, Tokens...

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
}
)
    //Add Authentication Types
    // 1- Token by Issuer JwtBearer:
    .AddJwtBearer(options =>
    {
        options.SaveToken = false; //if you set this to true. the JWT token that is received in the request will be saved in the HttpContext.User object, which is then available for subsequent requests. This allows you to access the claims of the token, such as the user's identity, without having to re-parse the token on each request.
        options.RequireHttpsMetadata = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidateAudience = false, //you can turn this ON when you work with 3rd Parties.
            ValidateIssuer = false, //you can turn this ON when you work with 3rd Parties.
            //ValidIssuer = builder.Configuration["Jwt:Issuer"],
            //ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration.GetValue<string>("Jwt:Key"))),
            ClockSkew = TimeSpan.Zero


        };
    });

//Configure the Authorizations
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly",
        policy => policy
        .RequireClaim("admin")
        );
});


//Repositories
builder.Services.AddScoped<IPersonRepository, PersonRepository>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();

//Auto Mapper
builder.Services.AddAutoMapper(typeof(MappingsModelDto));

//API Versioning
builder.Services.AddApiVersioning(options =>
{
    options.AssumeDefaultVersionWhenUnspecified = true; //This means use the default version if the consumer didn't specify one.
    options.DefaultApiVersion = new ApiVersion(1, 0); //Set the Default version.
    options.ReportApiVersions = true; // To repport what is the current version.

});
builder.Services.AddVersionedApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
});

builder.Services.AddControllers();

//Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(allowedSpecificOrgins, builder =>
    {
        builder.WithOrigins("*")
        .AllowAnyMethod()
        .AllowAnyHeader();
    }
    );
}
);


var app = builder.Build();


//========================Configure the HTTP request pipeline.==========================

app.UseCors(allowedSpecificOrgins);

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();



app.Run();

