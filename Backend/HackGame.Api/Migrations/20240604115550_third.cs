using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mechanic.Api.Migrations
{
    /// <inheritdoc />
    public partial class third : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "WantsNotification",
                table: "Us3r_Data",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "CarImageBase64",
                table: "C3r_Data",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "CreatorId",
                table: "C3r_Data",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_C3r_Data_CreatorId",
                table: "C3r_Data",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_C3r_Data_Us3r_Data_CreatorId",
                table: "C3r_Data",
                column: "CreatorId",
                principalTable: "Us3r_Data",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_C3r_Data_Us3r_Data_CreatorId",
                table: "C3r_Data");

            migrationBuilder.DropIndex(
                name: "IX_C3r_Data_CreatorId",
                table: "C3r_Data");

            migrationBuilder.DropColumn(
                name: "WantsNotification",
                table: "Us3r_Data");

            migrationBuilder.DropColumn(
                name: "CarImageBase64",
                table: "C3r_Data");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "C3r_Data");
        }
    }
}
