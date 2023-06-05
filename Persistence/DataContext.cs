using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Tag> Tags { get; set; }
        public DbSet<ImageData> ImagesData {get; set;}
        public DbSet<TagImageData> TagImageDatas { get; set;}
        public DbSet<Album> Albums {get; set;}
        public DbSet<AlbumImages> AlbumImages {get; set;}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            //set keys
            builder.Entity<TagImageData>(x => x.HasKey(aa => new {aa.ImageDataId, aa.TagId}));
            //set foreign key relation
            builder.Entity<TagImageData>()
                .HasOne(u => u.ImageData)
                .WithMany(a => a.TagImageData)
                .HasForeignKey(aa => aa.ImageDataId);

            builder.Entity<TagImageData>()
                .HasOne(u => u.Tag)
                .WithMany(a => a.TagImageData)
                .HasForeignKey(aa => aa.TagId);
            //set keys
            builder.Entity<AlbumImages>(x => x.HasKey(aa => new {aa.ImageDataId, aa.AlbumId}));
            //set foreign key relation
            builder.Entity<AlbumImages>()
                .HasOne(u => u.ImageData)
                .WithMany(a => a.AlbumImages)
                .HasForeignKey(aa => aa.ImageDataId);

            builder.Entity<AlbumImages>()
                .HasOne(u => u.Album)
                .WithMany(a => a.AlbumImages)
                .HasForeignKey(aa => aa.AlbumId);

            //cascade delete for tag images
            //set cascade delete for tags
            builder.Entity<TagImageData>()
                .HasOne(a => a.Tag)
                .WithMany(t => t.TagImageData)
                .OnDelete(DeleteBehavior.Cascade);
            //set cascade delete for images
            builder.Entity<TagImageData>()
                .HasOne(a => a.ImageData)
                .WithMany(t => t.TagImageData)
                .OnDelete(DeleteBehavior.Cascade);

            //cascade delete for album image
            //set cascade delete for albums
            builder.Entity<AlbumImages>()
                .HasOne(a => a.Album)
                .WithMany(t => t.AlbumImages)
                .OnDelete(DeleteBehavior.Cascade);
            //set cascade delete for images
            builder.Entity<AlbumImages>()
                .HasOne(a => a.ImageData)
                .WithMany(t => t.AlbumImages)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}