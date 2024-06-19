using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mechanic.Api.Migrations
{
    /// <inheritdoc />
    public partial class group3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "CarIssueUser",
                columns: table => new
                {
                    CarIssueId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    CoAuthorsId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarIssueUser", x => new { x.CarIssueId, x.CoAuthorsId });
                    table.ForeignKey(
                        name: "FK_CarIssueUser_Car_Issu3_CarIssueId",
                        column: x => x.CarIssueId,
                        principalTable: "Car_Issu3",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CarIssueUser_Us3r_Data_CoAuthorsId",
                        column: x => x.CoAuthorsId,
                        principalTable: "Us3r_Data",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_CarIssueUser_CoAuthorsId",
                table: "CarIssueUser",
                column: "CoAuthorsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CarIssueUser");

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
    }
}
