const person: {
    name: string;
    age: number;
    hobbies: string[];
    role: [number, string];
} = {
    name: "Tyler",
    age: 22,
    hobbies: ["DnD", "Programming"],
    role: [2, "Admin"]
};

let product: {
    name: string;
    price: number;
    details: {
        title: string;
        description: string;
    };
};