using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace project1.Migrations
{
    /// <inheritdoc />
    public partial class AddResourcesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LessonProgresses_Lessons_lessonId",
                table: "LessonProgresses");

            migrationBuilder.DropForeignKey(
                name: "FK_LessonProgresses_Users_studentId",
                table: "LessonProgresses");

            migrationBuilder.RenameColumn(
                name: "studentId",
                table: "LessonProgresses",
                newName: "StudentId");

            migrationBuilder.RenameColumn(
                name: "lessonId",
                table: "LessonProgresses",
                newName: "LessonId");

            migrationBuilder.RenameIndex(
                name: "IX_LessonProgresses_studentId",
                table: "LessonProgresses",
                newName: "IX_LessonProgresses_StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_LessonProgresses_lessonId",
                table: "LessonProgresses",
                newName: "IX_LessonProgresses_LessonId");

            migrationBuilder.CreateTable(
                name: "Resources",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LessonId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resources", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Resources_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Resources_LessonId",
                table: "Resources",
                column: "LessonId");

            migrationBuilder.AddForeignKey(
                name: "FK_LessonProgresses_Lessons_LessonId",
                table: "LessonProgresses",
                column: "LessonId",
                principalTable: "Lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LessonProgresses_Users_StudentId",
                table: "LessonProgresses",
                column: "StudentId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LessonProgresses_Lessons_LessonId",
                table: "LessonProgresses");

            migrationBuilder.DropForeignKey(
                name: "FK_LessonProgresses_Users_StudentId",
                table: "LessonProgresses");

            migrationBuilder.DropTable(
                name: "Resources");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "LessonProgresses",
                newName: "studentId");

            migrationBuilder.RenameColumn(
                name: "LessonId",
                table: "LessonProgresses",
                newName: "lessonId");

            migrationBuilder.RenameIndex(
                name: "IX_LessonProgresses_StudentId",
                table: "LessonProgresses",
                newName: "IX_LessonProgresses_studentId");

            migrationBuilder.RenameIndex(
                name: "IX_LessonProgresses_LessonId",
                table: "LessonProgresses",
                newName: "IX_LessonProgresses_lessonId");

            migrationBuilder.AddForeignKey(
                name: "FK_LessonProgresses_Lessons_lessonId",
                table: "LessonProgresses",
                column: "lessonId",
                principalTable: "Lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LessonProgresses_Users_studentId",
                table: "LessonProgresses",
                column: "studentId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
