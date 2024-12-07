using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AirBnBWebApi.Infrastructure.Migrations
{
    public partial class AddMockDataForLocation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Locations",
                columns: new[] { "Id", "City", "Country", "GoogleMapsUrl", "Latitude", "Longitude" },
                values: new object[,]
                {
                    { new Guid("058a5dde-bc40-4689-8ae8-8df50ff44c59"), "Hà Nội", "Vietnam", "https://goo.gl/maps/jxEMENK67fq", 21.028511000000002, 105.85416600000001 },
                    { new Guid("2165fd0f-ba6b-425c-b95d-6909344c1b01"), "Đà Nẵng", "Vietnam", "https://goo.gl/maps/jDgHbPzRJmF2", 16.047079, 108.20623000000001 },
                    { new Guid("5ccd4418-3eac-48e5-ad7a-8248a1028ea1"), "Hồ Chí Minh", "Vietnam", "https://goo.gl/maps/KdfV2N6pK3t", 10.823098999999999, 106.629662 },
                    { new Guid("6f3da73d-a10d-4e02-9bd9-02ef6e4fbaac"), "Phú Quốc", "Vietnam", "https://goo.gl/maps/Kdtq7fbpK5t", 10.289899999999999, 103.9644 },
                    { new Guid("8865c6fc-6bd6-4253-9534-09a97133a856"), "Hải Phòng", "Vietnam", "https://goo.gl/maps/tx1xaTghmNn", 20.844911, 106.688084 },
                    { new Guid("b5329932-fc35-4268-a559-6fbea94e9155"), "Cần Thơ", "Vietnam", "https://goo.gl/maps/z8qFN7uX1p8", 10.045161999999999, 105.74685700000001 },
                    { new Guid("ec53d2e9-8df9-4742-8b39-781113d34167"), "Huế", "Vietnam", "https://goo.gl/maps/vjAexGdMk4y", 16.463712999999998, 107.59086600000001 },
                    { new Guid("efa29842-ab16-41ae-841e-a195c2ad86df"), "Đà Lạt", "Vietnam", "https://goo.gl/maps/jNcHFytCmTs", 11.940419, 108.4345 },
                    { new Guid("f6ff8121-1829-4195-8a0b-d5764518dcde"), "Nha Trang", "Vietnam", "https://goo.gl/maps/P6c6t9enTjN2", 12.238791000000001, 109.196749 },
                    { new Guid("fc31ddd5-84cc-46d0-8a3b-bab9786f6805"), "Vũng Tàu", "Vietnam", "https://goo.gl/maps/wAeDf7aVx1r", 10.346, 107.08499999999999 }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("058a5dde-bc40-4689-8ae8-8df50ff44c59"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("2165fd0f-ba6b-425c-b95d-6909344c1b01"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("5ccd4418-3eac-48e5-ad7a-8248a1028ea1"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("6f3da73d-a10d-4e02-9bd9-02ef6e4fbaac"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("8865c6fc-6bd6-4253-9534-09a97133a856"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("b5329932-fc35-4268-a559-6fbea94e9155"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("ec53d2e9-8df9-4742-8b39-781113d34167"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("efa29842-ab16-41ae-841e-a195c2ad86df"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("f6ff8121-1829-4195-8a0b-d5764518dcde"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("fc31ddd5-84cc-46d0-8a3b-bab9786f6805"));
        }
    }
}
