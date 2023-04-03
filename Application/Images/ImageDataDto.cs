using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Tags;
using Domain;

namespace Application.Images
{
    public class ImageDataDto
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public string FileName { get; set; }
        public string Name { get; set; }
        public string Extension { get; set; }
        public decimal FileSize { get; set; }
        public int Rating { get; set; }
        public bool Favorite { get; set; } = false;
        public int Views { get; set; } = 0;
        public DateTime DateAdded { get; set; }
        public DateTime DateTaken { get; set; }
        public int Height { get; set; }
        public int Width { get; set; }
        public string Metadata {get; set;}
        public List<TagDto> Tags { get; set; }

        public ImageDataDto(){}
        public ImageDataDto(ImageData img)
        {
            Id = img.Id;
            Url = img.Url;
            FileName = img.FileName;
            Name = img.Name;
            Extension = img.Extension;
            FileSize = img.FileSize;
            Rating = img.Rating;
            Favorite = img.Favorite;
            Views = img.Views;
            DateAdded = img.DateAdded;
            DateTaken = img.DateTaken;
            Height = img.Height;
            Width = img.Width;
            Metadata = img.Metadata;

            Tags = new List<TagDto>();
            if(img.TagImageData != null)
            {
                foreach(var t in img.TagImageData)
                {
                    Tags.Add(new TagDto{Id = t.TagId, Name = t.Tag.Name, Description = t.Tag.Description});
                }
            }
        }
    }
}