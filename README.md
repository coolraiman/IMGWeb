# IMGWeb
Image Manager Gallery Web

This project was made for my final class project

## Description
Using ASP.NET 7 and React Typescript, this project is a fullstack website whose main purpose is to allow users to create an account and 
upload images to the Cloudinary Cloud. The user can then tag his images and search by including and excluding tags

## Features
- MSSQL with a code first Entity framework databae
- ASP.NET Identity integration
- Multiple sort options for search results
- Allow user to create tags and add multiple tags on an image
- Search images by including and excluding tags
- Fullscreen image viewer with gallery navigation
- Set image as favorite
- Rate image from 0 to 5
- Manage multiple images at once (add and remove tags or delete selected images)
- Warning message with do not warn again option

### Upload page example

![Upload page](/client-app/public/assets/presentation/upload.png)

### Fullscreen view

![Upload page](/client-app/public/assets/presentation/details.png)

### Sort and order your search result with many options

![Upload page](/client-app/public/assets/presentation/grid.png)


### Project setup
The only configuration needed is to add your Cloudinary Api key to the appsetting.json. You can create an account for free at https://cloudinary.com/
You also need vscode or visual studio with ASP.NET, and a working MSSQL localhost instance, the database will be create when the project is ran.
The project use a built version of the react client-app, you do not need Node.js to run it
