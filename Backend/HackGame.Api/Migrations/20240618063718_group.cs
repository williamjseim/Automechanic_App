using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mechanic.Api.Migrations
{
    /// <inheritdoc />
    public partial class group : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CarIssueId",
                table: "Us3r_Data",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_Us3r_Data_CarIssueId",
                table: "Us3r_Data",
                column: "CarIssueId");

            migrationBuilder.AddForeignKey(
                name: "FK_Us3r_Data_Car_Issu3_CarIssueId",
                table: "Us3r_Data",
                column: "CarIssueId",
                principalTable: "Car_Issu3",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Us3r_Data_Car_Issu3_CarIssueId",
                table: "Us3r_Data");

            migrationBuilder.DropIndex(
                name: "IX_Us3r_Data_CarIssueId",
                table: "Us3r_Data");

            migrationBuilder.DropColumn(
                name: "CarIssueId",
                table: "Us3r_Data");
        }
    }
}
