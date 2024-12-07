using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AirBnBWebApi.Infrastructure.Migrations
{
    public partial class AddImageUrlToLocationMockData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("03f8abda-9d21-40ce-9fc8-cea1052bb477"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("42953889-3315-4314-a247-6d64e9ef19fb"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("5447eeb8-70ff-4c3e-a653-cdd3c94a06b0"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("666afc98-54a7-4bed-a0d5-f416b4f587e9"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("6d0b64b8-1542-46c9-9d5d-09be7d03fe99"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("73549464-043d-422e-9086-c41afd7f9ec3"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("7c0c9277-f2ae-4d0e-a05f-e765bcff029e"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("9066fc82-922b-46ba-a205-488174300887"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("b661ead4-891c-44f1-8bf6-c3fd72f89fc9"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("db6954ee-853f-4ab5-bcaa-411d07f8a17b"));

            migrationBuilder.InsertData(
                table: "Locations",
                columns: new[] { "Id", "City", "Country", "GoogleMapsUrl", "ImageUrl", "Latitude", "Longitude" },
                values: new object[] { new Guid("3c4c6168-8ce9-4aae-a3cc-ff8e03f86fda"), "Hà Nội", "Vietnam", "https://goo.gl/maps/jxEMENK67fq", "/images/locations/hanoi.jpg", 21.028511000000002, 105.85416600000001 });

            migrationBuilder.InsertData(
                table: "Locations",
                columns: new[] { "Id", "City", "Country", "GoogleMapsUrl", "ImageUrl", "Latitude", "Longitude" },
                values: new object[] { new Guid("84a151f0-f8d8-4d3f-bfb5-ee879ffe22da"), "Hồ Chí Minh", "Vietnam", "https://goo.gl/maps/KdfV2N6pK3t", "/images/locations/hochiminh.jpg", 10.823098999999999, 106.629662 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("3c4c6168-8ce9-4aae-a3cc-ff8e03f86fda"));

            migrationBuilder.DeleteData(
                table: "Locations",
                keyColumn: "Id",
                keyValue: new Guid("84a151f0-f8d8-4d3f-bfb5-ee879ffe22da"));

            migrationBuilder.InsertData(
                table: "Locations",
                columns: new[] { "Id", "City", "Country", "GoogleMapsUrl", "ImageUrl", "Latitude", "Longitude" },
                values: new object[,]
                {
                    { new Guid("03f8abda-9d21-40ce-9fc8-cea1052bb477"), "Cần Thơ", "Vietnam", "https://goo.gl/maps/z8qFN7uX1p8", null, 10.045161999999999, 105.74685700000001 },
                    { new Guid("42953889-3315-4314-a247-6d64e9ef19fb"), "Huế", "Vietnam", "https://goo.gl/maps/vjAexGdMk4y", null, 16.463712999999998, 107.59086600000001 },
                    { new Guid("5447eeb8-70ff-4c3e-a653-cdd3c94a06b0"), "Hồ Chí Minh", "Vietnam", "https://goo.gl/maps/KdfV2N6pK3t", null, 10.823098999999999, 106.629662 },
                    { new Guid("666afc98-54a7-4bed-a0d5-f416b4f587e9"), "Đà Lạt", "Vietnam", "https://goo.gl/maps/jNcHFytCmTs", null, 11.940419, 108.4345 },
                    { new Guid("6d0b64b8-1542-46c9-9d5d-09be7d03fe99"), "Vũng Tàu", "Vietnam", "https://goo.gl/maps/wAeDf7aVx1r", null, 10.346, 107.08499999999999 },
                    { new Guid("73549464-043d-422e-9086-c41afd7f9ec3"), "Đà Nẵng", "Vietnam", "https://goo.gl/maps/jDgHbPzRJmF2", null, 16.047079, 108.20623000000001 },
                    { new Guid("7c0c9277-f2ae-4d0e-a05f-e765bcff029e"), "Hà Nội", "Vietnam", "https://goo.gl/maps/jxEMENK67fq", null, 21.028511000000002, 105.85416600000001 },
                    { new Guid("9066fc82-922b-46ba-a205-488174300887"), "Hải Phòng", "Vietnam", "https://goo.gl/maps/tx1xaTghmNn", null, 20.844911, 106.688084 },
                    { new Guid("b661ead4-891c-44f1-8bf6-c3fd72f89fc9"), "Phú Quốc", "Vietnam", "https://goo.gl/maps/Kdtq7fbpK5t", null, 10.289899999999999, 103.9644 },
                    { new Guid("db6954ee-853f-4ab5-bcaa-411d07f8a17b"), "Nha Trang", "Vietnam", "https://goo.gl/maps/P6c6t9enTjN2", null, 12.238791000000001, 109.196749 }
                });
        }
    }
}
