import { ImageData } from "../../app/models/imageData";

export interface SortAlgo 
{
    name: string;
    detailedName : string[]
    sort(images: ImageData[], ascending: boolean): ImageData[];
}

export class SortManager
{
    sortImages =  (images: ImageData[], index: number, ascending: boolean): ImageData[] =>
    {
        if(index < 0 || index >= this.sorts.length)
            return images;

        return this.sorts[index].sort(images, ascending);
    }

    sorts: SortAlgo[] =
            [
                {name: "File type", detailedName: ["Ascending", "Descending "], sort: (images: ImageData[], ascending: boolean): ImageData[] =>
                    {
                        return images.sort((a,b) => (ascending ? 1 : -1) * a.extension.localeCompare(b.extension));
                    }
                },
                {name: "File size", detailedName: ["Ascending", "Descending "], sort: (images: ImageData[], ascending: boolean): ImageData[] =>
                    {
                        return images.sort((a,b) => (ascending ? 1 : -1) * (a.fileSize - b.fileSize));
                    }
                },
                {name: "Views", detailedName: ["Ascending", "Descending "],  sort: (images: ImageData[], ascending: boolean): ImageData[] =>
                    {
                        return images.sort((a,b) => (ascending ? 1 : -1) * (a.views - b.views));
                    }
                },
                {name: "Height", detailedName: ["Ascending", "Descending "], sort: (images: ImageData[], ascending: boolean): ImageData[] =>
                    {
                        return images.sort((a,b) => (ascending ? 1 : -1) * (a.height - b.height));
                    }
                },
                {name: "Width", detailedName: ["Ascending", "Descending "], sort: (images: ImageData[], ascending: boolean): ImageData[] =>
                    {
                        return images.sort((a,b) => (ascending ? 1 : -1) * (a.width - b.width));
                    }
                },
                {name: "Rating", detailedName: ["Ascending", "Descending "], sort: (images: ImageData[], ascending: boolean): ImageData[] =>
                    {
                        return images.sort((a,b) => (ascending ? 1 : -1) * (a.rating - b.rating));
                    }
                },
                {name: "Date", detailedName: ["Ascending", "Descending "], sort: (images: ImageData[], ascending: boolean): ImageData[] =>
                    {
                        return images.sort((a,b) => (ascending ? 1 : -1) * (a.dateAdded.getDate() - b.dateAdded.getDate()));
                    }
                },
                {name: "Favorite", detailedName: ["Favorite", "Not favorite "], sort: (images: ImageData[], ascending: boolean): ImageData[] =>
                    {
                        return images.sort((a,b) => (ascending ? 1 : -1) * (Number(a.favorite) - Number(b.favorite)));
                    }
                },
                {name: "Tags count", detailedName: ["Ascending", "Descending "], sort: (images: ImageData[], ascending: boolean): ImageData[] =>
                    {
                        return images.sort((a,b) => (ascending ? 1 : -1) * (a.tags.length - b.tags.length));
                    }
                },
                {name: "Random", detailedName: ["Fisher-Yates", "Black box "], sort: (images: ImageData[], ascending: boolean): ImageData[] =>
                    {
                        const copy = images;
                        if(ascending)
                        {
                            let m = images.length;
                            while(m)
                            {
                                const i = Math.floor(Math.random() * m--);
                                [copy[m], copy[i]] = [copy[i], copy[m]];
                            }
                            return copy;
                        }
                        else
                        {
                            return images.sort(() => Math.random() - 0.5);
                        }
                    }
                }
            ]
}