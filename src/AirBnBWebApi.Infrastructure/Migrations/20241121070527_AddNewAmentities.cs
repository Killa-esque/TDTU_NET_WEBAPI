using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AirBnBWebApi.Infrastructure.Migrations
{
    public partial class AddNewAmentities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("9b7e38d6-dbcf-40de-8517-f22c21a6c88b"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("d2b307b6-696b-466c-ae0d-cc62a516118e"));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Locations",
                columns: new[] { "Id", "City", "Country", "GoogleMapsUrl", "ImageUrl", "Latitude", "Longitude" },
                values: new object[] { new Guid("9b7e38d6-dbcf-40de-8517-f22c21a6c88b"), "Hà Nội", "Vietnam", "https://goo.gl/maps/jxEMENK67fq", "/images/locations/hanoi.jpg", 21.028511000000002, 105.85416600000001 });

            migrationBuilder.InsertData(
                table: "Locations",
                columns: new[] { "Id", "City", "Country", "GoogleMapsUrl", "ImageUrl", "Latitude", "Longitude" },
                values: new object[] { new Guid("d2b307b6-696b-466c-ae0d-cc62a516118e"), "Hồ Chí Minh", "Vietnam", "https://goo.gl/maps/KdfV2N6pK3t", "/images/locations/hochiminh.jpg", 10.823098999999999, 106.629662 });
        }
    }
}
