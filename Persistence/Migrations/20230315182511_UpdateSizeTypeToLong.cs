using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSizeTypeToLong : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "FileSize",
                table: "ImagesData",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<long>(
                name: "SpaceUsed",
                table: "AspNetUsers",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(20,0)");

            migrationBuilder.AlterColumn<long>(
                name: "SpaceAllowed",
                table: "AspNetUsers",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(20,0)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "FileSize",
                table: "ImagesData",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<decimal>(
                name: "SpaceUsed",
                table: "AspNetUsers",
                type: "decimal(20,0)",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<decimal>(
                name: "SpaceAllowed",
                table: "AspNetUsers",
                type: "decimal(20,0)",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");
        }
    }
}
