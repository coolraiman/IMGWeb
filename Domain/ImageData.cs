using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class ImageData
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public string FileName { get; set; }
        public string Name { get; set; }
        public string Extension { get; set; }
        public long FileSize { get; set; }
        public int Rating { get; set; }
        public bool Favorite { get; set; }
        public int Views { get; set; } = 0;
        public DateTime DateAdded { get; set; }
        public DateTime DateTaken { get; set; }
        public int Height { get; set; }
        public int Width { get; set; }
        public string Metadata {get; set;}
        public ICollection<TagImageData> TagImageData { get; set; } = new List<TagImageData>();
        public ICollection<AlbumImages> AlbumImages { get; set; } = new List<AlbumImages>();
    }
}