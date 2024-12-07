using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AirBnBWebApi.Infrastructure.Migrations
{
    public partial class UpdateProperty_Location_new : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Properties_Locations_LocationId1",
                table: "Properties");

            migrationBuilder.DropIndex(
                name: "IX_Properties_LocationId",
                table: "Properties");

            migrationBuilder.DropIndex(
                name: "IX_Properties_LocationId1",
                table: "Properties");

            migrationBuilder.DropIndex(
                name: "IX_Locations_City_Country",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "LocationId1",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "Locations");

            migrationBuilder.AlterColumn<string>(
                name: "Country",
                table: "Locations",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "City",
                table: "Locations",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Properties_LocationId",
                table: "Properties",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_City_Country",
                table: "Locations",
                columns: new[] { "City", "Country" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Properties_LocationId",
                table: "Properties");

            migrationBuilder.DropIndex(
                name: "IX_Locations_City_Country",
                table: "Locations");

            migrationBuilder.AddColumn<Guid>(
                name: "LocationId1",
                table: "Properties",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Country",
                table: "Locations",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "City",
                table: "Locations",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "Locations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Properties_LocationId",
                table: "Properties",
                column: "LocationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Properties_LocationId1",
                table: "Properties",
                column: "LocationId1");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_City_Country",
                table: "Locations",
                columns: new[] { "City", "Country" },
                unique: true,
                filter: "[City] IS NOT NULL AND [Country] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Properties_Locations_LocationId1",
                table: "Properties",
                column: "LocationId1",
                principalTable: "Locations",
                principalColumn: "Id");
        }
    }
}
