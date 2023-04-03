export interface Tag {
    id: number;
    name: string;
    description: string;
    references: number;
}

export interface TagFormValues {
    id: number;
    name: string;
    description: string;
}