namespace Domain
{
    public class AlbumImages
    {
        public string ImageDataId {get; set;}
        public ImageData ImageData { get; set; }
        public int AlbumId {get; set;}
        public Album Album {get; set;}
    }
}