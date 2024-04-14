Create a Shopping Liste

Method : POST
Endpoint: http://localhost:5000/shopping-list

```json
{
    listTitle: "My Shopping List",
    items: [
        { name: "Steak", quantity: 2, category: "Meat" },
        { name: "Salmon", quantity: 1, category: "Fish and Seafood" },
        { name: "Apples", quantity: 5, category: "Fruits" },
        { name: "Carrots", quantity: 10, category: "Vegetables" },
        { name: "Milk", quantity: 2, category: "Dairy Products" },
        { name: "Rice", quantity: 1, category: "Dry Goods" },
        { name: "Lettuce", quantity: 1, category: "Fresh Products" },
        { name: "Frozen Pizza", quantity: 2, category: "Frozen Foods" },
        { name: "Cereal", quantity: 1, category: "Grocery" },
        { name: "Soda", quantity: 3, category: "Beverages" },
        { name: "Chips", quantity: 2, category: "Snacks" }
    ]
};
```
Method: POST
Endpoint: http://localhost:5000/recipe-list

```json
{
    title: "Tasty Dish",
    prepTime: "30",
    cookTime: "60",
    ingredients: [
        { name: "Potatoes", quantity: 300, unit: "g" },
        { name: "Chicken Breast", quantity: 2, unit: "piece" },
        { name: "Carrots", quantity: 150, unit: "g" },
        { name: "Onion", quantity: 1, unit: "piece" },
        { name: "Salt", quantity: 5, unit: "teaspoon" },
        { name: "Pepper", quantity: 2, unit: "teaspoon" },
        { name: "Olive Oil", quantity: 25, unit: "mL" }
    ],
    instructions: "Heat olive oil in a pan. Add chopped onion and cook until translucent. Add diced chicken breast and cook until golden brown. Then, add diced carrots and potatoes. Season with salt and pepper. Cover and cook until vegetables are tender."
};
```

Method: POST
Endpoint: http://localhost:5000/events-saved
provided the shopping list or recipe is first present in the database.

```json
{
    title: "Birthday Party",
    start: "2024-05-01T18:00:00.000Z",
    end: "2024-05-01T22:00:00.000Z",
};
