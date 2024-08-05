using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mechanic.Api.Migrations
{
    /// <inheritdoc />
    public partial class IssueCompletion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "Car_Issu3",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "Car_Issu3");
        }
    }
}
