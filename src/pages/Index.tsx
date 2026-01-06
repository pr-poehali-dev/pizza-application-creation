import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
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

type Order = {
  id: number;
  date: string;
  items: CartItem[];
  total: number;
  status: 'preparing' | 'delivering' | 'delivered';
  address: string;
  paymentMethod: string;
};

type Promocode = {
  code: string;
  discount: number;
  description: string;
};

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [showCheckout, setShowCheckout] = useState(false);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      date: '2026-01-05',
      items: [
        { id: 1, name: 'Маргарита', description: 'Томатный соус, моцарелла, базилик', price: 650, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'pizza' as const, quantity: 1, selectedSize: '30см' }
      ],
      total: 650,
      status: 'delivered',
      address: 'ул. Ленина, д. 10, кв. 5',
      paymentMethod: 'Карта онлайн'
    },
    {
      id: 2,
      date: '2026-01-04',
      items: [
        { id: 2, name: 'Пепперони', description: 'Томатный соус, моцарелла, пепперони', price: 750, image: 'https://cdn.poehali.dev/projects/e16e619e-66fa-4660-a098-3fc15a73fc1e/files/bbbb93a8-c38e-4c8d-b5f3-337de108bc55.jpg', category: 'pizza' as const, quantity: 2, selectedSize: '30см' }
      ],
      total: 1500,
      status: 'delivered',
      address: 'ул. Ленина, д. 10, кв. 5',
      paymentMethod: 'Наличные'
    }
  ]);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promocode, setPromocode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Promocode | null>(null);
  
  const promocodes: Promocode[] = [
    { code: 'FIRST', discount: 20, description: 'Скидка 20% на первый заказ' },
    { code: 'PIZZA10', discount: 10, description: 'Скидка 10% на любую пиццу' },
    { code: 'COMBO15', discount: 15, description: 'Скидка 15% на комбо-наборы' }
  ];

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
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (appliedPromo) {
      return subtotal * (1 - appliedPromo.discount / 100);
    }
    return subtotal;
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const applyPromocode = () => {
    const promo = promocodes.find(p => p.code === promocode.toUpperCase());
    if (promo) {
      setAppliedPromo(promo);
      toast.success(`Промокод ${promo.code} применён! Скидка ${promo.discount}%`);
    } else {
      toast.error('Промокод не найден');
    }
  };

  const placeOrder = () => {
    if (!address || !phone) {
      toast.error('Заполните адрес и телефон');
      return;
    }
    
    const paymentMethods = {
      card: 'Карта онлайн',
      cash: 'Наличные',
      wallet: 'Электронный кошелёк'
    };

    const newOrder: Order = {
      id: orders.length + 1,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      total: getTotalPrice(),
      status: 'preparing',
      address,
      paymentMethod: paymentMethods[paymentMethod as keyof typeof paymentMethods]
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setShowCheckout(false);
    setAddress('');
    setPhone('');
    setPromocode('');
    setAppliedPromo(null);
    toast.success('Заказ оформлен! Следите за статусом в разделе "Заказы"');
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
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
                    <div className="border-t pt-4 space-y-4">
                      {!showCheckout ? (
                        <>
                          {appliedPromo && (
                            <div className="flex justify-between text-sm">
                              <span>Промокод {appliedPromo.code}:</span>
                              <span className="text-green-600">-{appliedPromo.discount}%</span>
                            </div>
                          )}
                          <div className="flex justify-between mb-4">
                            <span className="text-lg font-semibold">Итого:</span>
                            <span className="text-lg font-bold text-primary">{getTotalPrice()} ₽</span>
                          </div>
                          <Button className="w-full" size="lg" onClick={() => setShowCheckout(true)}>
                            Оформить заказ
                          </Button>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg">Оформление заказа</h3>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Телефон</Label>
                            <Input
                              id="phone"
                              placeholder="+7 (999) 123-45-67"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address">Адрес доставки</Label>
                            <Input
                              id="address"
                              placeholder="ул. Ленина, д. 10, кв. 5"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Способ оплаты</Label>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="card" id="card" />
                                <Label htmlFor="card" className="font-normal cursor-pointer">
                                  Карта онлайн
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cash" id="cash" />
                                <Label htmlFor="cash" className="font-normal cursor-pointer">
                                  Наличные при получении
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="wallet" id="wallet" />
                                <Label htmlFor="wallet" className="font-normal cursor-pointer">
                                  Электронный кошелёк
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <Label htmlFor="promo">Промокод</Label>
                            <div className="flex gap-2">
                              <Input
                                id="promo"
                                placeholder="Введите промокод"
                                value={promocode}
                                onChange={(e) => setPromocode(e.target.value)}
                                disabled={!!appliedPromo}
                              />
                              <Button 
                                variant="outline" 
                                onClick={applyPromocode}
                                disabled={!!appliedPromo || !promocode}
                              >
                                Применить
                              </Button>
                            </div>
                            {appliedPromo && (
                              <p className="text-sm text-green-600">
                                ✓ {appliedPromo.description}
                              </p>
                            )}
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Сумма заказа:</span>
                              <span>{getSubtotal()} ₽</span>
                            </div>
                            {appliedPromo && (
                              <div className="flex justify-between text-sm text-green-600">
                                <span>Скидка {appliedPromo.discount}%:</span>
                                <span>-{(getSubtotal() * appliedPromo.discount / 100).toFixed(0)} ₽</span>
                              </div>
                            )}
                            <div className="flex justify-between text-lg font-bold">
                              <span>Итого:</span>
                              <span className="text-primary">{getTotalPrice()} ₽</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setShowCheckout(false)} className="flex-1">
                              Назад
                            </Button>
                            <Button onClick={placeOrder} className="flex-1">
                              Подтвердить заказ
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {(activeTab === 'home' || activeTab === 'menu') && (
        <>
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
        </>
      )}

      {activeTab === 'orders' && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">Мои заказы</h2>
          {orders.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
                <p>У вас пока нет заказов</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">Заказ №{order.id}</h3>
                        <Badge variant={order.status === 'delivered' ? 'secondary' : 'default'}>
                          {order.status === 'preparing' && 'Готовится'}
                          {order.status === 'delivering' && 'В пути'}
                          {order.status === 'delivered' && 'Доставлен'}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p><Icon name="Calendar" size={16} className="inline mr-2" />{order.date}</p>
                        <p><Icon name="MapPin" size={16} className="inline mr-2" />{order.address}</p>
                        <p><Icon name="CreditCard" size={16} className="inline mr-2" />{order.paymentMethod}</p>
                      </div>
                      <Separator className="my-3" />
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.name} {item.selectedSize && `(${item.selectedSize})`} x{item.quantity}</span>
                            <span className="font-semibold">{item.price * item.quantity} ₽</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{order.total} ₽</p>
                      {order.status !== 'delivered' && (
                        <Button variant="outline" size="sm" className="mt-2">
                          <Icon name="MapPin" size={16} className="mr-2" />
                          Отследить
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'profile' && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">Профиль</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="User" size={24} />
                Личные данные
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Имя</Label>
                  <Input placeholder="Иван Иванов" />
                </div>
                <div>
                  <Label>Телефон</Label>
                  <Input placeholder="+7 (999) 123-45-67" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="ivan@example.com" />
                </div>
                <Button className="w-full">Сохранить</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="Tag" size={24} />
                Доступные промокоды
              </h3>
              <div className="space-y-3">
                {promocodes.map((promo) => (
                  <Card key={promo.code} className="p-4 border-2 border-dashed border-primary/30 bg-primary/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-primary text-lg">{promo.code}</p>
                        <p className="text-sm text-muted-foreground">{promo.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(promo.code);
                          toast.success('Промокод скопирован!');
                        }}
                      >
                        <Icon name="Copy" size={16} className="mr-2" />
                        Копировать
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="Gift" size={24} />
                Программа лояльности
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Ваши бонусы</p>
                  <p className="text-3xl font-bold text-primary">250 ₽</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Копите бонусы с каждого заказа и оплачивайте ими до 30% стоимости следующих покупок
                </p>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Заказов всего:</span>
                    <span className="font-semibold">{orders.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>На сумму:</span>
                    <span className="font-semibold">{orders.reduce((sum, o) => sum + o.total, 0)} ₽</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="MapPin" size={24} />
                Адреса доставки
              </h3>
              <div className="space-y-3">
                <Card className="p-3 border-primary/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2">Основной</Badge>
                      <p className="text-sm">ул. Ленина, д. 10, кв. 5</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Icon name="Pencil" size={16} />
                    </Button>
                  </div>
                </Card>
                <Button variant="outline" className="w-full">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить адрес
                </Button>
              </div>
            </Card>
          </div>
        </section>
      )}

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