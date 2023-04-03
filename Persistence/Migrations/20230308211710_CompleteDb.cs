using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CompleteDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Tags",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Tags",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "DisplayName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<decimal>(
                name: "SpaceAllowed",
                table: "AspNetUsers",
                type: "decimal(20,0)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "Albums",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rating = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Favorite = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateCreate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Views = table.Column<int>(type: "int", nullable: false),
                    AppUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Albums", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Albums_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ImagesData",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Extension = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FileSize = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Favorite = table.Column<bool>(type: "bit", nullable: false),
                    Views = table.Column<int>(type: "int", nullable: false),
                    DateAdded = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateTaken = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Height = table.Column<int>(type: "int", nullable: false),
                    Width = table.Column<int>(type: "int", nullable: false),
                    Metadata = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AppUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImagesData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImagesData_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AlbumImages",
                columns: table => new
                {
                    ImageDataId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AlbumId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlbumImages", x => new { x.ImageDataId, x.AlbumId });
                    table.ForeignKey(
                        name: "FK_AlbumImages_Albums_AlbumId",
                        column: x => x.AlbumId,
                        principalTable: "Albums",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AlbumImages_ImagesData_ImageDataId",
                        column: x => x.ImageDataId,
                        principalTable: "ImagesData",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TagImageDatas",
                columns: table => new
                {
                    ImageDataId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TagId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TagImageDatas", x => new { x.ImageDataId, x.TagId });
                    table.ForeignKey(
                        name: "FK_TagImageDatas_ImagesData_ImageDataId",
                        column: x => x.ImageDataId,
                        principalTable: "ImagesData",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TagImageDatas_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tags_AppUserId",
                table: "Tags",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AlbumImages_AlbumId",
                table: "AlbumImages",
                column: "AlbumId");

            migrationBuilder.CreateIndex(
                name: "IX_Albums_AppUserId",
                table: "Albums",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ImagesData_AppUserId",
                table: "ImagesData",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TagImageDatas_TagId",
                table: "TagImageDatas",
                column: "TagId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tags_AspNetUsers_AppUserId",
                table: "Tags",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tags_AspNetUsers_AppUserId",
                table: "Tags");

            migrationBuilder.DropTable(
                name: "AlbumImages");

            migrationBuilder.DropTable(
                name: "TagImageDatas");

            migrationBuilder.DropTable(
                name: "Albums");

            migrationBuilder.DropTable(
                name: "ImagesData");

            migrationBuilder.DropIndex(
                name: "IX_Tags_AppUserId",
                table: "Tags");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Tags");

            migrationBuilder.DropColumn(
                name: "SpaceAllowed",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Tags",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "DisplayName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
