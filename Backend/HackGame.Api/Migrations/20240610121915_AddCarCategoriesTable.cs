using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mechanic.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCarCategoriesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "Car_Issu3",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateTable(
                name: "C3r_Category",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    tag = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_C3r_Category", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Car_Issu3_CategoryId",
                table: "Car_Issu3",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Car_Issu3_C3r_Category_CategoryId",
                table: "Car_Issu3",
                column: "CategoryId",
                principalTable: "C3r_Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Car_Issu3_C3r_Category_CategoryId",
                table: "Car_Issu3");

            migrationBuilder.DropTable(
                name: "C3r_Category");

            migrationBuilder.DropIndex(
                name: "IX_Car_Issu3_CategoryId",
                table: "Car_Issu3");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Car_Issu3");
        }
    }
}
