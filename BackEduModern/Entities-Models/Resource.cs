using System;
using System.Collections.Generic;
using System.Text;

namespace project1
{
    public class Resource
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string FileUrl { get; set; }
        public int LessonId { get; set; }

        public Lesson Lesson
        {
            get; set;
        }
    }
}
