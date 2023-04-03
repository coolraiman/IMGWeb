using Persistence;
using Microsoft.EntityFrameworkCore;
using MediatR;
using Application.Core;
using FluentValidation;
using Application.Tags;
using FluentValidation.AspNetCore;
using Application.Interfaces;
using Infrastructure.Security;
using Infrastructure.Images;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddDbContext<DataContext>(opt => 
            {
                opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3100");
                });
            });

            services.AddMediatR(typeof(List.Handler));
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<TagValidator>();

            services.AddHttpContextAccessor();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, ImageAccessor>();
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
            return services;
        }
    }
}