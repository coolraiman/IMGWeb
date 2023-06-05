namespace Domain
{
    public class TagImageData
    {
        public string ImageDataId {get; set;}
        public ImageData ImageData { get; set; }
        public long TagId {get; set;}
        public Tag Tag {get; set;}
    }
}