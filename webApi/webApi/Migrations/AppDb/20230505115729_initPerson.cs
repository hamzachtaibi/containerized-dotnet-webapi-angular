using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webApi.Migrations.AppDb
{
    public partial class initPerson : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Persons",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Cin = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeathDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Gender = table.Column<string>(type: "char(1)", maxLength: 1, nullable: true),
                    BirthPlace = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AcademicLevel = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberEmergency = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MaritalStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Profession = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PostalCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GPS = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DreamOf = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilyRecordNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FatherId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MotherId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GrandFatherId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GrandMotherId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MariedToId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageProfile = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageBlurry = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullNameArabic = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BirthPlaceArabic = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AcademicLevelArabic = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AddressArabic = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CountryArabic = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CityArabic = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfessionArabic = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilyRecordNumberArabic = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DreamOfArabic = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RegistrationDate = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "getdate()"),
                    ProfileUpdateTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NoteArabic = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FacebookAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TweeterAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InstagramAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LinkedInAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsNeedy = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsEmployee = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsCustomer = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsCompany = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsDeath = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsResponsable = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Persons", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Persons_Cin",
                table: "Persons",
                column: "Cin",
                unique: true,
                filter: "[Cin] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Persons_Email",
                table: "Persons",
                column: "Email",
                unique: true,
                filter: "[Email] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Persons");
        }
    }
}
