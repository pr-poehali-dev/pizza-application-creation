import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'pizza' | 'snacks' | 'drinks' | 'combo';
  sizes?: { name: string; price: number }[];
};

type CartItem = MenuItem & {
  quantity: number;
  selectedSize?: string;
};

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('home');

  const menuItems: MenuItem[] = [
    { id: 1, name: 'Маргарита', description: 'Томатный соус, моцарелла, базилик', price: 450, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'pizza', sizes: [{ name: '25см', price: 450 }, { name: '30см', price: 650 }, { name: '35см', price: 850 }] },
    { id: 2, name: 'Пепперони', description: 'Томатный соус, моцарелла, пепперони', price: 550, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'pizza', sizes: [{ name: '25см', price: 550 }, { name: '30см', price: 750 }, { name: '35см', price: 950 }] },
    { id: 3, name: 'Четыре сыра', description: 'Моцарелла, пармезан, горгонзола, чеддер', price: 600, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'pizza', sizes: [{ name: '25см', price: 600 }, { name: '30см', price: 800 }, { name: '35см', price: 1000 }] },
    { id: 4, name: 'Мясная', description: 'Томатный соус, моцарелла, ветчина, охотничьи колбаски, курица', price: 650, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'pizza', sizes: [{ name: '25см', price: 650 }, { name: '30см', price: 850 }, { name: '35см', price: 1050 }] },
    { id: 5, name: 'Гавайская', description: 'Томатный соус, моцарелла, курица, ананасы', price: 580, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'pizza', sizes: [{ name: '25см', price: 580 }, { name: '30см', price: 780 }, { name: '35см', price: 980 }] },
    { id: 6, name: 'Вегетарианская', description: 'Томатный соус, моцарелла, болгарский перец, помидоры, грибы, маслины', price: 520, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'pizza', sizes: [{ name: '25см', price: 520 }, { name: '30см', price: 720 }, { name: '35см', price: 920 }] },
    { id: 7, name: 'Барбекю', description: 'Соус барбекю, моцарелла, курица, красный лук', price: 620, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'pizza', sizes: [{ name: '25см', price: 620 }, { name: '30см', price: 820 }, { name: '35см', price: 1020 }] },
    { id: 8, name: 'Цезарь', description: 'Сливочный соус, моцарелла, курица, помидоры черри, салат айсберг', price: 590, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'pizza', sizes: [{ name: '25см', price: 590 }, { name: '30см', price: 790 }, { name: '35см', price: 990 }] },
    { id: 9, name: 'Диабло', description: 'Острый томатный соус, моцарелла, пепперони, халапеньо, чили', price: 630, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'pizza', sizes: [{ name: '25см', price: 630 }, { name: '30см', price: 830 }, { name: '35см', price: 1030 }] },
    { id: 10, name: 'Морская', description: 'Сливочный соус, моцарелла, креветки, кальмары, мидии', price: 780, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'pizza', sizes: [{ name: '25см', price: 780 }, { name: '30см', price: 980 }, { name: '35см', price: 1180 }] },
    { id: 11, name: 'Карбонара', description: 'Сливочный соус, моцарелла, бекон, пармезан, яйцо', price: 640, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'pizza', sizes: [{ name: '25см', price: 640 }, { name: '30см', price: 840 }, { name: '35см', price: 1040 }] },
    { id: 12, name: 'Сицилийская', description: 'Томатный соус, моцарелла, анчоусы, каперсы, оливки', price: 670, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'pizza', sizes: [{ name: '25см', price: 670 }, { name: '30см', price: 870 }, { name: '35см', price: 1070 }] },
    { id: 13, name: 'Мексиканская', description: 'Томатный соус, моцарелла, говядина, фасоль, кукуруза, перец чили', price: 680, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'pizza', sizes: [{ name: '25см', price: 680 }, { name: '30см', price: 880 }, { name: '35см', price: 1080 }] },
    
    { id: 14, name: 'Салат Цезарь', description: 'Курица, салат романо, помидоры черри, пармезан, соус цезарь', price: 320, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/ec1e89ac-0d85-4cde-9dd5-886b3f37fa6e.jpg', category: 'snacks' },
    { id: 15, name: 'Картофель фри', description: 'Хрустящий картофель с соусом на выбор', price: 180, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/ec1e89ac-0d85-4cde-9dd5-886b3f37fa6e.jpg', category: 'snacks' },
    { id: 16, name: 'Куриные наггетсы', description: '8 шт с соусом барбекю', price: 250, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/ec1e89ac-0d85-4cde-9dd5-886b3f37fa6e.jpg', category: 'snacks' },
    { id: 17, name: 'Чесночные гренки', description: 'С сырным соусом', price: 150, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/ec1e89ac-0d85-4cde-9dd5-886b3f37fa6e.jpg', category: 'snacks' },
    { id: 18, name: 'Моцарелла стики', description: '6 шт с томатным соусом', price: 280, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/ec1e89ac-0d85-4cde-9dd5-886b3f37fa6e.jpg', category: 'snacks' },

    { id: 19, name: 'Coca-Cola', description: '0.5л', price: 120, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/9db80cf6-8a0c-4e00-aa57-5a6be0f771c9.jpg', category: 'drinks' },
    { id: 20, name: 'Fanta', description: '0.5л', price: 120, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/9db80cf6-8a0c-4e00-aa57-5a6be0f771c9.jpg', category: 'drinks' },
    { id: 21, name: 'Sprite', description: '0.5л', price: 120, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/9db80cf6-8a0c-4e00-aa57-5a6be0f771c9.jpg', category: 'drinks' },
    { id: 22, name: 'Сок Rich', description: '1л', price: 180, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/9db80cf6-8a0c-4e00-aa57-5a6be0f771c9.jpg', category: 'drinks' },
    { id: 23, name: 'Вода Aqua Minerale', description: '0.5л', price: 80, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/9db80cf6-8a0c-4e00-aa57-5a6be0f771c9.jpg', category: 'drinks' },

    { id: 24, name: 'Комбо для одного', description: 'Пицца 25см + напиток + закуска', price: 750, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'combo' },
    { id: 25, name: 'Комбо для двоих', description: '2 пиццы 30см + 2 напитка + закуска', price: 1400, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'combo' },
    { id: 26, name: 'Вечеринка', description: '3 пиццы 35см + 3 напитка + 2 закуски', price: 2300, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'combo' },
    { id: 27, name: 'Детское комбо', description: 'Маленькая пицца + сок + мороженое', price: 550, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'combo' },
    { id: 28, name: 'Большая компания', description: '4 пиццы 35см + 4 напитка + 3 закуски', price: 3200, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'combo' },
  ];

  const addToCart = (item: MenuItem, size?: string) => {
    const existingItem = cart.find(cartItem => 
      cartItem.id === item.id && cartItem.selectedSize === size
    );

    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id && cartItem.selectedSize === size
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      const price = size && item.sizes 
        ? item.sizes.find(s => s.name === size)?.price || item.price
        : item.price;
      setCart([...cart, { ...item, quantity: 1, selectedSize: size, price }]);
    }
    
    toast.success(`${item.name} добавлена в корзину`);
  };

  const removeFromCart = (id: number, size?: string) => {
    setCart(cart.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const updateQuantity = (id: number, quantity: number, size?: string) => {
    if (quantity === 0) {
      removeFromCart(id, size);
    } else {
      setCart(cart.map(item =>
        item.id === id && item.selectedSize === size
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Pizza" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Пицца Синица</h1>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Корзина пуста</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                      {cart.map((item) => (
                        <Card key={`${item.id}-${item.selectedSize}`} className="p-4">
                          <div className="flex gap-4">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              {item.selectedSize && (
                                <p className="text-sm text-muted-foreground">{item.selectedSize}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                                >
                                  <Icon name="Minus" size={16} />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                                >
                                  <Icon name="Plus" size={16} />
                                </Button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{item.price * item.quantity} ₽</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 mt-2"
                                onClick={() => removeFromCart(item.id, item.selectedSize)}
                              >
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-4">
                        <span className="text-lg font-semibold">Итого:</span>
                        <span className="text-lg font-bold text-primary">{getTotalPrice()} ₽</span>
                      </div>
                      <Button className="w-full" size="lg">
                        Оформить заказ
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Оплата: карта, наличные, электронные кошельки
                      </p>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-4">Свежая пицца с доставкой за 30 минут</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Выбирайте из 13 видов пицц, добавляйте закуски и напитки. Следите за доставкой в реальном времени.
            </p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Icon name="Clock" size={16} className="mr-2" />
                Доставка 30 минут
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Icon name="Gift" size={16} className="mr-2" />
                Бонусная программа
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Icon name="MapPin" size={16} className="mr-2" />
                Отслеживание заказа
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pizza" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="pizza" className="flex items-center gap-2">
              <Icon name="Pizza" size={18} />
              Пиццы
            </TabsTrigger>
            <TabsTrigger value="snacks" className="flex items-center gap-2">
              <Icon name="Salad" size={18} />
              Закуски
            </TabsTrigger>
            <TabsTrigger value="drinks" className="flex items-center gap-2">
              <Icon name="Coffee" size={18} />
              Напитки
            </TabsTrigger>
            <TabsTrigger value="combo" className="flex items-center gap-2">
              <Icon name="Package" size={18} />
              Комбо
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pizza" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {menuItems.filter(item => item.category === 'pizza').map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                    <div className="space-y-2">
                      {item.sizes?.map((size) => (
                        <div key={size.name} className="flex items-center justify-between">
                          <span className="text-sm">{size.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{size.price} ₽</span>
                            <Button
                              size="sm"
                              onClick={() => addToCart(item, size.name)}
                            >
                              <Icon name="Plus" size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="snacks" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {menuItems.filter(item => item.category === 'snacks').map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">{item.price} ₽</span>
                      <Button onClick={() => addToCart(item)}>
                        <Icon name="Plus" size={16} className="mr-2" />
                        В корзину
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="drinks" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {menuItems.filter(item => item.category === 'drinks').map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">{item.price} ₽</span>
                      <Button onClick={() => addToCart(item)}>
                        <Icon name="Plus" size={16} className="mr-2" />
                        В корзину
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="combo" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {menuItems.filter(item => item.category === 'combo').map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow border-primary/50">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                    <Badge className="absolute top-2 right-2">Выгодно</Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">{item.price} ₽</span>
                      <Button onClick={() => addToCart(item)}>
                        <Icon name="Plus" size={16} className="mr-2" />
                        В корзину
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
        <div className="grid grid-cols-5 gap-1 p-2">
          <Button
            variant={activeTab === 'home' ? 'default' : 'ghost'}
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={() => setActiveTab('home')}
          >
            <Icon name="Home" size={20} />
            <span className="text-xs">Главная</span>
          </Button>
          <Button
            variant={activeTab === 'menu' ? 'default' : 'ghost'}
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={() => setActiveTab('menu')}
          >
            <Icon name="MenuSquare" size={20} />
            <span className="text-xs">Меню</span>
          </Button>
          <Button
            variant={activeTab === 'cart' ? 'default' : 'ghost'}
            className="flex flex-col items-center gap-1 h-auto py-2 relative"
            onClick={() => setActiveTab('cart')}
          >
            <Icon name="ShoppingCart" size={20} />
            <span className="text-xs">Корзина</span>
            {cartItemsCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {cartItemsCount}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'default' : 'ghost'}
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={() => setActiveTab('orders')}
          >
            <Icon name="Package" size={20} />
            <span className="text-xs">Заказы</span>
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={() => setActiveTab('profile')}
          >
            <Icon name="User" size={20} />
            <span className="text-xs">Профиль</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
