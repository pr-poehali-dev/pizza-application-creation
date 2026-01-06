import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Ingredient = {
  id: number;
  name: string;
  price: number;
  category: 'base' | 'sauce' | 'cheese' | 'meat' | 'veggies';
};

type CustomPizza = {
  size: string;
  ingredients: Ingredient[];
};

const ingredients: Ingredient[] = [
  { id: 1, name: 'Тонкое тесто', price: 0, category: 'base' },
  { id: 2, name: 'Пышное тесто', price: 50, category: 'base' },
  { id: 3, name: 'Томатный соус', price: 0, category: 'sauce' },
  { id: 4, name: 'Сливочный соус', price: 30, category: 'sauce' },
  { id: 5, name: 'Соус барбекю', price: 30, category: 'sauce' },
  { id: 6, name: 'Моцарелла', price: 80, category: 'cheese' },
  { id: 7, name: 'Пармезан', price: 100, category: 'cheese' },
  { id: 8, name: 'Чеддер', price: 90, category: 'cheese' },
  { id: 9, name: 'Пепперони', price: 120, category: 'meat' },
  { id: 10, name: 'Ветчина', price: 100, category: 'meat' },
  { id: 11, name: 'Курица', price: 110, category: 'meat' },
  { id: 12, name: 'Бекон', price: 130, category: 'meat' },
  { id: 13, name: 'Грибы', price: 60, category: 'veggies' },
  { id: 14, name: 'Помидоры', price: 50, category: 'veggies' },
  { id: 15, name: 'Перец болгарский', price: 55, category: 'veggies' },
  { id: 16, name: 'Маслины', price: 70, category: 'veggies' },
  { id: 17, name: 'Лук красный', price: 40, category: 'veggies' },
];

const sizePrices = {
  '25см': 300,
  '30см': 450,
  '35см': 600
};

export default function PizzaConstructor({ onClose, onAddToCart }: { onClose: () => void; onAddToCart: (pizza: any) => void }) {
  const [customPizza, setCustomPizza] = useState<CustomPizza>({
    size: '30см',
    ingredients: []
  });

  const toggleIngredient = (ingredient: Ingredient) => {
    const exists = customPizza.ingredients.find(i => i.id === ingredient.id);
    
    if (exists) {
      setCustomPizza({
        ...customPizza,
        ingredients: customPizza.ingredients.filter(i => i.id !== ingredient.id)
      });
    } else {
      if (ingredient.category === 'base') {
        setCustomPizza({
          ...customPizza,
          ingredients: [
            ...customPizza.ingredients.filter(i => i.category !== 'base'),
            ingredient
          ]
        });
      } else if (ingredient.category === 'sauce') {
        setCustomPizza({
          ...customPizza,
          ingredients: [
            ...customPizza.ingredients.filter(i => i.category !== 'sauce'),
            ingredient
          ]
        });
      } else {
        setCustomPizza({
          ...customPizza,
          ingredients: [...customPizza.ingredients, ingredient]
        });
      }
    }
  };

  const calculatePrice = () => {
    const basePrice = sizePrices[customPizza.size as keyof typeof sizePrices];
    const ingredientsPrice = customPizza.ingredients.reduce((sum, ing) => sum + ing.price, 0);
    return basePrice + ingredientsPrice;
  };

  const addCustomPizzaToCart = () => {
    if (customPizza.ingredients.length === 0) {
      toast.error('Добавьте хотя бы один ингредиент');
      return;
    }

    const pizza = {
      id: Date.now(),
      name: 'Своя пицца',
      description: customPizza.ingredients.map(i => i.name).join(', '),
      price: calculatePrice(),
      image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg',
      category: 'pizza' as const,
      selectedSize: customPizza.size,
      quantity: 1
    };

    onAddToCart(pizza);
    toast.success('Своя пицца добавлена в корзину!');
    onClose();
  };

  const getIngredientsByCategory = (category: string) => {
    return ingredients.filter(i => i.category === category);
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto p-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Выберите размер</h3>
        <RadioGroup value={customPizza.size} onValueChange={(size) => setCustomPizza({ ...customPizza, size })}>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(sizePrices).map(([size, price]) => (
              <Card key={size} className="p-4 cursor-pointer hover:border-primary">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={size} id={size} />
                  <Label htmlFor={size} className="cursor-pointer flex-1">
                    <div className="font-semibold">{size}</div>
                    <div className="text-sm text-muted-foreground">{price} ₽</div>
                  </Label>
                </div>
              </Card>
            ))}
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Icon name="Cookie" size={20} />
          Тесто
        </h3>
        <div className="space-y-2">
          {getIngredientsByCategory('base').map((ingredient) => (
            <Card
              key={ingredient.id}
              className={`p-3 cursor-pointer hover:border-primary ${
                customPizza.ingredients.find(i => i.id === ingredient.id) ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => toggleIngredient(ingredient)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox checked={!!customPizza.ingredients.find(i => i.id === ingredient.id)} />
                  <span>{ingredient.name}</span>
                </div>
                <span className="text-sm font-semibold">{ingredient.price > 0 ? `+${ingredient.price} ₽` : 'Базовое'}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Icon name="Droplet" size={20} />
          Соус
        </h3>
        <div className="space-y-2">
          {getIngredientsByCategory('sauce').map((ingredient) => (
            <Card
              key={ingredient.id}
              className={`p-3 cursor-pointer hover:border-primary ${
                customPizza.ingredients.find(i => i.id === ingredient.id) ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => toggleIngredient(ingredient)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox checked={!!customPizza.ingredients.find(i => i.id === ingredient.id)} />
                  <span>{ingredient.name}</span>
                </div>
                <span className="text-sm font-semibold">{ingredient.price > 0 ? `+${ingredient.price} ₽` : 'Базовый'}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Icon name="Milk" size={20} />
          Сыр
        </h3>
        <div className="space-y-2">
          {getIngredientsByCategory('cheese').map((ingredient) => (
            <Card
              key={ingredient.id}
              className={`p-3 cursor-pointer hover:border-primary ${
                customPizza.ingredients.find(i => i.id === ingredient.id) ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => toggleIngredient(ingredient)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox checked={!!customPizza.ingredients.find(i => i.id === ingredient.id)} />
                  <span>{ingredient.name}</span>
                </div>
                <span className="text-sm font-semibold">+{ingredient.price} ₽</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Icon name="Ham" size={20} />
          Мясо
        </h3>
        <div className="space-y-2">
          {getIngredientsByCategory('meat').map((ingredient) => (
            <Card
              key={ingredient.id}
              className={`p-3 cursor-pointer hover:border-primary ${
                customPizza.ingredients.find(i => i.id === ingredient.id) ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => toggleIngredient(ingredient)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox checked={!!customPizza.ingredients.find(i => i.id === ingredient.id)} />
                  <span>{ingredient.name}</span>
                </div>
                <span className="text-sm font-semibold">+{ingredient.price} ₽</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Icon name="Salad" size={20} />
          Овощи
        </h3>
        <div className="space-y-2">
          {getIngredientsByCategory('veggies').map((ingredient) => (
            <Card
              key={ingredient.id}
              className={`p-3 cursor-pointer hover:border-primary ${
                customPizza.ingredients.find(i => i.id === ingredient.id) ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => toggleIngredient(ingredient)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox checked={!!customPizza.ingredients.find(i => i.id === ingredient.id)} />
                  <span>{ingredient.name}</span>
                </div>
                <span className="text-sm font-semibold">+{ingredient.price} ₽</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      <Card className="p-4 bg-primary/5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold">Итоговая цена:</span>
          <span className="text-2xl font-bold text-primary">{calculatePrice()} ₽</span>
        </div>
        {customPizza.ingredients.length > 0 && (
          <div className="text-sm text-muted-foreground mb-4">
            <strong>Состав:</strong> {customPizza.ingredients.map(i => i.name).join(', ')}
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Отмена
          </Button>
          <Button onClick={addCustomPizzaToCart} className="flex-1" disabled={customPizza.ingredients.length === 0}>
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить в корзину
          </Button>
        </div>
      </Card>
    </div>
  );
}
