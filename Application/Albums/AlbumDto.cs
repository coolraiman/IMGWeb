using Application.Images;
using Domain;

namespace Application.Albums
{
    public class AlbumDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Rating { get; set; } = 0;
        public bool Favorite { get; set; } = false;
        public DateTime DateCreate {get; set;} = DateTime.Now;
        public int Views { get; set; } = 0;
        public List<ImageDataDto> AlbumImages { get; set; } = new List<ImageDataDto>();

        public AlbumDto(){}
        public AlbumDto(Album album)
        {
            this.Id = album.Id;
            this.Name = album.Name;
            this.Description = album.Description;
            this.Rating = album.Rating;
            this.Favorite = album.Favorite;
            this.DateCreate = album.DateCreate;
            this.Views = album.Views;

            AlbumImages = new List<ImageDataDto>();
            if(album.AlbumImages != null)
            {
                foreach(var img in album.AlbumImages)
                {
                    AlbumImages.Add(new ImageDataDto(img.ImageData));
                }
            }
        }
    }
}